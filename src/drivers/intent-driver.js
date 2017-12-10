const Dispatcher = require('./dispatcher/index.js');
const DefaultHandler = require('./handlers/specialized/default.js');
const WordeuApiDriver = new (require('./wa-driver.js'))();

module.exports = {
  config: () => {
    const disp = new Dispatcher(new DefaultHandler(WordeuApiDriver));

    this.dispatcher = disp;
    return this.dispatcher;
  },

  getDispatcher: () => {
    return (this.dispatcher) ? this.dispatcher : this.config();
  }
}