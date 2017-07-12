const app = require('./application')();

app.listen(app.get('port'), () => {
    console.log(`server runs in port ${app.get('port')}`);
});