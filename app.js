/**
 *
 * @author Anh-Tu Nguyen
 * <br/><a href="mailto:tuna@exoplatform.com">tuna@exoplatform.com<a/>
 * <br/>04 10, 2013
 */
/**
 *  nodeJS app
 */
var express = require('express')
  , app     = express()
  , _       = require('underscore');

var wineList = [ { name: "Cabernet Sauvignon", id: "cabernet_sauvignon" }
    ,  { name: "Chardonnay", id: "chardonnay" }
    ,  { name: "Saint Amour", id: "saint_amour"}
    ,  { name: "Champagne", id: "champagne"}
    ,  { name: "Côtes du Rhône", id: "cotes_du_rhone"}
];

/* server static file from public folder */
app.use('/public', express.static(__dirname + '/public'));

app.get('/wines', function (req, res) {
    res.send(wineList);
});

app.get('/wines/:id', function (req, res) {
    res.send(_.findWhere(wineList, {id: req.params.id}));
});



app.listen(8888);

console.log("server listening on 8888");