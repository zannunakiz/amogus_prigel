const express = require('express')
const router = express.Router()
const { getProduct, getProductID, deleteProduct, updateProduct, addProduct } = require('../controller/product.controller.js') 

router.route('/').get(getProduct).post(addProduct)
router.route('/:id').get(getProductID).delete(deleteProduct).put(updateProduct)

module.exports = router