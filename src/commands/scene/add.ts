import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import { get_scene, add_scene } from "./lib";
import { sort_traits } from "@/utils";

const command = new Command("add")
    .description("Add scene")
    .option("-n, --name <name>", "Name of the scene", "")
    .option("-d, --description <description>", "Description of the scene", "")
    .option("-t, --traits <traits...>", "Traits of the scene", [])
    .action(add);

async function add({ name = "", description = "", traits = [] as string[] }) {
    try {
        get_scene(name);
        console.error(chalk.red(`Scene "${name}" already exists.`));
        return;
    } catch {
        // Scene does not exist
    }

    if (!name) {
        const { name: _name } = await inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: "Scene's name?",
            },
        ]);

        if (!_name) {
            console.error(chalk.red("Scene's name can not be empty."));
        }
        name = _name;
    }

    if (!description) {
        const { description: _description } = await inquirer.prompt([
            {
                type: "input",
                name: "description",
                message: "Scene's description?",
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
                    message: "Scene's trait? (Once at a time, leave empty to finish)",
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

    add_scene({ name, description, traits });
    console.log(chalk.green(`Scene ${name} has been added.`));
}

export default command;
