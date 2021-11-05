import {Client, Intents, Interaction, Message, MessageAttachment, MessageEmbed} from "discord.js";
import {LolRestClient} from "../lol-client/lol-rest-client";
import {lolRankedInfoCommand} from "./bot-command-registration";

function summonerInformations(summonerName: string, queue: string, tier: string, rank: string, wins: number, losses: number) {
    return new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(summonerName)
        .setDescription(queue)
        .addFields(
            {name: 'Rang', value: tier.concat(' ').concat(rank), inline: true},
            {name: 'Victoires', value: '' + wins, inline: true},
            {name: 'Défaites', value: '' + losses, inline: true},
        )
        .setThumbnail(`attachment://${tier}.png`);
}

export class LgptBot {
    private readonly discordClient: Client;

    constructor(public readonly lolClient: LolRestClient) {
        this.discordClient = new Client({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
            ]
        })

        this.discordClient.once('ready', () => {
            console.log('Ready!');
        });

        this.discordClient.on('interactionCreate', (interaction: Interaction) => {
            if (!interaction.isCommand()) return;

            if (interaction.commandName === lolRankedInfoCommand.name) {
                const summonerName = interaction.options.get('summoner-name', true).value as string;
                this.lolClient.fetchSummonerByName(summonerName)
                    .then(sumDTO => this.lolClient.fetchSummonerRankingInformations(sumDTO.id))
                    .then(leagueEntries => {
                        interaction.reply({
                            embeds: leagueEntries.map(league => summonerInformations(league.summonerName, league.queueType, league.tier, league.rank, league.wins, league.losses)),
                            files: leagueEntries.map(league => league.tier).map(tier => new MessageAttachment(`./assets/${tier}.png`))
                        })
                    })
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



