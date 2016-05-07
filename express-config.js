var express = require('express');

module.exports = function () {
    var app = express();

    app.set('port', (process.env.PORT || 3101));
    app.use(require('cors')());

    require('./routes/apiNode')(app);

    return app;
}
