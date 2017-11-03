require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./src/routes/index.js');
const controllers = require('./src/controllers/index.js');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/* App startup */
const server = app.listen(process.env.PORT || 5000, () => {
  console.log(
    'Express server listening on port %d in %s mode',
    server.address().port,
    app.settings.env
  );
  console.log(process.pid);

  routes.config(app, controllers);
});


/* Graceful app shutdown */
const shutDown = () => {
  console.log('Received kill signal, shutting down gracefully');
  server.close(() => {
    console.info('Closed remaining connections');
    process.exit(0);
  });
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 500);
};

process.on('SIGTERM', shutDown);

process.on('SIGINT', shutDown);

module.exports = app;