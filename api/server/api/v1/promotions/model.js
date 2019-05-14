/* eslint no-underscore-dangle: 0 */
const mongoose = require('mongoose');

const {
  Schema,
} = mongoose;

const fields = {
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  coverPicture: {
    key: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  qualify: {
    quantity: {
      type: Number,
      default: 0,
    },
    users: {
      type: Number,
      default: 0,
    },
  },
};

const references = {
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
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
  Model: mongoose.model('promotion', promotion),
  fields,
  references,
};
