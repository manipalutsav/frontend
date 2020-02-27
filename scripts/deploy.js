const fs = require('fs');
const chalk = require('chalk');
const package = require("../package.json");
const { exec } = require("child_process");

if (package.config.mode.frontend != package.config.mode.backend) {
    console.error(chalk.red(`Frontend is point to ${package.config.mode.frontend} server and backend is pointing to ${package.config.mode.backend} server. Make sure you know what your doing!`));
    process.exit(1)
}

const modes = ["development", "testing", "production"];

if (modes.indexOf(package.config.mode.frontend) == -1) {
    console.error(chalk.red(`Unknown mode:  ${package.config.mode.frontend}`));
    process.exit(1)
}

const mode = package.config.mode.frontend;
const frontendServer = package.config.servers.frontend[mode];


fs.writeFileSync("./static/CNAME", frontendServer)

let cmd;
if (mode == "testing")
    cmd = `gh-pages -d public -r https://github.com/ManipalUtsav/test.manipalutsav.com -b master -m "Testing App Updated"`;
else if (mode == "production")
    cmd = `gh-pages -d public -r https://github.com/ManipalUtsav/manipalutsav.github.io -b master -m "Production App Updated"`;
else {
    console.log(chalk.red(`❌  Cannot deploy with the mode ${mode}`));
    process.exit(1);
}
console.log(chalk.yellow(`Deploying to ${frontendServer}`))

const ex = exec(cmd, (error, stdout, stderr) => {
    if (error) {
        console.log(chalk.red(JSON.stringify(error, 2)));
    }
    if (stderr) {
        console.log(chalk.red(JSON.stringify(stderr, 2)));
    }
    console.log(stdout);
    if (stdout.match(/Published/))
        console.log(chalk.green(`✔ Deployed to ${frontendServer}`));
})

