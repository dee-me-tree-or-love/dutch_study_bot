'use strict';

let handleAction = (req, res) => {
    console.log("ai handler has been called")
    if (req.body.result.action === 'word_new') {

        let term = req.body.result.parameters['term'];
        let meaning = req.body.result.parameters['meaning'];

        // TODO: add logics to split and process terms and meanings

        let msg = `Hooray! Here is the new word: ${term}, which means ${meaning}`;

        return res.json({
            speech: msg,
            displayText: msg,
            source: 'word_new'
        });
    }
}

module.exports = {handleAction};
