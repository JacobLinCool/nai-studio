import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import { Scene } from "@/types";

export function get_scene(name: string, dir = path.join(".scenes")): Scene {
    const file = path.join(dir, `${name.toLowerCase()}.json`);
    if (!fs.existsSync(file)) {
        throw new Error(`Scene ${name} does not exist.`);
    }

    return JSON.parse(fs.readFileSync(file, "utf-8"));
}

export function get_scenes(dir = path.join(".scenes")): Scene[] {
    const scenes: Scene[] = [];
    for (const file of fs.readdirSync(dir)) {
        try {
            const data = JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8"));
            scenes.push(data);
        } catch (err) {
            if (path.extname(file) === ".json") {
                console.log(chalk.red(`Failed to load scene ${file}`));
            }
        }
    }

    return scenes;
}

export function add_scene(scene: Scene, dir = path.join(".scenes")): void {
    try {
        get_scene(scene.name, dir);
        throw new Error(`Scene ${scene.name} already exists.`);
    } catch {
        fs.writeFileSync(
            path.join(dir, `${scene.name.toLowerCase()}.json`),
            JSON.stringify(scene, null, 4),
        );
    }
}

export function remove_scene(name: string, dir = path.join(".scenes")): void {
    get_scene(name, dir);
    fs.unlinkSync(path.join(dir, `${name.toLowerCase()}.json`));
}
