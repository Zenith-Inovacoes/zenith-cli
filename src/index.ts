#! /usr/bin/env node

import { Command } from "commander";
import * as Chalk from "chalk";
import { execa } from "execa";
import inquirer from "inquirer";
const chalk = Chalk.default;
const templates = {
  next: {
    "styled-components":
      "https://github.com/Zenith-Inovacoes/next-andromeda-starter",
    tailwind: "",
    andromeda: "https://github.com/Zenith-Inovacoes/next-andromeda-starter",
  },
  nestjs: {},
};

const program = new Command();

async function createAndromedaProject(projectName: string) {
  const template = templates.next.andromeda;
  const packageManager = "pnpm";
  await createNextProject(projectName, template, packageManager);
}

async function createNextProject(
  projectName: string,
  template: string,
  packageManager: string
) {
  console.log(chalk.blueBright("Baixando template..."));

  const cloneProcess = execa("git", ["clone", template, projectName], {
    env: { FORCE_COLOR: "true" },
  });
  cloneProcess.stdout?.pipe(process.stdout);
  cloneProcess.stderr?.pipe(process.stderr);
  await cloneProcess;

  console.log(chalk.greenBright("Template baixado com sucesso!"));

  console.log(chalk.blueBright("Instalando dependências..."));
  await execa("rm", ["-rf", ".git"], {
    cwd: projectName,
  });
  const installProcess = execa(packageManager, ["install"], {
    cwd: projectName,
    env: { FORCE_COLOR: "true" },
  });
  installProcess.stdout?.pipe(process.stdout);
  installProcess.stderr?.pipe(process.stderr);
  await installProcess;
  console.log(chalk.greenBright("Dependências instaladas com sucesso!"));
}

program
  .command("next")
  .argument("<name>", "name of the next project")
  .option("-c, --custom [value]", "custom configuration")
  .action(async (projectName: string, options: { custom: true }) => {
    try {
      if (options.custom) {
        const answers = await inquirer.prompt([
          {
            type: "list",
            name: "cssFramework",
            message: "Qual framework css deseja utilizar?",
            choices: ["styled-components"],
          },
          {
            type: "list",
            name: "packageManager",
            message: "Qual gerenciador de pacotes deseja utilizar?",
            choices: ["pnpm", "yarn", "npm"],
          },
        ]);
        const template =
          templates.next[answers.cssFramework as keyof typeof templates.next];

        const packageManager = answers.packageManager;

        createNextProject(projectName, template, packageManager);
      } else {
        await createAndromedaProject(projectName);
      }
    } catch (err: any) {
      console.log(chalk.redBright("Erro ao criar projeto: " + err.message));
    }
  });

program.parse();
