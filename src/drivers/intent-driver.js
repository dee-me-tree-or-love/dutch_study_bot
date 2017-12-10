const Dispatcher = require('./dispatcher/dispatcher.js');
const DefaultHandler = require('./handlers/specialized/default.js');
const NewWordHandler = require('./handlers/specialized/new-word.js');
const WordeuApiDriver = new (require('./wa-driver.js'))();

module.exports = {
  config: () => {
    const disp = new Dispatcher(new DefaultHandler(WordeuApiDriver));
    disp.reg('word.new', new NewWordHandler(WordeuApiDriver));
    this.dispatcher = disp;
    return this.dispatcher;
  },

  getDispatcher: () => {
    return (this.dispatcher) ? this.dispatcher : this.config();
  }
}