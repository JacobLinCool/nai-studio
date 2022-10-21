import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import { get_bit, add_bit } from "./lib";
import { sort_traits } from "@/utils";

const command = new Command("add")
    .description("Add a piece of prompt")
    .option("-n, --name <name>", "Name of the prompt", "")
    .option("-d, --description <description>", "Description of the prompt", "")
    .option("-t, --traits <traits...>", "Traits of the prompt", [])
    .action(add);

async function add({ name = "", description = "", traits = [] as string[] }) {
    try {
        get_bit(name);
        console.error(chalk.red(`Prompt peice "${name}" already exists.`));
        return;
    } catch {
        // Bit does not exist
    }

    if (!name) {
        const { name: _name } = await inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: "Prompt peice's name?",
            },
        ]);

        if (!_name) {
            console.error(chalk.red("Prompt peice's name can not be empty."));
        }
        name = _name;
    }

    if (!description) {
        const { description: _description } = await inquirer.prompt([
            {
                type: "input",
                name: "description",
                message: "Prompt peice's description?",
            },
        ]);

        if (_description) {
            description = _description;
        }
    }

    if (traits.length === 0) {
        let done = false;
        while (done === false) {
            const { trait } = await inquirer.prompt([
                {
                    type: "input",
                    name: "trait",
                    message: "Prompt peice's trait? (Once at a time, leave empty to finish)",
                },
            ]);

            if (trait) {
                traits.push(trait);
            } else {
                done = true;
            }
        }
    }

    sort_traits(traits);

    add_bit({ name, description, traits });
    console.log(chalk.green(`Prompt peice ${name} added.`));
}

export default command;
