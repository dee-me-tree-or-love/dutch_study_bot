'use strict'

require('dotenv').config();

const request = require('request');
const apiaiApp = require('apiai')(process.env.API_CLIENT_ACCESS_TOKEN);

let sendMessageApiAi = (event) => {
    let sender = event.sender.id;
    let text = event.message.text;

    let apiai = apiaiApp.textRequest(text, {
        sessionId: 'tabby_cat' // use any arbitrary id
    });

    apiai.on('response', (response) => {
        let aiText = response.result.fulfillment.speech;

        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
            method: 'POST',
            json: {
                recipient: { id: sender },
                message: { text: aiText }
            }
        }, (error, response) => {
            if (error) {
                console.log('Error sending message: ', error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        });
    });

    apiai.on('error', (error) => {
        console.log(error);
    });

    apiai.end();
}

module.exports = { sendMessageApiAi };