const DOMAIN = 'dialogflow';

/*
  From dialogflow docs: 
    "When an intent in which a webhook was enabled is triggered, 
    Dialogflow sends data to the service in the form of POST request 
    with a POST body in the format of response to a query."
*/

module.exports = (app, ctrls) => {
  // initialize the dialogflow controller
  const dialogFlowCtrl = ctrls.DialogFlow();

  // TODO: adapt one route definition approach: trailing slash or not
  // handle the dialog flow fulfillment post request
  app.post(`/${DOMAIN}/webhook/fulfill`, (req, res) => {
    console.log('Dialogflow fullfillment route called');
    console.log(req.body);

    const senderId = req.body.sessionId;

    dialogFlowCtrl.treatIntent(req.body.result, senderId)
      .then((result) => {
        console.log("finished treating the intent");
        console.log(result);
        return res.json(result);
      });
  });
};