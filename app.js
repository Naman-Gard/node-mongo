const express = require('express');
const cors = require('cors')
const candidateRoutes = require('./routes/candidateRoutes')

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors())

app.use('/api/vi/backend', candidateRoutes)

module.exports = app