import fs from "node:fs";
import path from "node:path";

export class History {
    constructor(public name: string) {}

    public add(settings: any): void {
        const file = path.join(".history", `${this.name}.json`);
        if (!fs.existsSync(file)) {
            fs.writeFileSync(file, JSON.stringify([], null, 4));
        }

        const history = JSON.parse(fs.readFileSync(file, "utf-8"));
        history.push(settings);
        fs.writeFileSync(file, JSON.stringify(history, null, 4));
    }

    public get(): any[] {
        const file = path.join(".history", `${this.name}.json`);
        if (!fs.existsSync(file)) {
            return [];
        }

        return JSON.parse(fs.readFileSync(file, "utf-8"));
    }
}
