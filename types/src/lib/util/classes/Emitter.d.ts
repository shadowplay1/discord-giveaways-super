/**
 * Represents an event emitter for {@link Giveaways} events.
 *
 * Type parameters:
 *
 * - `E` ({@link object}) - The object whose **keys** will be used as event names and **values** for events' return types.
 *
 * @template E The object whose **keys** will be used as event names and **values** for events' return types.
 * @private
 */
export declare class Emitter<E extends object> {
    private _emitter;
    /**
     * Listens to the event.
     *
     * Type parameters:
     *
     * - `T` (keyof E) - Event name to get the callback function type for.
     *
     * @param {GiveawaysEvents} event Event name.
     * @param {Function} listener Callback function.
     * @returns {Emitter} Emitter instance.
     *
     * @template T Event name to get the callback function type for.
     */
    on<T extends Exclude<keyof E, number>>(event: T, listener: (...args: E[T][]) => any): Emitter<E>;
    /**
     * Listens to the event only for once.
     *
     * Type parameters:
     *
     * - `T` (keyof E) - Event name to get the callback function type for.
     *
     * @param {IGiveawaysEvents} event Event name.
     * @param {Function} listener Callback function.
     * @returns {Emitter} Emitter instance.
     *
     * @template T Event name to get the callback function type for.
     */
    once<T extends Exclude<keyof E, number>>(event: T, listener: (...args: E[T][]) => any): Emitter<E>;
    /**
     * Emits the event.
     *
     * Type parameters:
     *
     * - `T` (keyof E) - Event name to get the event argument type for.
     *
     * @param {IGiveawaysEvents} event Event name.
     * @param {any} args Arguments to emit the event with.
     * @returns {boolean} If event emitted successfully: true, otherwise - false.
     *
     * @template T Event name to get the event argument type for.
     */
    emit<T extends Exclude<keyof E, number>>(event: T, ...args: E[T][]): boolean;
}
