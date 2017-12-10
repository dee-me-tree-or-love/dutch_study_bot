const getNotImplemntedException = () => {
  new Error(`${arguments.callee.toString()} is not implemented`)
}

module.exports = class HandlerBase {
  constructor(waDriver) {
    this.wordeuApiDriver = waDriver;
    this.failedResponse = {
      speech: `Sorry, I couldn't figure it out. I will ask the developer monkeys to fix it up...`,
      displayText: `Sorry, I couldn't figure it out. I will ask the developer monkeys to fix it up...`,
      source: 'wordeu'
    };
  }

  /**
   * Create the response object 
   * @param {*} speech 
   * @param {*} displayText 
   */
  constructMessage(speech, displayText) {
    return {
      speech: speech,
      displayText: displayText,
      source: 'wordeu'
    };
  }


  /**
   * Makes sure that the intent matches the structure the handler expects
   * @param {*} intent 
   * @returns {boolean} 
   */
  verifyPayload(intent) {
    throw getNotImplemntedException();
  }

  /**
   * Gets the parameters from the payload and enriches if needed
   * @param {*} intent 
   * @returns {Object} parameters
   */
  parsePayload(intent) {
    throw getNotImplemntedException();
  }

  /**
   * Performs the actions required to fullfil the request
   * @param {*} parameters parsed by parse Payload function
   * @returns {Promise}
   */
  retrieveData(parameters) {
    throw getNotImplemntedException();
  }

  /**
   * Based on the result prepares the answer a chatbot should send back to the user
   * @param {*} result 
   */
  prepareResponseMessage(result) {
    throw getNotImplemntedException();
  }

  /**
   * process the intent and execute the required actions to fullfill
   * @param {*} intent 
   * @returns {Promise}
   */
  handle(intent) {
    const handler = this;
    const actions = new Promise((req, res) => {
      const verified = handler.verifyPayload(intent);
      if (!verified) {
        return handler.prepareFailedMessage(null, intent);
      }
      const parameters = handler.parsePayload(intent);
      return handler.retrieveData(parameters)
        .then((result) => {
          return handler.prepareResponseMessage(result);
        })
        .catch((error) => {
          return handler.prepareFailedMessage(error, intent);
        })
    })
    return actions;
  }

  /**
   * If the validation failed, returns a dummy response
   * @param {Error} error optional, pass null if none
   * @param {*} intent 
   * @returns {Object} message object
   */
  prepareFailedMessage(error, intent) {
    console.error("Could not fulfill intent");
    console.log(intent);
    if (error) {
      console.error("An error appeared when retrieving data");
      console.log(error);
    }
    // IDEA: make a function to automatically open issues related to these kind of bugs
    return this.failedResponse;
  }
}