const http = require('http');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://mongo:27017';
const dbName = 'test';
const port = process.env.PORT || 8000;
let db = null;
let collection = null;
MongoClient.connect(url, function (err, client) {
  if (err) {
    throw err;
  } else {
    console.log("Connected successfully to server");
    db = client.db(dbName);
    collection = db.collection('hitcount');
    collection.find({}).toArray((err, docs) => {
      if (docs.length <= 0) {
        collection.insertMany([{
          hit: 1
        }]);
      }
    });
  }
});
http.createServer(function (req, res) {
  if (req.url == '/') {

    collection.findOneAndUpdate({}, {
      $inc: {
        hit: 1
      }
    }, {
      new: true
    }, (err, result) => {
      res.write(`page hit count is  : ${result.value.hit} `); //write a response to the client
      res.end(); //end the response
    });
  }
  console.log(`app is running at port ${port}`)
}).listen(port);