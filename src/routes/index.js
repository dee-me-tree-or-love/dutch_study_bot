const facebookRoutes = require('./fb_routes.js');

// the call to the routes index function
module.exports = {
  config: (app, controllers) => {
    facebookRoutes(app, controllers);
  }
};
