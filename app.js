var express = require('express'),
    levelup = require('levelup'),

    db = levelup(process.argv[2], {
        cacheSize: 8 * 1024 * 1024 * 1024, // 8 GB
        valueEncoding: 'binary'
    }),

    app = express();

app.get('/*', function (req, res) {
    var tms = req.path.substring(1);
    db.get(tms, function (err, data) {
        if (err || !data) {
            res.send(404, req.path);
        } else {
            res.set({
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=3600'
            });
            res.end(data, 'binary');
        }
    });
});

var port = process.env.PORT || 5000;
app.listen(port);
console.log('Server listening on port ' + port);