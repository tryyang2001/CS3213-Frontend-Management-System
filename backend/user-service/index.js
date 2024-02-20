const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());

app.get("/", (req, res) => {
    res.json("Connected to user microservice")
})

// app.use("/user", require('./routes/user-route'));

app.listen(3001, () => {console.log("User microservice started on port 3001")});

module.exports = app;