import { EventEmitter } from 'events'

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
export class Emitter<E extends object> {
    private _emitter = new EventEmitter({
        captureRejections: true
    })

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
    public on<T extends keyof E>(event: T, listener: (...args: E[T][]) => any): Emitter<E> {
        this._emitter.on(event as string, listener)
        return this
    }

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
    public once<T extends keyof E>(event: T, listener: (...args: E[T][]) => any): Emitter<E> {
        this._emitter.once(event as string, listener)
        return this
    }

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
    public emit<T extends keyof E>(event: T, ...args: E[T][]): boolean {
        return this._emitter.emit(event as string, args)
    }
}
