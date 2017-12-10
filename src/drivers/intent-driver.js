const Dispatcher = require('./dispatcher/dispatcher.js');
const DefaultHandler = require('./handlers/specialized/default.js');
const NewWordHandler = require('./handlers/specialized/new-word.js');
const NewWordTranslationHandler = require('./handlers/specialized/new-word-translation.js')
const QuizStartHandler = require('./handlers/specialized/quiz-start.js');
const QuizAnswerHandler = require('./handlers/specialized/quiz-answer.js');
const WordeuApiDriver = new (require('./wa-driver.js'))();

module.exports = {
  config: () => {
    const disp = new Dispatcher(new DefaultHandler(WordeuApiDriver));
    disp.reg('word.new', new NewWordHandler(WordeuApiDriver));
    disp.reg('word.translation', new NewWordTranslationHandler(WordeuApiDriver));
    disp.reg('quiz.get', new QuizStartHandler(WordeuApiDriver));
    disp.reg('quiz.answer', new QuizAnswerHandler(WordeuApiDriver));
    this.dispatcher = disp;
    return this.dispatcher;
  },

  getDispatcher: () => {
    return (this.dispatcher) ? this.dispatcher : this.config();
  }
}