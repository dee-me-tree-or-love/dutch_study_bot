'use strict'

require('dotenv').config();

const request = require('request');
const apiaiApp = require('apiai')(process.env.API_CLIENT_ACCESS_TOKEN);
const getUserGreeting = require('./util/get_user_greeting');

const decorateEnvResponse = (msg) => {
    return process.env.ENV === 'live' ? msg : msg + "\n(I am in development)";
}

let sendMessageApiAi = (event) => {
    console.log(event)
    const sender_id = event.sender.id;
    const text = event.message.text;

    let apiai = apiaiApp.textRequest(text, {
        sessionId: 'tabby_cat' // use any arbitrary id
    });

    apiai.on('response', (response) => {

        // console.log("apiai response: \n", response);

        let p = new Promise((resolve, reject) => {
            // TODO: add the action map in order to avoid hardcoding

            if (response.result.action === 'greetings') {
                resolve(
                    getUserGreeting(response.result.fulfillment.speech,
                        sender_id)
                );

            } else {
                resolve(response.result.fulfillment.speech);
            }
        });

        p.then((aiText) => {
                console.log('AI response: ', aiText);
                request({
                    url: 'https://graph.facebook.com/v2.6/me/messages',
                    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
                    method: 'POST',
                    json: {
                        recipient: { id: sender_id },
                        message: { text: decorateEnvResponse(aiText) }
                    }
                }, (error, response) => {
                    if (error) {
                        console.log('Error sending message: ', error);
                    } else if (response.body.error) {
                        console.log('Error: ', response.body.error);
                    }
                });
            })
            .catch((error) => {
                console.log('Error withing promisses: ', error);
            });
    });

    apiai.on('error', (error) => {
        console.log(error);
    });

    apiai.end();
}

module.exports = { sendMessageApiAi };