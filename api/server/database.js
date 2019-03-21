const mongoose = require('mongoose');

const config = require('./config/');

const {
  database,
} = config;

exports.connect = () => {
  mongoose.connect(database.url, { useNewUrlParser: true });

  mongoose.connection.on('open', () => {
    console.log('Database connected');
  });
};
