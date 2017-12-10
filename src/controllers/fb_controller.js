const request = require('request');
const apiAiSDK = require('apiai')(process.env.DIALOGFLOW_CLIENT_TOKEN);

// TODO: is it actually a controller? maybe 'handler' would be a better name?
module.exports = class FacebookController {
  constructor() {
    this.PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_TOKEN;
    this.MESSENGER_GRAPH_HOST = 'https://graph.facebook.com/v2.6/';
    this.MESSENGER_GRAPH_MESSAGES = this.MESSENGER_GRAPH_HOST + 'me/messages';
    this.ERROR_PLACEHOLDER = 'Oups, I am going through hard times now (developers having fun), could you repeat?';
    this.MessageProviderTypes = {
      'mirror': this.sendMessageMirror,
      'dialogflow': this.sendMessageAi
    };
  }

  /**
   * Posts a message (back*) to the chat with the person
   * @param {*} sender the sender object for facebook
   * @param {String} text the text string to be sent back
   */
  postMessage(sender, text) {
    if (!text) {
      // TODO: a debug wrapper is needed again!
      console.log('Empty message was tried to be sent');
      text = this.ERROR_PLACEHOLDER;
    }
    request({
      url: this.MESSENGER_GRAPH_MESSAGES,
      qs: { access_token: this.PAGE_ACCESS_TOKEN },
      method: 'POST',
      json: {
        recipient: { id: sender },
        message: { text: text }
      }
    }, (error, response) => {
      if (error) {
        console.log('Error sending message: ', error);
      } else if (response.body.error) {
        console.log('Error: ', response.body.error);
      }
    });
  }

  // TODO: actually start using it
  /**
   * Request a user name from the facebook api and return a promise
   * @param {*} senderId 
   * @returns promise
   */
  retrieveUserName(senderId){
    let p = new Promise((resolve, reject) => {
      
              request({
                  url: this.MESSENGER_GRAPH_HOST + senderId,
                  qs: {
                      access_token: this.PAGE_ACCESS_TOKEN,
                      fields: 'first_name'
                  },
                  method: 'GET'
      
              }, (err, resp, body) => {
      
                  if (resp && body) {
                      resolve(JSON.parse(body));
                  } else {
                      if (err) {
                          reject(err);
                      }
                      reject({ msg: 'not complete result' });
                  }
              })
          }).then((body) => {
              return body.first_name;
          }).catch((err) => {
              console.log('error getting name:', err);
              return err;
          });
      return p;
  }

  /**
   * Set the FacebookController::sendMessage() to the specified type
   * @param {string} type
   * @throws {Error} if type is unsupported 
   */
  setMessageProvider(type) {
    const handlerType = type.toLowerCase();
    // check if type is valid
    if (!(Object.keys(this.MessageProviderTypes).includes(handlerType))) {
      throw new Error(`Couldn't set the unsupported provider: ${handlerType} not in ${this.MessageProviderTypes}`);
    }
    this.sendMessage = this.MessageProviderTypes[handlerType];
  }

  /**
   * The main entry point to send messages
   * Configurable via FacebookController::setMessageProvider()
   * By default is set to call the AI messenger
   * @param {*} event 
   */
  sendMessage(event) {
    // the default method to be called
    this.sendMessageAi(event);
  }

  /**
   * Calls the Dialog flow service to prepare response
   * @param {*} event 
   */
  sendMessageAi(event) {
    console.log(event.sender);
    const sender = event.sender.id;
    const text = event.message.text;

    // forwards the message to the API ai
    const apiaiHandler = apiAiSDK.textRequest(text, {
      sessionId: sender // sender id to identify the session!
    });

    // console.log(apiaiHandler);
    // when Dialog Flow service sends the valid response back, 
    // we can return it to the user
    apiaiHandler.on('response', (response) => {
      // get the fulfillment from the DF service
      console.log('Received dialogflow response');
      console.log(response.result);
      let aiText = response.result.fulfillment.speech;
      this.postMessage(sender, aiText);
    });

    // if Dialog Flow responds with an error or something goes wrong
    apiaiHandler.on('error', (error) => {
      // TODO: huh, a debug message would be amazing here, finish your goddam 
      // log wrapper!
      console.log('apiai error:', error);
      this.postMessage(sender, this.ERROR_PLACEHOLDER);
    });

    apiaiHandler.end();
  }

  /**
   * Used to send the exact copy of the user message back. 
   * Useful for testing and was a first method to be 
   * implemented to test messenger functionality
   * 
   * @param {*} event 
   * @deprecated
   */
  sendMessageMirror(event) {
    const sender = event.sender.id;
    const text = event.message.text;
    this.postMessage(sender, text);
  }
}