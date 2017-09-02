'use strict'

require('dotenv').config();
const request = require('request');

module.exports = (pretext, sender_id) => {
    let p = new Promise((resolve, reject) => {

        request({
            url: `https://graph.facebook.com/v2.6/${sender_id}`,
            qs: {
                access_token: process.env.PAGE_ACCESS_TOKEN,
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
        return pretext + ` ${body.first_name}`;

    }).catch((err) => {
        console.log('error getting name:', err);
        return pretext;
    });

    return p;
};