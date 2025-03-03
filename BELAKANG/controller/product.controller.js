const Product = require('../models/product.model.js')

const getProduct = async (req, res) => {
    try {
        const products = await Product.find({})
        res.status(200).json(products)

    }
    catch (err) {
        res.status(500).send(err)
    }
}

const getProductID = async (req, res) => {
    try {
        const { id } = req.params
        const selected = await Product.findById(id)
        if (!selected) {
            return res.status(400).json({ msg: 'Not Found' })
        }
        return res.status(200).json(selected)
    }
    catch (err) {
        return res.status(500).json({ msg: err })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        const selected = await Product.findByIdAndDelete(id)
        if (!selected) {
            return res.status(400).json({ msg: 'Not Found' })
        }
        return res.status(200).json({ msg: `Deleted Successfully for id: ${id}` })
    }
    catch (err) {
        res.status(500).json({ msg: err })
    }
}

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const selected = await Product.findByIdAndUpdate(id, req.body)

        if (!selected) {
            return res.status(400).json({ msg: 'Not Found' })
        }

        const updated = await Product.findById(id)
        return res.status(200).json(updated)

    }
    catch (err) {
        return res.status(500).json({ msg: err })
    }
}

const addProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body)
        return res.status(200).json(product)

    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
module.exports = { getProduct, getProductID, deleteProduct, updateProduct, addProduct }  