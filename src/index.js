#! /usr/bin/env node
import { Command } from "commander";
import * as Chalk from "chalk";
import { execa } from "execa";
import inquirer from "inquirer";
const chalk = Chalk.default;
const templates = {
    next: {
        "styled-components": "",
        tailwind: "",
        andromeda: "https://github.com/Zenith-Inovacoes/next-andromeda-starter",
    },
    nestjs: {},
};
const program = new Command();
async function createAndromedaProject(projectName) {
    const template = templates.next.andromeda;
    const packageManager = "pnpm";
    await createNextProject(projectName, template, packageManager);
}
async function createNextProject(projectName, template, packageManager) {
    var _a, _b, _c, _d;
    console.log(chalk.blueBright("Baixando template..."));
    const cloneProcess = execa("git", ["clone", template, projectName], {
        env: { FORCE_COLOR: "true" },
    });
    (_a = cloneProcess.stdout) === null || _a === void 0 ? void 0 : _a.pipe(process.stdout);
    (_b = cloneProcess.stderr) === null || _b === void 0 ? void 0 : _b.pipe(process.stderr);
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
    (_c = installProcess.stdout) === null || _c === void 0 ? void 0 : _c.pipe(process.stdout);
    (_d = installProcess.stderr) === null || _d === void 0 ? void 0 : _d.pipe(process.stderr);
    await installProcess;
    console.log(chalk.greenBright("Dependências instaladas com sucesso!"));
}
program
    .command("next")
    .argument("<name>", "name of the next project")
    .option("-c, --custom [value]", "custom configuration")
    .action(async (projectName, options) => {
    try {
        if (options.custom) {
            const answers = await inquirer.prompt([
                {
                    type: "list",
                    name: "cssFramework",
                    message: "Qual framework css deseja utilizar?",
                    choices: ["tailwind", "styled-components"],
                },
                {
                    type: "list",
                    name: "packageManager",
                    message: "Qual gerenciador de pacotes deseja utilizar?",
                    choices: ["pnpm", "yarn", "npm"],
                },
            ]);
            const template = templates.next[answers.cssFramework];
            const packageManager = answers.packageManager;
            createNextProject(projectName, template, packageManager);
        }
        else {
            await createAndromedaProject(projectName);
        }
    }
    catch (err) {
        console.log(chalk.redBright("Erro ao criar projeto: " + err.message));
    }
});
program.parse();
//# sourceMappingURL=index.js.map