const mongoose = require('mongoose');

const dbConnect = (url) => {
  mongoose.set('strictQuery', false);
  return mongoose.connect(url);
};

module.exports = dbConnect;