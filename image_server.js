
var express  = require('express')
  , app      = express()
  , request  = require('request')
  , gm       = require('gm')
  , fs       = require('fs')
  , http     = require('http');

/* http:/localhost:2687/img?url=.... */
app.get('/img', function(req, res) {
    var _url = require('url').parse(req.query.url);

    console.log('hostname: ' + _url.hostname);
    console.log('pathname: ' + _url.pathname);

    var options = {
        hostname: _url.hostname,
        method: 'GET',
        path: _url.pathname
    };

    var request = http.request(options, function (response) {

        console.log('response header received');
        response.pipe(fs.createWriteStream('temp_img.jpg'));

        response.on('end', function() {
            console.log('finished');

            res.set('Content-Type', 'image/jpeg');

            gm('temp_img.jpg')
                .resize(32, 32)
                .stream(function stream(err, stdout, stderr) {
                    console.log('stream image');

                    if (err) { console.log('got error ' + err.message); }
                        stdout.pipe(res); //pipe to response

                        stdout.on('error', function () { console.log('got error'); });
                    });
          });

        response.on('error', function (err) {
            console.log('got error ' + err.message);
        });

    });

    request.on('error', function (err) {
        console.log('got error' + err.message);
    });

    /* !!! always need end */
    request.end();

});

app.listen(8088);
