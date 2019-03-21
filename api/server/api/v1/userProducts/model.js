/* eslint no-underscore-dangle: 0 */
const mongoose = require('mongoose');
const Product = require('../products/model');

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
  product: {
    type: Schema.Types.ObjectId,
    ref: 'product',
    required: true,
  },
};

const STATUS = ['new', 'accepted', 'rejected', 'qualified'];

const product = new Schema(Object.assign(fields, references), {
  timestamps: true,
});

product.methods.toJSON = function toJSON() {
  const doc = this.toObject();
  doc.status = STATUS[this.status];
  delete doc.__v;
  return doc;
};

module.exports = {
  Model: mongoose.model('userProducts', product),
  fields,
  references,
  STATUS,
};
