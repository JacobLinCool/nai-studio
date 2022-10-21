import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import { Character } from "@/types";

export function get_character(name: string, dir = path.join(".characters")): Character {
    const file = path.join(dir, `${name.toLowerCase()}.json`);
    if (!fs.existsSync(file)) {
        throw new Error(`Character ${name} does not exist.`);
    }

    return JSON.parse(fs.readFileSync(file, "utf-8"));
}

export function get_characters(dir = path.join(".characters")): Character[] {
    const characters: Character[] = [];
    for (const file of fs.readdirSync(dir)) {
        try {
            const data = JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8"));
            characters.push(data);
        } catch (err) {
            if (path.extname(file) === ".json") {
                console.log(chalk.red(`Failed to load character ${file}`));
            }
        }
    }

    return characters;
}

export function add_character(character: Character, dir = path.join(".characters")): void {
    try {
        get_character(character.name, dir);
        throw new Error(`Character ${character.name} already exists.`);
    } catch {
        fs.writeFileSync(
            path.join(dir, `${character.name.toLowerCase()}.json`),
            JSON.stringify(character, null, 4),
        );
    }
}

export function remove_character(name: string, dir = path.join(".characters")): void {
    get_character(name, dir);
    fs.unlinkSync(path.join(dir, `${name.toLowerCase()}.json`));
}
