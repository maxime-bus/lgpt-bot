import {DiscordBotConfiguration, registerCommands} from "./discord-bot/bot-command-registration";
import {LgptBot} from "./discord-bot/discord-bot";
import {createAxiosInstance, LolRestClient} from "./lol-client/lol-rest-client";

const exitWithFailureIfNotProvided = (requiredValue: any, errorMessage: string) => {
    if (!requiredValue) {
        console.error(errorMessage);
        process.exit(1);
    }
}

function main() {
    exitWithFailureIfNotProvided(process.env.CLIENT_ID, "Please provide a client id");
    exitWithFailureIfNotProvided(process.env.GUILD_ID, "Please provide a guild id");
    exitWithFailureIfNotProvided(process.env.LGPT_BOT_TOKEN, "Please provide a bot token");
    exitWithFailureIfNotProvided(process.env.LOL_TOKEN, "Please provide a lol api token");

    registerCommands(new DiscordBotConfiguration(
        // @ts-ignore
        process.env.CLIENT_ID,
        process.env.GUILD_ID,
        process.env.LGPT_BOT_TOKEN));

    const lolRestClient = new LolRestClient(createAxiosInstance(
        // @ts-ignore
        process.env.LOL_TOKEN));

    new LgptBot(lolRestClient)
        .login(
            // @ts-ignore
            process.env.LGPT_BOT_TOKEN);
}

main();