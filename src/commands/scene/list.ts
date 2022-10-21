import { Command } from "commander";
import chalk from "chalk";
import { get_scenes } from "./lib";

const command = new Command("list")
    .alias("ls")
    .description("List scenes")
    .option("-f, --filter <filter>", "Filter scenes by name, description and traits")
    .action(list);

function list({ filter = "" }) {
    const scenes = get_scenes();

    if (scenes.length === 0) {
        console.log(chalk.yellow("There are no scenes in the studio."));
    }

    const filtered_scenes = scenes.filter((scene) => {
        const { name, description, traits } = scene;
        const text = [name, description, ...traits].join(" ").toLowerCase();
        return text.includes(filter.toLowerCase());
    });

    for (const scene of filtered_scenes) {
        console.log(
            chalk.yellowBright(scene.name) +
                (scene.description ? chalk.grey(" - " + scene.description) : ""),
        );

        console.log(scene.traits.map((trait) => chalk.bold(trait)).join(chalk.gray(", ")));
    }
}

export default command;
