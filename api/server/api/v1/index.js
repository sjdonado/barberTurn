const { Router } = require('express');

const users = require('./users/routes');
const products = require('./products/routes');
const userProducts = require('./userProducts/routes');

const router = Router();

router.use('/users', users);
router.use('/products', products);
router.use('/user-products', userProducts);

module.exports = router;
