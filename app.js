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
        if (err) {
            res.end(500, err.message);
        } else if (!data) {
            res.end(404, req.path);
        } else {
            res.set({
                'Content-Type': 'image/png',
                'Content-Length': data.length,
                'Cache-Control': 'public, max-age=604800'
            });
            res.end(data, 'binary');
        }
    });
});

var port = process.env.PORT || 5000;
app.listen(port);
console.log('Server listening on port ' + port);