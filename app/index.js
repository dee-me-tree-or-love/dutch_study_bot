'use strict'

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const messageHandler = require('./handlers/message');
const aiHandler = require('./handlers/ai');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sendMessage = messageHandler.sendMessageApiAi;


const server = app.listen(process.env.PORT || 5000, () => {
    console.log('Express server listening on port %d in %s mode', 
    server.address().port, app.settings.env);
});

app.get('/', function (req, res) {
    res.send('Hello World!')
})




/* For Facebook Validation */
app.get('/webhook', (req, res) => {
    if (req.query['hub.mode'] && req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
        res.status(200).send(req.query['hub.challenge']);
    } else {
        res.status(403).end();
    }
});



/* Handling all messenges */
app.post('/webhook', (req, res) => {
    console.log(req.body);
    if (req.body.object === 'page') {
        req.body.entry.forEach((entry) => {
            entry.messaging.forEach((event) => {
                if (event.message && event.message.text) {
                    sendMessage(event);
                }
            });
        });
        res.status(200).end();
    }
});


// to handle the AI requests for processing 
app.post('/ai', aiHandler.handleAction);