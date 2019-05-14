const router = require('express').Router();

const controller = require('./controller');
// const { auth } = require('../../../utils/authentication');
const { isACompany } = require('../../../utils/authorization');

router
  .param('id', controller.id);

router.route('/')
  .post(controller.create);

router.get('/read/:id', controller.read);
router.get('/all', controller.all);
// router.get('/customers', controller.companyCustomers);

router.post('/status/:id', isACompany, controller.status);
router.post('/qualify/:id', controller.qualify);

module.exports = router;
