const request = require('request');
const intentDriver = require('../drivers/intent-driver.js');
const apiAiSDK = require('apiai')(process.env.DIALOGFLOW_CLIENT_TOKEN);

// TODO: is it actually a controller? maybe 'handler' would be a better name?
module.exports = class DialogFlowController {
  constructor() {
    this.WORDEU_API_HOST = process.env.WORDEU_API_HOST || 'http://localhost:8008/'
    intentDriver.config();
    console.log(intentDriver);
  }

  /**
   * Calls the driver to do stuff with the intent and returns a message object
   * @param {*} intent 
   */
  treatIntent(intent, pageId){
    console.log(intentDriver);
    return intentDriver.getDispatcher().receiveIntent(intent, pageId);
  }
}