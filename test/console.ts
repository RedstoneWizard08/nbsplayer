import { blue, cyan, green, magenta, red, yellow } from "colorette";
import puppeteer from "puppeteer";

const main = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on("console", (message) => {
        const type = message.type().substr(0, 3).toUpperCase();

        const colors = {
            LOG: (text) => text,
            ERR: red,
            WAR: yellow,
            INF: cyan,
        };

        const color = colors[type] || blue;

        console.log(color(`${type} ${message.text()}`));
    });

    page.on("pageerror", ({ message }) => console.log(red(message)));

    page.on("response", (response) =>
        console.log(green(`${response.status()} ${response.url()}`))
    );

    page.on("requestfailed", (request) =>
        console.log(magenta(`${request.failure().errorText} ${request.url()}`))
    );

    await page.goto(
        "https://redstonewizard08-nbsplayer-494rvr6x9v5fj6pj-3000.githubpreview.dev/"
    );
    await browser.close();
};

main();
