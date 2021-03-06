/* eslint no-underscore-dangle: 0 */
const mongoose = require('mongoose');
const Promotion = require('../promotions/model');

const {
  Schema,
} = mongoose;

const fields = {
  quantity: {
    type: Number,
    required: true,
  },
};

const references = {
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  promotion: {
    type: Schema.Types.ObjectId,
    ref: 'promotion',
    required: true,
  },
};

const promotion = new Schema(Object.assign(fields, references), {
  timestamps: true,
});

promotion.methods.toJSON = function toJSON() {
  const doc = this.toObject();
  delete doc.__v;
  return doc;
};

module.exports = {
  Model: mongoose.model('userPromotions', promotion),
  fields,
  references,
};
