import { EventEmitter } from 'events'

/**
 * Represents an event emitter for {@link Giveaways} events.
 *
 * Type parameters:
 *
 * - E ({@link object}) - The object whose **keys** will be used as event names and **values** for events' return types.
 *
 * @template {object} E The object whose **keys** will be used as event names and **values** for events' return types.
 * @private
 */
export class Emitter<E extends object> {
    private _emitter = new EventEmitter({
        captureRejections: true
    })

    /**
     * Listens to the event.
     * @param {GiveawaysEvents} event Event name.
     * @param {Function} listener Callback function.
     * @returns {Emitter} Emitter instance.
     */
    public on<T extends keyof E>(event: T, listener: (...args: E[T][]) => any): Emitter<E> {
        this._emitter.on(event as string, listener)
        return this
    }

    /**
     * Listens to the event only for once.
     * @param {IGiveawaysEvents} event Event name.
     * @param {Function} listener Callback function.
     * @returns {Emitter} Emitter instance.
     */
    public once<T extends keyof E>(event: T, listener: (...args: E[T][]) => any): Emitter<E> {
        this._emitter.once(event as string, listener)
        return this
    }

    /**
     * Emits the event.
     * @param {IGiveawaysEvents} event Event name.
     * @param {any} args Arguments to emit the event with.
     * @returns {boolean} If event emitted successfully: true, otherwise - false.
     */
    public emit<T extends keyof E>(event: T, ...args: E[T][]): boolean {
        return this._emitter.emit(event as string, args)
    }
}
