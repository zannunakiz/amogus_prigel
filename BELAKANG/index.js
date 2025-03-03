const express = require('express')
const mongoose = require('mongoose')
const app = express()
const ProductRoute = require('./routes/product.route.js')
const cors = require('cors');

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/products', ProductRoute)


app.get('/', (req, res) => {
    res.send('Hello World!')
})



mongoose.connect('mongodb+srv://admin:123@backendcrud.8kiso.mongodb.net/?retryWrites=true&w=majority&appName=backendcrud')
    .then(() => {
        console.log('Connected!')
        app.listen(3000, () => {
            console.log('server is running on port 3000')
        })
    })
    .catch((err) => console.log('Connection failed: ', err))




