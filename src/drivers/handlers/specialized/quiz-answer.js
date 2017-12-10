const HandlerBase = require('../handler-base.js');
// each specialized handler HAS to override
// verify, parse, retrieve, prepare

// quiz.answer

module.exports = class QuizAnswerHandler extends HandlerBase {
  constructor(waDriver) {
    super(waDriver);
  }

  /**
   * Makes sure that the intent matches the structure the handler expects
   * @param {*} intent 
   * @returns {boolean} 
   */
  verifyPayload(intent) {
     // check if term is specified
     return (intent.parameters.answer // new term is supplied
      && intent.parameters.answer.trim().split(' ').length==1 // the term is 1 word
      && intent.contexts[0].parameters.quizWord); // context is available
  }

  /**
   * Gets the parameters from the payload and enriches if needed
   * @param {*} intent 
   * @returns {Object} parameters
   */
  parsePayload(intent) {
    let params = {};
    params.answer = intent.parameters.answer;
    params.quizWord = intent.contexts[0].parameters.quizWord;
    return params;
  }

  /**
   * Performs the actions required to fullfil the request
   * @param {*} parameters parsed by parse Payload function 
   * @returns {Promise}
   */
  retrieveData(parameters) {
    return this.wordeuApiDriver
      .submitQuizAnswer(parameters.quizWord, parameters.answer, parameters.pageId)
      .then((result) => {
        return result;
      });
  }

  // { best_match: { word: 'sandwich', similarity: 0.8888888888888888 },
  // answer: 'sandwhich',
  // score: 6,
  // options: [ { word: 'sandwich', similarity: 0.8888888888888888 } ] }

  /**
   * Based on the result prepares the answer a chatbot should send back to the user
   * @param {*} result 
   */
  prepareResponseMessage(result) {

    const similarityRounded = (result.best_match.similarity).toFixed(2);

    let text = `Alright, let's see:\nYour answer is "${result.answer}"\n`
    text += `The best match is "${result.best_match.word}" (similar on ${similarityRounded} rate)\n`
    text += `So your score then is ${result.score}\n\nOther translations are:`
    for(let key in result.options){
      text += `\n${result.options[key].word}`
    }

    return this.constructMessage(text, text);
  }
}