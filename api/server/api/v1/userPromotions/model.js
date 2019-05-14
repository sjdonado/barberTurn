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
  status: {
    type: Number,
    required: true,
    default: 0,
  },
  qualify: Number,
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

const STATUS = ['new', 'accepted', 'rejected', 'qualified'];

const promotion = new Schema(Object.assign(fields, references), {
  timestamps: true,
});

promotion.methods.toJSON = function toJSON() {
  const doc = this.toObject();
  doc.status = STATUS[this.status];
  delete doc.__v;
  return doc;
};

module.exports = {
  Model: mongoose.model('userPromotions', promotion),
  fields,
  references,
  STATUS,
};
