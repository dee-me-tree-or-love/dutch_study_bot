const getNotImplemntedException = () => {
  new Error(`${arguments.callee.toString()} is not implemented`)
}

module.exports = class HandlerBase {
  constructor(waDriver) {
    if (!waDriver) {
      throw new Error('no wordeu api driver specified!')
    }
    this.wordeuApiDriver = waDriver;
    this.failedResponse = {
      speech: `Sorry, I couldn't figure it out. I will ask the developer monkeys to fix it up...`,
      displayText: `Sorry, I couldn't figure it out. I will ask the developer monkeys to fix it up...`,
      source: 'wordeu'
    };
    this.failedVerificationResponse = {
      speech: `Sorry, I couldn't figure it out. Could you make sure your request is meaningful? I can only record one word phrases...`,
      displayText: `Sorry, I couldn't figure it out. Could you make sure your request is meaningful? I can only record one word phrases...`,
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
   * @param {Object} parameters - parsed by parse Payload function
   * @param {string} parameters.pageId - passed along to maintain features
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
   * @param {*} pageId a kinda optional parameter that is used in some cases for API calls
   * @returns {Promise}
   */
  handle(intent, pageId) {
    console.log('Started handling the intent');
    const handler = this;
    const actions = new Promise((resolve, reject) => {
      const verified = handler.verifyPayload(intent);
      if (!verified) {
        console.log('Payload incorrect');
        resolve(handler.prepareFailedMessage(null, intent));
        return;
      }
      console.log('Verified the payload');
      const parameters = handler.parsePayload(intent);
      parameters.pageId = pageId;
      console.log('Starting processing the payload');
      return handler.retrieveData(parameters)
        .then((result) => {
          console.log('Got the result of processing the payload');
          console.log(result);
          resolve(handler.prepareResponseMessage(result));
        })
        .catch((error) => {
          console.error('Error while processing the payload');
          console.log(error);
          resolve(handler.prepareFailedMessage(error, intent));
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
      return this.failedResponse;
    }
    // IDEA: make a function to automatically open issues related to these kind of bugs
    return this.failedVerificationResponse;
  }
}