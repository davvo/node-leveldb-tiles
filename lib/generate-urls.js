var levelup = require('levelup'),
    db = levelup(process.argv[2]);

db.createKeyStream().on('data', function (key) {
    console.log(key);
});