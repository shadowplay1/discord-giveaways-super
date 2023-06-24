import { GiveawayWithoutInternalData } from '../lib/giveaway.interface';
export declare const giveawayTemplate: GiveawayWithoutInternalData;
export declare function replaceGiveawayKeys(input: string, giveawayObject: {
    [key: string]: any;
}): string;
