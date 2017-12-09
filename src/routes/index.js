const facebookRoutes = require('./fb_routes.js');

// the call to the routes index function
module.exports = {
  config: (app, controllers) => {
    // TODO: change to self describing endpoint here
    app.get('/', (req, res) => res.send(`It looks like this item doesn't work here...`));
    facebookRoutes(app, controllers);
  }
};
