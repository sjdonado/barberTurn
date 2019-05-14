/* eslint no-underscore-dangle: 0 */
const {
  Model,
  fields,
  STATUS,
  references,
} = require('./model');

const { Promotion } = require('../promotions/controller');
const { Turn } = require('../turns/controller');

const referencesNames = [
  ...Object.getOwnPropertyNames(references),
];

exports.id = (req, res, next, id) => {
  Model.findById(id)
    .then((doc) => {
      if (doc) {
        req.doc = doc;
        next();
      } else {
        next(new Error(`${Model.modelName} not found`));
      }
    })
    .catch((err) => {
      next(new Error(err));
    });
};

exports.all = async (req, res, next) => {
  const {
    user,
  } = req;
  Model
    .find({ user: user.getId() })
    .populate(referencesNames[1])
    .then((data) => {
      res.json({
        data,
      });
    })
    .catch((err) => {
      next(new Error(err));
    });
};

exports.create = async (req, res, next) => {
  const {
    body,
    user,
  } = req;
  try {
    const doc = new Model(Object.assign(body, { user: user.getId(), promotion: body.promotionId }));
    const data = await doc.save();
    const promotion = await Promotion.findById(body.promotionId);
    Object.assign(promotion, { quantity: promotion.quantity - body.quantity });
    await promotion.save();
    res.status(201);
    res.json({
      data,
    });
  } catch (e) {
    next(e);
  }
};

exports.read = async (req, res, next) => {
  const {
    doc,
    user,
  } = req;
  try {
    const promotion = await Promotion.findById(doc.promotion);
    if (user.getId().toString() === promotion.user.toString()) {
      // Object.assign(doc, { verified: true });
      // const data = await doc.save();
      res.status(200);
      res.json({
        data: Object.assign(doc, { promotion }),
      });
    } else {
      next(new Error('Bad request'));
    }
    // if (!doc.verified) {
    // } else {
    //   res.json({
    //     data: Object.assign(doc, { promotion }),
    //   });
    // }
  } catch (e) {
    next(e);
  }
};

exports.companyCustomers = async (req, res, next) => {
  const {
    doc,
    user,
  } = req;

  try {
    const data = await Turn
      .find({
        company: user.getId(),
      })
      .populate(referencesNames[1], '-_id -user')
      .populate(referencesNames[0], '-_id -password');

    res.json({
      data,
    });
  } catch (e) {
    next(e);
  }
};
