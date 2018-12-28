var ftp_settings = require("./ftp_settings.js");
var Client = require('ftp');
var fs = require('fs');

console.log(process.argv);
if (process.argv.length < 5) {
    console.log("USAGE: node ftpupload.js <infile> <uploadDir> <uploadFilename>");
    return 1;
}

var filename       = process.argv[2];
var uploadDir      = process.argv[3];
var uploadFilename = process.argv[4];

console.log(`Uploading ${filename} as ${uploadFilename}...`);

fs.readFile(filename, function read(err, data) {
    if (err) {
        throw err;
    }
    content = data;

    var c = new Client();
    c.on('ready', function() {
        c.cwd(uploadDir, function(err, currentDir) {
            if (err) throw err;
            c.put(data, uploadFilename, function(err) {
                if (err) throw err;
                c.end();
                console.log(`Success`);
            });
        });
    });

    c.connect(ftp_settings);
});
