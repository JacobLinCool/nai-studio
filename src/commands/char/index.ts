import { Command } from "commander";
import list from "./list";
import add from "./add";
import remove from "./remove";

const command = new Command("char")
    .alias("chars")
    .description("Manage characters")
    .addCommand(list)
    .addCommand(add)
    .addCommand(remove);

export default command;
