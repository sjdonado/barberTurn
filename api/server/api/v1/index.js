const { Router } = require('express');

const users = require('./users/routes');
const products = require('./products/routes');
const userProducts = require('./userProducts/routes');
const feedbacks = require('./feedbacks/routes');

const router = Router();

router.use('/users', users);
router.use('/products', products);
router.use('/user-products', userProducts);
router.use('/feedbacks', feedbacks);
module.exports = router;
