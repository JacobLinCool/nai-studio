import { chromium } from "playwright-core";
import fetch from "node-fetch";
import debug from "debug";
import { jwt_data, find_chrome } from "./utils";
import { sampler as SAMPLER, model as MODEL } from "./constants";
import { AccessToken } from "./types";

export class NovelAI {
    public token?: string;
    private _check = true;
    private debugger: debug.Debugger;

    public constructor(existing_token?: string) {
        this.token = existing_token;
        this.debugger = debug(
            `novel-ai:${existing_token ? jwt_data(existing_token).id : "no-token"}`,
        );
    }

    public async login(username: string, password: string): Promise<string> {
        if (this.token) {
            const result = await this.whoami();

            if (result.perks.imageGeneration) {
                this.debugger("token still works");
                return this.token;
            } else {
                this.debugger("token fails, trying to login");
            }
        }

        this.debugger("logging in");
        const browser = await chromium.launch({ executablePath: find_chrome() });
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto("https://novelai.net/login");
        await page.waitForLoadState("networkidle");

        let ok = false;
        const token = new Promise<string>((resolve) => {
            context.addListener("response", async (res) => {
                if (res.url().includes("/user/login") && res.request().method() === "POST") {
                    const { accessToken } = await res.json();
                    ok = true;
                    resolve(accessToken);
                }
            });
        });

        await page.fill("input#username", username);
        await page.fill("input#password", password);
        await page.click("input[type='submit']");

        const timeout = new Promise<string>((_, reject) => {
            setTimeout(() => {
                if (!ok) {
                    reject("Login timed out");
                }
            }, 10_000);
        });

        try {
            this.token = await Promise.race([token, timeout]);
            await browser.close();
            this.debugger.namespace = `novel-ai:${jwt_data(this.token).id}`;
            this.debugger("logged in");

            return this.token;
        } catch (err) {
            await browser.close();
            throw err;
        }
    }

    public async whoami(): Promise<AccessToken> {
        this.debugger("checking token");
        const res = await fetch("https://api.novelai.net/user/subscription", {
            headers: {
                authorization: `Bearer ${this.token}`,
                "content-type": "application/json; charset=utf-8",
            },
        });

        const result = await res.json();
        this.debugger(result);

        return result;
    }

    public check(do_check: boolean): this {
        this._check = do_check;
        return this;
    }

    public async image(
        positive: string,
        negative = "",
        {
            model = MODEL.safe as typeof MODEL[keyof typeof MODEL],
            width = 512,
            height = 768,
            steps = 28,
            scale = 11,
            sampler = SAMPLER.k_euler_ancestral as typeof SAMPLER[keyof typeof SAMPLER],
            seed = Math.floor(Math.random() * 2147483647),
            n_samples = 1,
            disable_default_nc = false,
        } = {},
    ): Promise<Buffer> {
        if (!this.token) {
            throw new Error("No token set");
        }

        if (this._check) {
            if (width * height > 409600) {
                throw new Error("Image size is greater than 409600");
            }
            if (steps > 28) {
                throw new Error("Steps is greater than 28");
            }
            if (n_samples > 1) {
                throw new Error("n_samples is greater than 1");
            }
        }

        if (positive.length === 0) {
            throw new Error("positive is empty");
        }

        const payload = {
            input: positive,
            model,
            parameters: {
                width,
                height,
                steps,
                scale,
                sampler,
                seed,
                n_samples,
                ucPreset: 0,
                qualityToggle: true,
                uc:
                    (disable_default_nc
                        ? ""
                        : "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, ") +
                    negative,
            },
        };
        this.debugger(payload);

        const res = await fetch("https://api.novelai.net/ai/generate-image", {
            method: "POST",
            headers: {
                authorization: `Bearer ${this.token}`,
                "content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(payload),
        });
        this.debugger(
            `${res.url}: ${res.status} ${res.statusText} - ${res.headers.get(
                "x-envoy-upstream-service-time",
            )} ms`,
        );

        const data = await res.text();
        const match = data.match(/data:(\S+)/);
        if (!match) {
            throw new Error("No image data found");
        }

        return Buffer.from(match[1], "base64");
    }
}
