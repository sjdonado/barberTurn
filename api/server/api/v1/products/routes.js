const router = require('express').Router();

const controller = require('./controller');
// const { auth } = require('../../../utils/authentication');
const { isACompany } = require('../../../utils/authorization');

router
  .param('id', controller.id);

router.route('/')
  .get(isACompany, controller.companyProducts)
  .post(isACompany, controller.create);

router.get('/all', controller.all);

router
  .route('/:id')
  .get(controller.read)
  .put(controller.update)
  .delete(controller.delete);

module.exports = router;
