import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import { get_bit, remove_bit } from "./lib";

const command = new Command("remove")
    .alias("rm")
    .description("Remove prompt piece")
    .option("-n, --name <name>", "Name of the prompt piece", "")
    .action(remove);

async function remove({ name = "" }) {
    if (!name) {
        const { name: _name } = await inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: "Prompt piece's name?",
            },
        ]);

        if (!_name) {
            console.error(chalk.red("Prompt piece's name can not be empty."));
        }
        name = _name;
    }

    try {
        get_bit(name);
    } catch {
        console.error(chalk.red(`Prompt piece "${name}" does not exist.`));
        return;
    }

    remove_bit(name);
    console.log(chalk.green(`Prompt piece ${name} removed.`));
}

export default command;
