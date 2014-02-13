var levelup = require('levelup');

if (process.argv.length < 4) {
    return console.error("import <src> <dst>");
}
    
var src = levelup(process.argv[2], {valueEncoding: 'binary'});
var dst = levelup(process.argv[3], {valueEncoding: 'binary'});

src.createReadStream().pipe(dst.createWriteStream()).on('close', function (err) {
    if (err) {
        console.error(err);
    } else {
        console.log("Done.");
    }
});
