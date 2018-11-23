const http = require('http');
var redis = require("redis"),
    client = redis.createClient(6379, 'redis');
http.createServer(function (req, res) {
  if(req.url=='/'){
    client.incr("hit",(err,num)=>{
      res.write(`page hit count is  : ${num} `); //write a response to the client
      res.end(); //end the response
    })
  }
  
}).listen(8000);
