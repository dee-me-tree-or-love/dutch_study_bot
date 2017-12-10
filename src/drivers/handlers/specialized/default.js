const HandlerBase = require('../handler-base.js');
// each specialized handler HAS to override
// verify, parse, retrieve, prepare
module.exports = class NewWordTranslationHandler extends HandlerBase {
  /**
   * Makes sure that the intent matches the structure the handler expects
   * @param {*} intent 
   * @returns {boolean} 
   */
  verifyPayload(intent) {
    // does not matter for the default
    return true;
  }

  /**
   * Gets the parameters from the payload and enriches if needed
   * @param {*} intent 
   * @returns {Object} parameters
   */
  parsePayload(intent) {
    return intent.fulfillment;
  }

  /**
   * Performs the actions required to fullfil the request
   * @param {*} parameters parsed by parse Payload function 
   * @returns {Promise}
   */
  retrieveData(parameters) {
    return { text: parameters.speech };
  }

  /**
   * Based on the result prepares the answer a chatbot should send back to the user
   * @param {*} result 
   */
  prepareResponseMessage(result) {
    return this.constructMessage(result.text, result.text);
  }
}