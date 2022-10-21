import { Command } from "commander";
import list from "./list";
import add from "./add";
import remove from "./remove";

const command = new Command("bit")
    .alias("bits")
    .alias("prompt")
    .description("Manage prompt pieces")
    .addCommand(list)
    .addCommand(add)
    .addCommand(remove);

export default command;
