export type If<T extends boolean,
    IfTrue,
    IfFalse = null
> = T extends true ? IfTrue : IfFalse

export type Optional<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>

export type FindCallback<T> = (item: T) => boolean
export type MapCallback<T, TReturn> = (item: T) => TReturn
