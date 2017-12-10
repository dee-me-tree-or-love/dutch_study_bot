const HandlerBase = require('../handler-base.js');
// each specialized handler HAS to override
// verify, parse, retrieve, prepare

// quiz.get

module.exports = class QuizStartHandler extends HandlerBase {
  constructor(waDriver) {
    super(waDriver);
  }

  /**
   * Makes sure that the intent matches the structure the handler expects
   * @param {*} intent 
   * @returns {boolean} 
   */
  verifyPayload(intent) {
    return true; // as there is nothing 
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
          text: `So, translate this for me than: ${result.title}`,
          term: result.title
        }
      });
  }

  /**
   * Based on the result prepares the answer a chatbot should send back to the user
   * @param {*} result 
   */
  prepareResponseMessage(result) {
    let message = this.constructMessage(result.text, result.text);
    message.contextOut = [{
      name: 'get-quiz-word-followup',
      parameters: { quizWord: result.term }
    }]
    console.log(message);
    return message;
  }
}