const express = require('express');
const router = express.Router();

const {newProduct, getProducts, getSingleProduct, updateProduct, deleteProduct} = require('../controllers/productController');

const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/auth')

router.post('/product/new',  isAuthenticatedUser, authorizeRoles('admin', 'encoder'), newProduct)
router.get('/products',  getProducts)
router.get('/product/:id', getSingleProduct);
router.route('/admin/product/:id',isAuthenticatedUser, authorizeRoles('admin',)).put(updateProduct).delete(deleteProduct);

module.exports = router;