import { GiveawayWithoutInternalProps } from '../lib/giveaway.interface';
export declare const giveawayTemplate: IGiveawayTemplate;
export declare function replaceGiveawayKeys(input: string, giveawayObject: Record<string, any>, winners?: string[]): string;
export type IGiveawayTemplate = GiveawayWithoutInternalProps & Record<'numberOfWinners' | 'winnersString' | 'isEnded' | 'state', string> & {
    entries: '';
};
