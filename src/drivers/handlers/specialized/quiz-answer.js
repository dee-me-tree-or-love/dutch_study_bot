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
    console.log(intent.contexts);
     // check if term is specified
     return (intent.parameters.answer // new term is supplied
      && intent.parameters.answer.trim().split(' ').length==1 // the term is 1 word
      && intent.contexts[0].parameters.term); // context is available
  }

  /**
   * Gets the parameters from the payload and enriches if needed
   * @param {*} intent 
   * @returns {Object} parameters
   */
  parsePayload(intent) {
    return {}
  }

  /**
   * Performs the actions required to fullfil the request
   * @param {*} parameters parsed by parse Payload function 
   * @returns {Promise}
   */
  retrieveData(parameters) {
    return this.wordeuApiDriver
      .getQuizWord(parameters.pageId)
      .then((result) => {
        return {
          text: `YAY`
        }
      });
  }

  /**
   * Based on the result prepares the answer a chatbot should send back to the user
   * @param {*} result 
   */
  prepareResponseMessage(result) {
    return this.constructMessage(result.text, result.text);
  }
}