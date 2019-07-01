const express = require('express');
const path = require('path');
const app = express();
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('properties.ini');
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
var MongoClient = require('mongodb').MongoClient;
let collection = []
var url = properties.get('mongo.url');
var bodyParser = require('body-parser');
var cors = require('cors');
var ObjectID = require('mongodb').ObjectID;


app.use(cors()) 

app.use(bodyParser.json())

MongoClient.connect(url, function(err, db) {
  console.log('bien connecté')  
  if (err){console.log(err);}
    collection = db.collection('tasks');
})

app.get('/api/tasks', (req, res) => {
  collection.find().toArray(function(err, docs) {
    res.json(docs)
  })
})
app.post('/api/create',(req, res) => {
  collection.insert(req.body)
  res.send('successfully added to your database');
})
app.post('/api/update',(req, res) => {
  const newValue = req.body.newValue
  const keyName = req.body.keyName
  var updateSet = {};
  updateSet[keyName] = newValue;        
  collection.updateOne({ _id : ObjectID(req.body.id)}, { $set: updateSet })
  res.send('successfully updated to your database');
})

app.post('/api/delete',(req, res) => {        
  collection.remove({_id: ObjectID(req.body.id)});
  res.send('successfully deleted from your database');
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Password generator listening on ${port}`);