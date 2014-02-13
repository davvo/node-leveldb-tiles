var fs = require('fs'),
    tar = require('tar'),
    levelup = require('levelup');

if (process.argv.length < 4) {
    return console.error("import <tarfile> <leveldb>");
}

var tarfile = process.argv[2];
var db = levelup(process.argv[3]);

var regex = /(\w+)\/EPSG_900913_0?(\d+)\/.*\/(\d+)_(\d+)\.(\w+)/;
var count = 0;
var start = new Date().getTime();

fs.createReadStream(tarfile)
    .pipe(tar.Parse())
    .on("entry", function (e) {
        var match = regex.exec(e.path);
        var data = [];
        if (match) {
            var tms = match[1] + '/' + match[2] + '/' + match[3] + '/' + match[4] + '.' + match[5];
            e.on("data", function (c) {
                data.push(c);
            })
            e.on("end", function () {
                db.put(tms, Buffer.concat(data), {'valueEncoding': 'binary'});
                ++count;
            });
        }
    })
    .on('end', function () {
        var stop = new Date().getTime();
        console.log("Imported " + count + " tiles in " + ((stop - start) / 1000) + " s.");
    });