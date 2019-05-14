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
    .find({ user: user.id })
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
    const document = new Model(Object.assign(body, { user: user.id, promotion: body.promotionId }));
    const data = await document.save();
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
    const promotion = await Promotion.findOne({ _id: doc.promotion });
    await promotion.update(Object.assign(promotion, {
      qualify: {
        quantity: promotion.qualify.quantity + qualify,
        users: promotion.qualify.users + 1,
      },
    }));
    Object.assign(doc, { status: 3, qualify });
    const data = await doc.save();
    res.status(200);
    res.json({
      data,
    });
  } else {
    next(new Error('Bad request'));
  }
};

exports.companyCustomers = async (req, res, next) => {
  const {
    doc,
    user,
  } = req;

  console.log('doc', req);
  try {
    const promotions = await Promotion.find({ user: user.id });
    const data = await Model
      .find({
        promotion: { $in: promotions.map(promotion => promotion._id) },
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
