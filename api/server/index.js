const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const expressSession = require('express-session');

const database = require('./database');
const api = require('./api/v1/');
const { passport } = require('./utils/authentication');

database.connect();

const app = express();

app.use(cors({
  origin: ['http://localhost'],
  credentials: true,
}));
app.use(methodOverride());
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(expressSession({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1', api);

app.use((req, res, next) => {
  res.status(404);
  res.json({
    error: true,
    message: 'Not found',
  });
});

app.use((err, req, res, next) => {
  const {
    statusCode = 500, message,
  } = err;

  console.log('ERROR', err);
  console.log('ERROR_MESSAGE', message);

  res.status(statusCode);
  res.json({
    error: true,
    message,
  });
});

module.exports = app;
