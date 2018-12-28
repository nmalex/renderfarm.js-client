var ftp_settings = require("./ftp_settings.js");
var Client = require('ftp');
var fs = require('fs');

console.log(process.argv);
if (process.argv.length < 4) {
    console.log("USAGE: node ftpupload.js <infile> <outfile>");
    return 1;
}

var filename       = process.argv[2];
var uploadFilename = process.argv[3];

console.log(`Uploading ${filename} as ${uploadFilename}...`);

fs.readFile(filename, function read(err, data) {
    if (err) {
        throw err;
    }
    content = data;

    var c = new Client();
    c.on('ready', function() {
        c.put(data, uploadFilename, function(err) {
            if (err) throw err;
            c.end();
            console.log(`Success`);
        });
    });

    c.connect(ftp_settings);
});
