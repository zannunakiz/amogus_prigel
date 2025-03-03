const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema(
    {
        status: {
            type: Boolean,
            required: true
        },
        geotag: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Product = mongoose.model('Product', ProductSchema)
module.exports = Product;  