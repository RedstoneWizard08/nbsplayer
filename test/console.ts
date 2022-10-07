import { blue, cyan, green, magenta, red, yellow } from "colorette";
import * as puppeteer from "puppeteer";

const main = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on("console", async (message) => {
        const type: string = message.type().substr(0, 3).toUpperCase();

        const colors: { [key: string]: (text: string) => string } = {
            LOG: (text: string) => text,
            ERR: red,
            WAR: yellow,
            INF: cyan,
        };

        const color = colors[type] || blue;

        console.log(color(`${type} ${message.text()}`));

        if (message.text() == "Fully loaded!") {
            await page.$eval("#dismiss", (el: any) => el.click());
        }
    });

    page.on("pageerror", ({ message }) => console.log(red(message)));

    page.on(
        "response",
        (response) =>
            response.status() !== 200 &&
            response.status() !== 304 &&
            console.log(green(`${response.status()} ${response.url()}`))
    );

    page.on("requestfailed", (request) =>
        console.log(magenta(`${request.failure()?.errorText} ${request.url()}`))
    );

    await page.goto(
        "https://redstonewizard08-nbsplayer-494rvr6x9v5fj6pj-3000.githubpreview.dev/"
    );

    await new Promise((resolve) => setTimeout(resolve, 10000000));

    await browser.close();
};

main();
