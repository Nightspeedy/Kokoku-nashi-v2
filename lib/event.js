module.exports = class Command {
  /**
   * The event class from which all event listeners extend from.
   * @param {Object} meta - {event}
   */
  constructor (meta) {
    // Initialize the command meta
    this.event = meta.event
  }
}
