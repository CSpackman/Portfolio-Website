const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp()
const express = require('express');
const app = express();
const cors = require('cors');
const initizalize = require('./passportConfig');
const db = admin.firestore()
function checkPassword(password, passwordToCheck, callback) {
    bcrypt.compare(password, passwordToCheck, function (err,same) {
        if(err){
            callback(err);
        }else{
            callback(err,same);
        }
    })
}
var corsOptions = {
  orgin: "http://localhost:3000/",
}
app.use(cors(corsOptions));

async function getData(){
  const cityRef = db.collection('cities').doc('SF');
const doc = await cityRef.get();
if (!doc.exists) {
  console.log('No such document!');
} else {
  console.log('Document data:', doc.data());
}
}

app.get('/test', function(req, res){
  getData();
  res.send("worked")
})
app.get('/home', function(req, res) {
    res.send('Welcome!');
  });

app.get('/checkToken', initizalize, function(req, res) {
  res.sendStatus(200);
  });
app.get('/skills', function (req, res) {
  //let rawData = fs.readFileSync('./uploads/data.json');
  //let parsedData = JSON.parse(rawData)
  res.send("test2");  
  });



exports.app = functions.https.onRequest(app);
