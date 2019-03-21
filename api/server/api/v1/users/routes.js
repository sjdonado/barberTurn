const router = require('express').Router();
const passport = require('passport');

const controller = require('./controller');

router.route('/')
  .get(controller.read)
  .post(controller.create)
  .put(controller.update);

router.get('/companies', controller.companies);

router.post(
  '/login',
  passport.authenticate('local'), (req, res) => {
    res.json({
      data: req.user,
    });
  },
);

router.post('/google', controller.googleOauth);

router.post(
  '/login/google',
  passport.authenticate('token'), (req, res) => {
    res.json({
      data: req.user,
    });
  },
);

router.get('/logout', (req, res) => {
  req.logout();
  res.send(null);
});

module.exports = router;
