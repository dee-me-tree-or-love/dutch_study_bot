'use strict';

let handleAction = (req, res) => {
    console.log("ai handler has been called by: ", req.body.result.action)

    if (intentHandler[req.body.result.action]) {

        let msg = intentHandler[req.body.result.action](req);

        return res.json({
            speech: msg,
            displayText: msg,
            source: req.body.result.action
        });
    }
}

module.exports = { handleAction };


const intentHandler = {
    word_new: (req) => {

        let term = req.body.result.parameters['term'];
        let meaning = req.body.result.parameters['meaning'];

        // TODO: add logics to split and process terms and meanings

        let msg = `Hooray! Here is the new word: ${term}, which means ${meaning}`;
        return msg;
    },

    word_new_cancel: (req) => {

        // console.log(req.body.result.contexts);
        // 
        // [ { name: 'wordsadd_new-followup',
        // parameters:
        //  { 'term.original': 'bogel',
        //    meaning: 'bird',
        //    term: [Object],
        //    'meaning.original': 'bird' },
        // lifespan: 0 } ]

        return "nothing yet";
    }
}