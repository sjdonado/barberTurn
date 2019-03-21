const {
  Model,
  fields,
  references,
} = require('./model');

const { uploadFile, deleteFile } = require('../../../utils/files');

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
        res.json({
          sucess: false,
          message: `${Model.modelName} not found`,
        });
      }
    })
    .catch((err) => {
      next(new Error(err));
    });
};

exports.all = async (req, res, next) => {
  const {
    query,
  } = req;

  const { company } = query;

  Model
    .find({ user: company })
    .then((data) => {
      res.json({
        data,
      });
    })
    .catch((err) => {
      next(new Error(err));
    });
};

exports.companyProducts = async (req, res, next) => {
  const {
    user,
  } = req;

  Model
    .find({ user: user.id })
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

// exports.productsByCompanyId = async (req, res, next) => {
//   const {
//     company,
//   } = req;

//   Model
//     .find({ user: company.id })
//     .populate(referencesNames.join(' '))
//     .then((data) => {
//       res.json({
//         data,
//       });
//     })
//     .catch((err) => {
//       next(new Error(err));
//     });
// };

exports.create = async (req, res, next) => {
  const {
    body,
    user,
    files,
  } = req;

  try {
    const s3Data = await uploadFile(files.file);
    const document = new Model(
      Object.assign(body, {
        user: user.id,
        coverPicture: { key: s3Data.key, url: s3Data.Location },
      }),
    );
    const data = await document.save();
    res.status(201);
    res.json({
      data,
    });
  } catch (e) {
    next(e);
  }
};

exports.read = (req, res, next) => {
  if (!next) {
    const {
      user,
    } = req;
    res.json({
      data: user,
    });
  }
};

exports.update = async (req, res, next) => {
  const {
    doc,
    body,
    files,
  } = req;

  try {
    Object.assign(doc, body);
    if (files && files.file) {
      await deleteFile(doc.coverPicture.key);
      const s3Data = await uploadFile(files.file);
      Object.assign(doc, { coverPicture: { key: s3Data.key, url: s3Data.Location } });
    }
    Object.assign(doc, body);
    const data = await doc.save();
    res.json({
      data,
    });
  } catch (e) {
    next(e);
  }
};

exports.delete = async (req, res, next) => {
  const {
    doc,
  } = req;

  try {
    await deleteFile(doc.coverPicture.key);
    const data = await doc.remove();
    res.json({
      data,
    });
  } catch (e) {
    next(e);
  }
};

exports.Product = Model;
