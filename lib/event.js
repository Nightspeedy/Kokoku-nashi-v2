module.exports = class Event {
  /**
   * The event class from which all event listeners extend from.
   * @param {Object} meta - {event}
   */
  constructor (meta) {
    // Initialize the event meta
    this.event = meta.event
  }
}
