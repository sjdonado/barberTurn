/* eslint no-underscore-dangle: 0 */
const mongoose = require('mongoose');
const User = require('../users/model');

const {
  Schema,
} = mongoose;

const fields = {
  message: {
    type: String,
  },
  rating: {
    type: Number,
    required: true,
  },
};

const references = {
  client: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  business: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
};

const feedback = new Schema(Object.assign(fields, references), {
  timestamps: true,
});

feedback.methods.toJSON = function toJSON() {
  const doc = this.toObject();
  delete doc.__v;
  return doc;
};

module.exports = {
  Model: mongoose.model('feedbacks', feedback),
  fields,
  references,
};
