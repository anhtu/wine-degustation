
var express  = require('express')
  , app      = express()
  , request  = require('request')
  , gm       = require('gm')
  , fs       = require('fs');

/* http:/localhost:2687/img?url=.... */
app.get('/img', function(req, res) {
	var _url = req.query.url;
	console.log(_url);


//var _url = 'http://cozier.co.za/wp-content/uploads/2013/02/white-wines-chardonnay-2010-diemersdal-unwooded.jpg';
      			//res.setHeader('Content-Type', 'image/jpeg');
 res.set('Content-Type', 'image/jpeg');

	//if (req.headers['content-type'] === 'image/jpeg') {
		request.get(_url).pipe(fs.createWriteStream('temp_img.jpg')).pipe(res);
//r.on('end', function () { 
//	console.log('end');
			//res.sendfile('temp_img.jpg');
//});
		/* resize and stream out the reponse */
		//r.on('end', function () { 
		//	console.log('end');
		//	gm('temp_img.jpg')
		//	.resize(32, 32)
			//.stream(function (err, stdout, stderr) {
      		//	stdout.pipe(res);
    		//});
			//res.sendfile('temp_img.jpg');
		//	.stream(function streamOut (err, stdout, stderr) {
        //    if (err) return next(err);
        //    stdout.pipe(res); //pipe to response

            // the following line gave me an error compaining for already sent headers
            //stdout.on('end', function(){res.writeHead(200, { 'Content-Type': 'ima    ge/jpeg' });}); 

       //     stdout.on('error', next);
       // });
	//	});
//res.sendfile('temp_img.jpg');
      //	    .write('temp_img.jpg', function () {});//, function () {    
      		//	fs.exists('temp_img.jpg', function (exists) {
      	//		if (exists) {
      	//			console.log('exists');
      	//		res.sendfile('temp_img.jpg');
		//		}
      	//		}); 
      	    //});
    //} else {
    //    res.writeHead(400);
    //    res.end('Feed me a JPEG!');
    //} 
});

app.listen(2687);
