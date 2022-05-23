const express = require('express')
const app = express()
const port = 4000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://guenwon:1683111@boilerplate.m9ixi.mongodb.net/?retryWrites=true&w=majority', {
    
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log('error'))


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

