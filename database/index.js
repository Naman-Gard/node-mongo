const mongoose = require('mongoose');
const timestamp = require('../plugins/timestamp');

const url = 'mongodb+srv://mongodb:mongo@test.ygm5y1e.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(url,
    {
        useNewUrlParser: true,
        // useFindAndModify: false,
        useUnifiedTopology: true
    });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});

mongoose.plugin(timestamp)

module.exports = mongoose;

