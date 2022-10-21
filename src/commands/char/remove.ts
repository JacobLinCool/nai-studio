import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import { get_character, remove_character } from "./lib";

const command = new Command("remove")
    .alias("rm")
    .description("Remove character")
    .option("-n, --name <name>", "Name of the character", "")
    .action(remove);

async function remove({ name = "" }) {
    if (!name) {
        const { name: _name } = await inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: "Character's name?",
            },
        ]);

        if (!_name) {
            console.error(chalk.red("Character's name can not be empty."));
        }
        name = _name;
    }

    try {
        get_character(name);
    } catch {
        console.error(chalk.red(`Character "${name}" does not exist.`));
        return;
    }

    remove_character(name);
    console.log(chalk.green(`${name} left the studio. Goodbye!`));
}

export default command;
