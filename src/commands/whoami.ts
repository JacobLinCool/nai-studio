import { Command } from "commander";
import { config } from "dotenv";
import { NovelAI } from "@/novel-ai";

config();

const command = new Command("whoami")
    .alias("who")
    .description("Get information about the current token")
    .action(async function () {
        const nai = new NovelAI(process.env.NOVEL_AI_TOKEN);
        console.log(JSON.stringify(await nai.whoami(), null, 4));
    });

export default command;
