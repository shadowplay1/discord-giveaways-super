/**
 * Represents an event emitter for giveaways events.
 * @private
 */
export declare class Emitter<E extends object> {
    private _emitter;
    /**
     * Listens to the event.
     * @param {GiveawaysEvents} event Event name.
     * @param {Function} listener Callback function.
     * @returns {Emitter} Emitter instance.
     */
    on<T extends keyof E>(event: T, listener: (...args: E[T][]) => any): Emitter<E>;
    /**
     * Listens to the event only for once.
     * @param {IGiveawaysEvents} event Event name.
     * @param {Function} listener Callback function.
     * @returns {Emitter} Emitter instance.
     */
    once<T extends keyof E>(event: T, listener: (...args: E[T][]) => any): Emitter<E>;
    /**
     * Emits the event.
     * @param {IGiveawaysEvents} event Event name.
     * @param {any} args Arguments to emit the event with.
     * @returns {boolean} If event emitted successfully: true, otherwise - false.
     */
    emit<T extends keyof E>(event: T, ...args: E[T][]): boolean;
}
