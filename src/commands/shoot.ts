import fs from "node:fs";
import path from "node:path";
import debug from "debug";
import ora from "ora";
import chalk from "chalk";
import { config } from "dotenv";
import { Command } from "commander";
import { NovelAI } from "@/novel-ai";
import { History } from "@/history";
import { get_characters } from "./char/lib";
import { get_scenes } from "./scene/lib";
import { get_bits } from "./bit/lib";

config();

const command = new Command("shoot")
    .description("Generate an image from characters, scenes, and prompts")
    .argument("<prompt...>", "The character/scene/prompt to draw from")
    .option("-c, --collection <collection>", "The collection name")
    .option("-n, --negative [negative]", "Negative text prompt", "")
    .option("-w, --width [width]", "The width of the image (in pixels)", Number, 512)
    .option("-h, --height [height]", "The height of the image (in pixels)", Number, 768)
    .option("-s, --steps [steps]", "The number of steps to take", Number, 28)
    .option("-S, --scale [scale]", "Configures zoom", Number, 11)
    .option("--seed [seed]", "A seed for the image", Number, Math.floor(Math.random() * 2147483647))
    .option("-b, --batch [batch]", "The number of batches to generate", Number, 1)
    .option("-d, --debug", "Debug mode", false)
    .option("--disable-check", "Disables input size and scale checking", false)
    .option("-o, --output <output>", "Image output filepath", "./output/image-{time}-{seed}.png")
    .option(
        "-t, --token [token]",
        "The novel.ai token (env: NOVEL_AI_TOKEN)",
        process.env.NOVEL_AI_TOKEN,
    )
    .action(gen);

async function gen(
    prompt: string[],
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
        batch: number;
        collection?: string;
    },
) {
    if (options.debug) {
        debug.enable("novel-ai:*");
    }

    const ai = new NovelAI(options.token).check(!options.disableCheck);

    if (process.env.NOVEL_AI_USERNAME && process.env.NOVEL_AI_PASSWORD) {
        const token = await ai.login(process.env.NOVEL_AI_USERNAME, process.env.NOVEL_AI_PASSWORD);

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

    const config = {
        width: options.width,
        height: options.height,
        steps: options.steps,
        scale: options.scale,
        seed: options.seed,
    };

    const characters = get_characters();
    const scenes = get_scenes();
    const bits = get_bits();
    let replaced_prompt = prompt.join(", ");
    for (const value of [...characters, ...scenes, ...bits]) {
        if (typeof value === "object") {
            replaced_prompt = replaced_prompt.replace(
                new RegExp(value.name.toLowerCase(), "i"),
                value.traits.join(", "),
            );
        }
    }

    const history = new History(options.collection || `shoot-${Date.now()}`);
    const num_padding = String(options.batch).length;
    for (let i = 0; i < options.batch; i++) {
        const spinner = ora(
            `Generating image from "${replaced_prompt}" (${(i + 1)
                .toString()
                .padStart(num_padding, "0")}/${options.batch})`,
        ).start();

        if (i !== 0) {
            config.seed = Math.floor(Math.random() * 2147483647);
        }

        try {
            const date = new Date();
            const image = await ai.image(replaced_prompt, options.negative, config);

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
            history.add({ prompt: replaced_prompt, negative: options.negative, ...config });

            spinner.succeed(
                `Generated image "${filename}" (${(i + 1).toString().padStart(num_padding, "0")}/${
                    options.batch
                })`,
            );
        } catch (err) {
            spinner.fail(
                `Failed to generate image (${(i + 1).toString().padStart(num_padding, "0")}/${
                    options.batch
                })`,
            );

            if (err instanceof Error) {
                console.error(chalk.red(err));
            }
        }
    }
}

export default command;
