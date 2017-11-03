const FacebookController = require('./fb_controller.js');

module.exports = {
  Facebook: () => {
    return new FacebookController();
  },
  // keep for now!
  dataHandler: () => {
    const dataHandler = (data, res) => {
      if (data.length === 0) {
        res.status(404).send(JSON.stringify({ error: { message: 'No records found' } }));
        return;
      }
      if (data.error) {
        res.status(500).send(JSON.stringify({ error: data.error }));
        return;
      }
      res.send(JSON.stringify(data));
    };
    return dataHandler;
  }
};
