import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import { Bit } from "@/types";

export function get_bit(name: string, dir = path.join(".bits")): Bit {
    const file = path.join(dir, `${name.toLowerCase()}.json`);
    if (!fs.existsSync(file)) {
        throw new Error(`Prompt piece ${name} does not exist.`);
    }

    return JSON.parse(fs.readFileSync(file, "utf-8"));
}

export function get_bits(dir = path.join(".bits")): Bit[] {
    const bits: Bit[] = [];
    for (const file of fs.readdirSync(dir)) {
        try {
            const data = JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8"));
            bits.push(data);
        } catch (err) {
            if (path.extname(file) === ".json") {
                console.log(chalk.red(`Failed to load bit ${file}`));
            }
        }
    }

    return bits;
}

export function add_bit(bit: Bit, dir = path.join(".bits")): void {
    try {
        get_bit(bit.name, dir);
        throw new Error(`Prompt piece ${bit.name} already exists.`);
    } catch {
        fs.writeFileSync(
            path.join(dir, `${bit.name.toLowerCase()}.json`),
            JSON.stringify(bit, null, 4),
        );
    }
}

export function remove_bit(name: string, dir = path.join(".bits")): void {
    get_bit(name, dir);
    fs.unlinkSync(path.join(dir, `${name.toLowerCase()}.json`));
}
