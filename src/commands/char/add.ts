import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import { get_character, add_character } from "./lib";
import { sort_traits } from "@/utils";

const command = new Command("add")
    .description("Add character")
    .option("-n, --name <name>", "Name of the character", "")
    .option("-d, --description <description>", "Description of the character", "")
    .option("-t, --traits <traits...>", "Traits of the character", [])
    .action(add);

async function add({ name = "", description = "", traits = [] as string[] }) {
    try {
        get_character(name);
        console.error(chalk.red(`Character "${name}" already exists.`));
        return;
    } catch {
        // Character does not exist
    }

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

    if (!description) {
        const { description: _description } = await inquirer.prompt([
            {
                type: "input",
                name: "description",
                message: "Character's description?",
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
                    message: "Character's trait? (Once at a time, leave empty to finish)",
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

    add_character({ name, description, traits });
    console.log(chalk.green(`${name} joined the studio.`));
}

export default command;
