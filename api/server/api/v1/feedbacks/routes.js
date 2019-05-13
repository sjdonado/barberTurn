const router = require('express').Router();

const controller = require('./controller');
// const { auth } = require('../../../utils/authentication');
const { isACompany } = require('../../../utils/authorization');

router
  .param('id', controller.id);

router.post(('/'), controller.create);
router.get('/all', isACompany, controller.all);


module.exports = router;
