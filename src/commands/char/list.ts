import { Command } from "commander";
import chalk from "chalk";
import { get_characters } from "./lib";

const command = new Command("list")
    .alias("ls")
    .description("List characters")
    .option("-f, --filter <filter>", "Filter characters by name, description and traits")
    .action(list);

function list({ filter = "" }) {
    const characters = get_characters();

    if (characters.length === 0) {
        console.log(chalk.yellow("No one is in the studio."));
    }

    const filtered_characters = characters.filter((character) => {
        const { name, description, traits } = character;
        const text = [name, description, ...traits].join(" ").toLowerCase();
        return text.includes(filter.toLowerCase());
    });

    for (const character of filtered_characters) {
        console.log(
            chalk.yellowBright(character.name) +
                (character.description ? chalk.grey(" - " + character.description) : ""),
        );

        console.log(character.traits.map((trait) => chalk.bold(trait)).join(chalk.gray(", ")));
    }
}

export default command;
