import { Command } from "commander";
import chalk from "chalk";
import { get_bits } from "./lib";

const command = new Command("list")
    .alias("ls")
    .description("List prompt pieces")
    .option("-f, --filter <filter>", "Filter Prompt pieces by name, description and traits")
    .action(list);

function list({ filter = "" }) {
    const bits = get_bits();

    if (bits.length === 0) {
        console.log(chalk.yellow("There are no prompt pieces in the studio."));
    }

    const filtered_bits = bits.filter((bit) => {
        const { name, description, traits } = bit;
        const text = [name, description, ...traits].join(" ").toLowerCase();
        return text.includes(filter.toLowerCase());
    });

    for (const bit of filtered_bits) {
        console.log(
            chalk.yellowBright(bit.name) +
                (bit.description ? chalk.grey(" - " + bit.description) : ""),
        );

        console.log(bit.traits.map((trait) => chalk.bold(trait)).join(chalk.gray(", ")));
    }
}

export default command;
