
const express = require('express')
const {spawn} = require('child_process');
const bodyParser = require('body-parser');
const app = express()
const port = 3000

const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

app.use(allowCrossDomain);
app.use(bodyParser.json());


app.listen(port, () => console.log(`listening on port ${port}`))

app.post('/run-python-script', (req , res ) => {
  var spawn = require("child_process").spawn;
  var process = spawn('python3',["./main.py", req.body.binSize, req.body.numberOfObj, req.body.numberOfGenerations]);
  process.stdout.on('data', function(data) {
    res.send(JSON.stringify(data.toString('utf8')))
  } )
});
