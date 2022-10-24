#!/usr/bin/env node
import { program } from "commander";
import { get_package_version } from "@/utils";
import gen from "@/commands/gen";
import init from "@/commands/init";
import char from "@/commands/char";
import scene from "@/commands/scene";
import bit from "@/commands/bit";
import shoot from "@/commands/shoot";
import whoami from "@/commands/whoami";

program
    .name("nai-studio")
    .version(get_package_version())
    .addCommand(gen)
    .addCommand(init)
    .addCommand(char)
    .addCommand(scene)
    .addCommand(bit)
    .addCommand(shoot)
    .addCommand(whoami)
    .parse();
