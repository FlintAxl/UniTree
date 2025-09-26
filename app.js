const express = require('express');
const app = express();
const cors = require('cors')
const path = require('path')


const user = require('./routes/user')
const adminRoutes = require('./routes/admin');
const petRoutes = require('./routes/pet'); 

app.use(cors())
app.use(express.json())
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use(express.static(path.join(__dirname, '/public')));


app.use('/api/v1', user);
app.use('/admin', adminRoutes);
app.use('/api/v1', petRoutes);

module.exports = app