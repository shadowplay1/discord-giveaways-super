export declare const ms: <TInputValue extends string | number>(val: TInputValue, options?: {
    long: boolean;
}) => StringOrNumber<TInputValue>;
export type StringOrNumber<TInputValue extends string | number> = TInputValue extends string ? number : string;
