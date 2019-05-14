module.exports.isACompany = async (req, res, next) => {
  if (req.user && req.user.role) {
    next();
  } else {
    next(new Error('Forbidden'));
  }
};
