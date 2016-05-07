var app = require('./express-config')();

app.listen(app.get('port'), function() {
  console.log('servidor rodando na porta %s' + app.get('port'));
});
