const request = require('request');
const apiAiSDK = require('apiai')(process.env.DIALOGFLOW_CLIENT_TOKEN);

// TODO: is it actually a controller? maybe 'handler' would be a better name?
module.exports = class DialogFlowController {
  constructor(wordeuApiCtrl) {
    this.wordeu = wordeuApiCtrl;
    this.WORDEU_API_HOST = process.env.WORDEU_API_HOST || 'http://localhost:8008/'
  }
}