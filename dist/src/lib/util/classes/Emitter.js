"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emitter = void 0;
const events_1 = require("events");
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
class Emitter {
    _emitter = new events_1.EventEmitter({
        captureRejections: true
    });
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
    on(event, listener) {
        this._emitter.on(event, listener);
        return this;
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
    once(event, listener) {
        this._emitter.once(event, listener);
        return this;
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
    emit(event, ...args) {
        return this._emitter.emit(event, args);
    }
}
exports.Emitter = Emitter;
