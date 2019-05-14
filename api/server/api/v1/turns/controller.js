/* eslint no-underscore-dangle: 0 */
const {
  Model,
  fields,
  STATUS,
  references,
} = require('./model');

const { Promotion } = require('../promotions/controller');

const referencesNames = [
  ...Object.getOwnPropertyNames(references),
];

exports.id = (req, res, next, id) => {
  Model.findById(id)
    .populate(referencesNames.join(' '))
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
    .populate(referencesNames.join(' '))
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
    const params = { user: user.getId() };
    if (body.promotionId) {
      const promotion = await Promotion.findById(body.promotionId);
      Object.assign(promotion, { quantity: promotion.quantity - body.quantity });
      await promotion.save();
      Object.assign(params, { promotion: body.promotionId });
    }
    const document = new Model(Object.assign(body, params));
    const data = await document.save();
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
    const params = {};
    if (doc.promotion) {
      const promotion = await Promotion.findById(doc.promotion);
      if (user.getId().toString() === promotion.user.toString()) {
        // Object.assign(doc, { verified: true });
        // const data = await doc.save();
        Object.assign(params, { promotion });
      } else {
        next(new Error('Bad request'));
      }
    }
    res.json({
      data: Object.assign(doc, params),
    });
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

exports.status = async (req, res, next) => {
  const {
    doc,
    body,
  } = req;
  const statusIndex = STATUS.indexOf(body.status);
  if (statusIndex !== -1) {
    Object.assign(doc, { status: statusIndex });
    const data = await doc.save();
    res.status(200);
    res.json({
      data,
    });
  } else {
    next(new Error('Bad request'));
  }
};

exports.qualify = async (req, res, next) => {
  const {
    doc,
    body,
  } = req;
  const { qualify } = body;
  if (doc.status === 1) {
    Object.assign(doc, {
      qualify,
      status: 3,
    });

    const data = await doc.save();

    res.status(200);
    res.json({
      data,
    });
  } else {
    next(new Error('Bad request'));
  }
};

exports.Turn = Model;
