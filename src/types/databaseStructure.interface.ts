import { IGiveaway } from '../lib/Giveaway'

export interface IDatabaseStructure {
    [guildID: string]: IGiveaway[]
}
