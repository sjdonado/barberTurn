module.exports.isACompany = async (req, res, next) => {
  // console.log('isACompany', req.user);
  if (req.user.role) {
    next();
  } else {
    next(new Error('Forbidden'));
  }
};
