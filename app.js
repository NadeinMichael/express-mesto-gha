const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { PORT = 3000, connectAddress = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const routes = require('./routes');

const { login, createUser } = require('./controllers/users');
const errorHandler = require('./middlewares/error-handler');
const {
  validationSignup,
  validationSignIn,
} = require('./utils/validation');

mongoose.connect(connectAddress).then(() => {
  console.log('connected to bd');
});

const app = express();

app.use(express.json());

app.post('/signin', validationSignIn, login);
app.post('/signup', validationSignup, createUser);

app.use(routes);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
