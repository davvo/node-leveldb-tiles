var fs = require('fs'),
    walk = require('walk'),
    levelup = require('levelup');

if (process.argv.length < 4) {
    return console.error("import <dir> <leveldb>");
}

var dir = process.argv[2];
var db = levelup(process.argv[3], {
    valueEncoding: 'binary'
});

var regex = /(\w+)\/EPSG_900913_0?(\d+)\/.*\/(\d+)_(\d+)\.(\w+)/;
var count = 0;
var start = new Date().getTime();
var walker = walk.walk(dir);

walker.on("directories", function (root, dirStatsArray, next) {
    console.log(root);
    next();
});

walker.on('file', function (root, file, next) {
    var path = root + '/' + file.name;
    var match = regex.exec(path);
    if (match) {
        var tms = match[1] + '/' + match[2] + '/' + match[3] + '/' + match[4] + '.' + match[5];
        db.put(tms, fs.readFileSync(path), function () {
            ++count;
            next();
        });
    } else {
        next();
    }
});

walker.on('end', function () {
    db.close();
    var stop = new Date().getTime();
    console.log("Imported " + count + " tiles in " + ((stop - start) / 1000) + " s.");
});