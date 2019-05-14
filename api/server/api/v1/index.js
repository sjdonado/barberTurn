const { Router } = require('express');

const users = require('./users/routes');
const promotions = require('./promotions/routes');
const userPromotions = require('./userPromotions/routes');
const turns = require('./turns/routes');
const feedbacks = require('./feedbacks/routes');

const router = Router();

router.use('/users', users);
router.use('/promotions', promotions);
router.use('/user-promotions', userPromotions);
router.use('/turns', turns);
router.use('/feedbacks', feedbacks);

module.exports = router;
