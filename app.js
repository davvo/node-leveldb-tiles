var express = require('express'),
    levelup = require('levelup'),

    db = levelup(process.env.LEVEL_DB || 'db'),
    app = express();

app.get('/*', function (req, res) {
    var tms = req.path.substring(1);
    db.get(tms, {'valueEncoding': 'binary'}, function (err, data) {
        if (err || !data) {
            res.send(404, req.path);
        } else {
            res.header('Content-Type', 'image/png');
            res.end(data, 'binary');
        }
    });
});

var port = process.env.PORT || 5000;
app.listen(port);
console.log('Server listening on port ' + port);