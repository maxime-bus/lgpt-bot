import {Client, Intents, Interaction, Message} from "discord.js";
import {LolRestClient} from "../lol-client/lol-rest-client";
import {lolRankedInfoCommand} from "./bot-command-registration";

export class LgptBot {
    private readonly discordClient: Client;

    constructor(public readonly lolClient: LolRestClient) {
        this.discordClient = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]})

        this.discordClient.once('ready', () => {
            console.log('Ready!');
        });

        this.discordClient.on('interactionCreate', (interaction: Interaction) => {
            if (!interaction.isCommand()) return;

            if (interaction.commandName === lolRankedInfoCommand.name) {
                const summonerName = interaction.options.get('summoner-name', true).value as string;
                this.lolClient.fetchSummonerByName(summonerName)
                    .then(sumDTO => this.lolClient.fetchSummonerRankingInformations(sumDTO.id))
                    .then(leagueEntries => interaction.reply(JSON.stringify(leagueEntries)))
                ;
            }
        });

        this.discordClient.on('messageCreate', (message: Message) => {
            console.log(message)
        });
    }

    login(token: string) {
        this.discordClient.login(token);
    }
}



