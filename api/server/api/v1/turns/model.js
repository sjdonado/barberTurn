/* eslint no-underscore-dangle: 0 */
const mongoose = require('mongoose');
const Promotion = require('../promotions/model');

const {
  Schema,
} = mongoose;

const fields = {
  selectedDate: {
    type: Date,
    required: true,
  },
  status: {
    type: Number,
    required: true,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
  },
  qualify: Number,
};

const references = {
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  promotion: {
    type: Schema.Types.ObjectId,
    ref: 'promotion',
    required: false,
  },
};

const STATUS = ['new', 'accepted', 'rejected', 'qualified'];

const turn = new Schema(Object.assign(fields, references), {
  timestamps: true,
});

turn.methods.toJSON = function toJSON() {
  const doc = this.toObject();
  doc.status = STATUS[this.status];
  delete doc.__v;
  return doc;
};

module.exports = {
  Model: mongoose.model('turn', turn),
  fields,
  references,
  STATUS,
};
