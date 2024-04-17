const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/:date?", (req, res, next) => {
    if (!req.params.date) {
        req.date = new Date();
        return next();
    }

    if (!isNaN(req.params.date)) {
        req.date = new Date(Number(req.params.date));
        return next();
    }

    const date = new Date(req.params.date);
    if (!isNaN(date)) {
        req.date = date;
        return next();
    }

    req.error = "Invalid Date";
    next();
}, (req, res) => {
    if (req.error) {
        res.json({ error: req.error });
        return;
    }

    res.json({
        unix: req.date.valueOf(),
        utc: req.date.toUTCString()
    });
});

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log(`Your app is listening on port ${listener.address().port}`);
});
