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

  // handle the dialog flow fulfillment post request
  app.post(`/${DOMAIN}/webhook/fulfil`, (req, res) => {
    console.log('Dialogflow fullfillment route called');

    // TODO: add handler logic
  });
};