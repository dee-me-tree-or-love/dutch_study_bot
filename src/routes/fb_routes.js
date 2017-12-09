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
    let msgCount = 0;
    // TODO: maybe also move to the controller functionality?
    if (req.body.object === 'page') {
      // facebookCtrl.retrieveUserName()
      req.body.entry.forEach((entry) => { // FIXME: this might be a breaking `forEach`
        entry.messaging.forEach((event) => {
          if (event.message && event.message.text) {
            // if first messsage parsed in sequence
            if (msgCount == 0) {
              facebookCtrl.retrieveUserName(event.sender.id)
                .then((name) => {
                  return facebookCtrl.wordeuCtrl.ensureUser(event.sender.id, name);
                })
                .then((res)=>{
                  console.log('added user');
                  console.log(res);
                })
                .catch((er) => { console.error(er) });
            }
            msgCount++;
            facebookCtrl.sendMessage(event);
          }
        });
      });
      res.status(200).end();
    }
  });
};