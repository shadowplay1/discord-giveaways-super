export interface IUpdateState {
    updated: boolean;
    installedVersion: string;
    availableVersion: string;
}
export declare type If<T extends boolean, IfTrue, IfFalse = null> = T extends true ? IfTrue : IfFalse;
export declare type Optional<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;
export declare type FindCallback<T> = (item: T) => boolean;
export declare type MapCallback<T, TReturn> = (item: T) => TReturn;
