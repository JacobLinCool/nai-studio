import fs from "node:fs";
import path from "node:path";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function jwt_data(jwt: string): any {
    const segment = jwt.split(".")[1];
    const data = Buffer.from(segment, "base64").toString("utf8");
    return JSON.parse(data);
}

export function find_chrome(): string {
    const chrome_path = process.env.CHROME_PATH;
    if (chrome_path) {
        return chrome_path;
    }

    const candidates: Partial<Record<typeof process.platform, string[]>> = {
        win32: [
            "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
            "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
            "C:\\Program Files (x86)\\Google\\Chrome\\chrome.exe",
            "C:\\Program Files\\Google\\Chrome\\chrome.exe",
        ],
        darwin: [
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
        ],
        linux: [
            "/usr/bin/google-chrome",
            "/usr/bin/google-chrome-stable",
            "/usr/bin/google-chrome-unstable",
            "/usr/bin/google-chrome-beta",
            "/usr/bin/google-chrome-dev",
            "/usr/bin/chromium-browser",
            "/usr/bin/chromium",
        ],
    };

    let location = "";

    if (candidates[process.platform]) {
        for (const candidate of candidates[process.platform] as string[]) {
            if (fs.existsSync(candidate)) {
                location = candidate;
                break;
            }
        }
    }

    return location;
}

export function get_package_version(): string {
    const pkg = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../package.json"), { encoding: "utf-8" }),
    );
    return pkg.version;
}

export function sort_traits(
    traits: string[],
    groups = [["ear"], ["hair"], ["eye"], ["background"], ["from"]],
): void {
    for (const group of groups) {
        traits.sort((a, b) => {
            const lower_a = a.toLowerCase();
            const lower_b = b.toLowerCase();
            const a_in_group = group.some((word) => lower_a.includes(word));
            const b_in_group = group.some((word) => lower_b.includes(word));

            if (a_in_group && !b_in_group) {
                return 1;
            }
            if (b_in_group && !a_in_group) {
                return -1;
            }

            return 0;
        });
    }
}
