const app = require('./app');

const server = app.listen(process?.env?.PORT, (req, res) => {
    console.log(`server is running on ${process?.env?.PORT}`)
})