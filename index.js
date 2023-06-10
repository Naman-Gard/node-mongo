const express = require('express');
require('dotenv').config();
const app = express();

const server=app.listen(process?.env?.PORT, (req, res) => {
    console.log(server, `server is running on ${process?.env?.PORT}`)
})