const HandlerBase = require('../handler-base.js');
// each specialized handler HAS to override
// verify, parse, retrieve, prepare
module.exports = class DefaultHandler extends HandlerBase {
  constructor(waDriver) {
    super (waDriver);
    this.paramTypes = {
      simple: 0,
      language: 1,
    }
  }

  /**
   * Makes sure that the intent matches the structure the handler expects
   * @param {*} intent 
   * @returns {boolean} 
   */
  verifyPayload(intent) {
    // check if term is specified
    return (intent.parameters.term) ? true : false;
  }

  /**
   * Gets the parameters from the payload and enriches if needed
   * @param {*} intent 
   * @returns {Object} parameters
   */
  parsePayload(intent) {

    let params = {type: this.paramTypes.simple};
    params.term = intent.parameters.term;
    if(intent.parameters.language){
      params.language = intent.parameters.language;
      params.type = this.paramTypes.language;
    }
    return params;
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