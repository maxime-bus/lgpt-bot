import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v9";
import {SlashCommandBuilder} from "@discordjs/builders";

export class DiscordBotConfiguration {
    constructor(public readonly clientId: string,
                public readonly guildId: string,
                public readonly token: string) {
    }
}

export const lolRankedInfoCommand = new SlashCommandBuilder()
    .setName('lol-ranked-info')
    .addStringOption(builder => builder
        .setName('summoner-name')
        .setDescription("Nom de l'invocateur")
        .setRequired(true))
    .setDescription("Affiche les informations de classement de l'invocateur");

const commands = [lolRankedInfoCommand].map(command => command.toJSON());

export function registerCommands(discordBotConfiguration: DiscordBotConfiguration) {
    const discordRestClient = new REST({version: '9'})
        .setToken(discordBotConfiguration.token);

    discordRestClient.put(Routes.applicationGuildCommands(discordBotConfiguration.clientId, discordBotConfiguration.guildId), {body: commands})
        .then(() => console.log('Successfully registered application commands'))
        .catch(console.error)
}