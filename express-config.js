var express = require('express');

module.exports = function () {
    var app = express();
    
    app.use(require('cors')());

    require('./routes/apiNode')(app);

    return app;
}
