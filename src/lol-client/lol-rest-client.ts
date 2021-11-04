import axios, {AxiosInstance} from "axios";
import {LeagueEntryDTO, SummonerDTO} from "./lol-types";

export function createAxiosInstance(developerKey: string) {
    return axios.create({
        baseURL: 'https://euw1.api.riotgames.com/lol',
        headers: {'X-Riot-Token': developerKey}
    })
}

export class LolRestClient {
    constructor(private readonly lolAxiosClient: AxiosInstance) {
    }

    fetchSummonerByName = (summonerName: string): Promise<SummonerDTO> =>
        this.lolAxiosClient.get(`/summoner/v4/summoners/by-name/${summonerName}`)
            .then(({data}) => data);

    fetchSummonerRankingInformations = (summonerId: string): Promise<LeagueEntryDTO[]> =>
        this.lolAxiosClient.get(`/league/v4/entries/by-summoner/${summonerId}`)
            .then(({data}) => data);

}

