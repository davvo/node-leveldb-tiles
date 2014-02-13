var levelup = require('levelup');

if (process.argv.length < 4) {
    return console.error("import <src> <dst>");
}
    
var src = levelup(process.argv[2], {valueEncoding: 'binary'});
var dst = levelup(process.argv[3], {valueEncoding: 'binary'});
var start = new Date().getTime();

src.createReadStream().pipe(dst.createWriteStream()).on('close', function (err) {
    if (err) {
        console.error(err);
    } else {
        var stop = new Date().getTime();
        console.log('Done in ' + ((stop - start) / 1000) + ' s');
    }
});
