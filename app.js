const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const routes = require('./routes');

const { PORT = 3000, connectAddress = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(connectAddress).then(() => {
  console.log('connected to bd');
});

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64905640ba70f2f503d8333d',
  };

  next();
});

app.use(routes);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
