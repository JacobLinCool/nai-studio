#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import debug from "debug";
import { config } from "dotenv";
import { program } from "commander";
import { NovelAI } from "./novel-ai";
import { get_package_version } from "./utils";

config();

program
    .name("nai-studio")
    .version(get_package_version())
    .argument("<prompt>", "The prompt to draw from")
    .option("-n, --negative [negative]", "Negative text prompt", "")
    .option("-w, --width [width]", "The width of the image (in pixels)", Number, 512)
    .option("-h, --height [height]", "The height of the image (in pixels)", Number, 768)
    .option("-s, --steps [steps]", "The number of steps to take", Number, 28)
    .option("-S, --scale [scale]", "Configures zoom", Number, 11)
    .option("--seed [seed]", "A seed for the image", Number, Math.floor(Math.random() * 2147483647))
    .option("-d, --debug", "Debug mode", false)
    .option("--disable-check", "Disables input size and scale checking", false)
    .option("-o, --output <output>", "Image output filepath", "./images/image-{time}-{seed}.png")
    .option(
        "-t, --token [token]",
        "The novel.ai token (env: NOVEL_AI_TOKEN)",
        process.env.NOVEL_AI_TOKEN,
    )
    .action(
        async (
            prompt: string,
            options: {
                negative: string;
                width: number;
                height: number;
                steps: number;
                scale: number;
                seed: number;
                debug: boolean;
                disableCheck: boolean;
                output: string;
                token: string;
            },
        ) => {
            if (options.debug) {
                debug.enable("novel-ai:*");
            }

            const ai = new NovelAI(options.token).check(!options.disableCheck);

            if (process.env.NOVEL_AI_USERNAME && process.env.NOVEL_AI_PASSWORD) {
                const token = await ai.login(
                    process.env.NOVEL_AI_USERNAME,
                    process.env.NOVEL_AI_PASSWORD,
                );

                if (fs.existsSync(".env")) {
                    const envfile = fs.readFileSync(".env", { encoding: "utf-8" });
                    fs.writeFileSync(
                        ".env",
                        envfile.includes("NOVEL_AI_TOKEN")
                            ? envfile.replace(/^NOVEL_AI_TOKEN=.*$/gm, `NOVEL_AI_TOKEN=${token}`)
                            : `${envfile}\nNOVEL_AI_TOKEN=${token}`,
                    );
                }
            }

            try {
                const date = new Date();

                const config = {
                    width: options.width,
                    height: options.height,
                    steps: options.steps,
                    scale: options.scale,
                    seed: options.seed,
                };

                const image = await ai.image(prompt, options.negative, config);

                const filename = options.output
                    .replace(
                        /\{time\}/g,
                        date.getFullYear() +
                            (date.getMonth() + 1).toString().padStart(2, "0") +
                            date.getDate().toString().padStart(2, "0") +
                            date.getHours().toString().padStart(2, "0") +
                            date.getMinutes().toString().padStart(2, "0") +
                            date.getSeconds().toString().padStart(2, "0"),
                    )
                    .replace(/\{seed\}/g, options.seed.toString());

                fs.mkdirSync(path.dirname(filename), { recursive: true });
                fs.writeFileSync(filename, image);
                fs.writeFileSync(
                    filename.replace(/\.png$/, ".json"),
                    JSON.stringify({ prompt, negative: options.negative, ...config }),
                );
                console.log(`Saved image to \x1b[93m${filename}\x1b[39m`);
            } catch (err) {
                if (err instanceof Error) {
                    console.error(`\x1b[91mError: ${err.message}\x1b[39m`);
                }
            }
        },
    );

program.parse();
