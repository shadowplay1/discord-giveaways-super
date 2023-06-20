import { EventEmitter } from 'events'
import { IGiveawaysEvents } from '../../types/events.interface'

const emitter = new EventEmitter({
    captureRejections: true
})

/**
 * Giveaways event emitter.
 * @private
 */
export class Emitter {

    /**
     * Listens to the event.
     * @param {GiveawaysEvents} event Event name.
     * @param {Function} listener Callback function.
     * @returns {Emitter} Emitter instance.
     */
    on<T extends keyof IGiveawaysEvents>(event: T, listener: (...args: IGiveawaysEvents[T][]) => any): Emitter  {
        emitter.on(event, listener)
        return this
    }

    /**
     * Listens to the event only for once.
     * @param {IGiveawaysEvents} event Event name.
     * @param {Function} listener Callback function.
     * @returns {Emitter} Emitter instance.
     */
    once<T extends keyof IGiveawaysEvents>(event: T, listener: (...args: IGiveawaysEvents[T][]) => any): Emitter  {
        emitter.once(event, listener)
        return this
    }

    /**
     * Emits the event.
     * @param {IGiveawaysEvents} event Event name.
     * @param {any} args Arguments to emit the event with.
     * @returns {boolean} If event emitted successfully: true, otherwise - false.
     */
    emit<T extends keyof IGiveawaysEvents>(event: T, ...args: IGiveawaysEvents[T][]): boolean {
        return emitter.emit(event, args)
    }
}
