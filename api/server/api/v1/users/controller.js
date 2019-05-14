const passport = require('passport');

const {
  Model,
  fields,
} = require('./model');

const { uploadFile, deleteFile } = require('../../../utils/files');
const { verifyToken } = require('../../../utils/authentication');

exports.companies = async (req, res, next) => {
  Model.find({ role: true })
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
    files,
  } = req;

  try {
    Object.assign(body, {
      role: body.role || false,
      profilePicture: { url: 'https://s3.us-east-2.amazonaws.com/barberturn/DEFAULT_PROFILE_PICTURE_NO_DELETE.png', key: null },
    });
    if (files && files.file) {
      const s3Data = await uploadFile(files.file);
      Object.assign(body, {
        profilePicture: { key: s3Data.key, url: s3Data.Location },
      });
    }

    const document = new Model(body);
    const data = await document.save();

    passport.authenticate('local')(req, res, () => {
      res.status(201);
      res.json({
        data,
      });
    });
  } catch (e) {
    next(e);
  }
};

exports.googleOauth = async (req, res, next) => {
  const {
    body,
    files,
  } = req;

  try {
    const token = await verifyToken(body.email);
    Object.assign(body, {
      email: token.email,
      googleAuth: true,
      role: body.role || false,
      profilePicture: { url: body.profilePictureUrl, key: null },
    });
    const document = new Model(body);
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
  const {
    user,
  } = req;
  res.json({
    data: user,
  });
};


exports.update = async (req, res, next) => {
  const {
    user,
    body,
    files,
  } = req;

  try {
    console.log('BODY', body);
    if (body.password !== user.password && body.password < 5) {
      delete body.password;
    }
    Object.assign(user, body);
    if (files && files.file) {
      if (user.profilePicture.key) await deleteFile(user.profilePicture.key);
      const s3Data = await uploadFile(files.file);
      Object.assign(user, { profilePicture: { key: s3Data.key, url: s3Data.Location } });
    }
    const data = await user.save();
    res.json({
      data,
    });
  } catch (e) {
    next(e);
  }
};

exports.delete = (req, res, next) => {
  const {
    doc,
  } = req;

  doc.remove()
    .then((data) => {
      res.json({
        data,
      });
    })
    .catch((err) => {
      next(new Error(err));
    });
};
