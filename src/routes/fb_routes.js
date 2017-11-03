const DOMAIN = 'facebook';

module.exports = (app, ctrls) => {
  // initialize the facebook controller
  const facebookCtrl = ctrls.Facebook();

  // Facebook Verification route
  app.get(`/${DOMAIN}/webhook`, (req, res) => {
    console.log('Messenger webhook verification called');

    if (req.query['hub.mode'] && req.query['hub.verify_token'] === process.env.FACEBOOK_CHALLENGE || 'luxurious_unicorn') {
      res.status(200).send(req.query['hub.challenge']);
    } else {
      res.status(403).end();
    }
  });

  // (ALL) Facebook Message Handling
  app.post(`/${DOMAIN}/webhook`, (req, res) => {
    console.log('recevied message via fb');

    console.log(req.body);
    // TODO: maybe also move to the controller functionality?
    if (req.body.object === 'page') {
      req.body.entry.forEach((entry) => {
        entry.messaging.forEach((event) => {
          if (event.message && event.message.text) {
            facebookCtrl.sendMessage(event);
          }
        });
      });
      res.status(200).end();
    }
  });
};