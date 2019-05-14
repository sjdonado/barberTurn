/* eslint no-underscore-dangle: 0 */
const {
  Model,
  references,
} = require('./model');

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
    .find({ business: user.getId() })
    .populate(referencesNames[0])
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
    const feedback = await Model.findOne({ client: user.getId() });
    if (!feedback) {
      const document = new Model(Object.assign(body,
        { client: user.getId(), business: body.businessId }));
      const data = await document.save();
      res.status(201);
      res.json({
        data,
      });
    } else {
      next(new Error('You have already qualified this company'));
    }
  } catch (e) {
    next(e);
  }
};
