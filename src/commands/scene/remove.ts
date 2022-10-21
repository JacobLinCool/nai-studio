import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import { get_scene, remove_scene } from "./lib";

const command = new Command("remove")
    .alias("rm")
    .description("Remove scene")
    .option("-n, --name <name>", "Name of the scene", "")
    .action(remove);

async function remove({ name = "" }) {
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

    try {
        get_scene(name);
    } catch {
        console.error(chalk.red(`Scene "${name}" does not exist.`));
        return;
    }

    remove_scene(name);
    console.log(chalk.green(`Scene ${name} removed.`));
}

export default command;
