/* eslint no-underscore-dangle: 0 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const {
  Schema,
} = mongoose;

const fields = {
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
  },
  role: {
    type: Boolean,
    required: true,
  },
  name: {
    type: String,
  },
  nit: {
    type: String,
  },
  basePrice: {
    type: Number,
  },
  startTime: {
    type: String,
    default: '08:00',
  },
  endTime: {
    type: String,
    default: '18:00',
  },
  profilePicture: {
    key: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  googleAuth: {
    type: Boolean,
    default: false,
  },
};

const user = new Schema(fields, {
  timestamps: true,
});

user.methods.toJSON = function toJSON() {
  const doc = this.toObject();
  doc.id = this.getId();
  delete doc._id;
  delete doc.password;
  delete doc.__v;
  return doc;
};

user.pre('save', function save(next) {
  if (this.isNew || this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync());
  }
  next();
});

user.methods.verifyPassword = function verifyPassword(password) {
  return bcrypt.compareSync(password, this.password);
};

user.methods.getId = function getId() {
  return this._id;
};

module.exports = {
  Model: mongoose.model('user', user),
  fields,
};
