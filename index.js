const http = require('http');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://mongo:27017';
const dbName = 'test';
const port = process.env.PORT || 8000;
let db = null;
let collection = null;
async function incrementPageHit() {
  let client = await MongoClient.connect(url, {
    useNewUrlParser: true
  });
  console.log("Connected successfully to server");
  db = client.db(dbName);
  collection = db.collection('hitcount');
    let result = await collection.findOneAndUpdate({}, {
      $inc: {
        hit: 1
      }
    }, {
      upsert: true,
      new: true
    });
    client.close();
    if(result.value&&result.value.hit)
        return result.value.hit+1;
    else  
        return 1;
}

http.createServer(function (req, res) {
  if (req.url == '/') {
    incrementPageHit().then((count) => {
      res.write(`page hit count is  : ${count} `); //write a response to the client
      res.end(); //end the response
    }).catch((err)=>{
      console.log(err)
      res.write(`unable to fetch page hit count something is wrong!!!!`); //write a response to the client
      res.end(); //end the response
    });
  }
  console.log(`app is running at port ${port}`)
}).listen(port);