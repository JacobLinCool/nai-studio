import fs from "node:fs";
import path from "node:path";
import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";

const command = new Command("init")
    .description("Initialize a new workspace")
    .option("-f, --force", "Force initialization", false)
    .option("-d, --dir <dir>", "The directory to initialize", process.cwd())
    .action(init);

async function init({ force = false, dir = process.cwd() } = {}) {
    const is_empty = fs.readdirSync(dir).length === 0;
    if (!is_empty && !force) {
        const { confirm } = await inquirer.prompt([
            {
                type: "confirm",
                name: "confirm",
                message: "Directory is not empty. Continue?",
                default: false,
            },
        ]);
        if (!confirm) {
            console.log(chalk.red("Aborted."));
            return;
        }
    }

    const { username, password } = await inquirer.prompt([
        {
            type: "input",
            name: "username",
            message: "Your NovelAI Username",
        },
        {
            type: "password",
            name: "password",
            message: "Your NovelAI Password",
        },
    ]);

    const dirs = [".characters", ".scenes", ".bits", ".history", "output"];
    for (const dir of dirs) {
        fs.mkdirSync(path.join(dir), { recursive: true });
    }

    const files = {
        ".env": `NOVEL_AI_USERNAME=${username}\nNOVEL_AI_PASSWORD=${password}\n`,
        ".gitignore": "output/\n",
    };
    for (const [file, content] of Object.entries(files)) {
        fs.writeFileSync(path.join(file), content);
    }

    console.log(chalk.green("Initialized."));
}

export default command;
