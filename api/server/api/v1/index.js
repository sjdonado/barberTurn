const { Router } = require('express');

const users = require('./users/routes');
const promotions = require('./promotions/routes');
const userPromotions = require('./userPromotions/routes');
const feedbacks = require('./feedbacks/routes');

const router = Router();

router.use('/users', users);
router.use('/promotions', promotions);
router.use('/user-promotions', userPromotions);
router.use('/feedbacks', feedbacks);
module.exports = router;
