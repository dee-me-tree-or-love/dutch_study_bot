const HandlerBase = require('../handler-base.js');
// each specialized handler HAS to override
// verify, parse, retrieve, prepare
module.exports = class NewWordTranslationHandler extends HandlerBase {
  constructor(waDriver) {
    super(waDriver);
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
    return (intent.parameters.translation // new term is supplied
      && intent.parameters.translation.trim().split(' ').length==1 // the term is 1 word
      && intent.contexts[0].parameters.term); // context is available
  }

  /**
   * Gets the parameters from the payload and enriches if needed
   * @param {*} intent 
   * @returns {Object} parameters
   */
  parsePayload(intent) {

    let params = { type: this.paramTypes.simple };
    params.translation = intent.parameters.translation;
    params.term = intent.contexts[0].parameters.term;
    if (intent.parameters.language) {
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
    // TODO: implement language specification as well!
    return this.wordeuApiDriver
      .addWordTranslation(parameters.translation, parameters.term, parameters.pageId)
      .then((result) => {
        return {
          text: `Great! now I have recorded that ${parameters.translation} translates ${parameters.term}`
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