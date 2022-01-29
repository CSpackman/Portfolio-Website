const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp()
const express = require('express');
const app = express();

const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const initizalize = require('./passportConfig');
const bodyParser = require('body-parser')
app.use(bodyParser.json())


const cookieParser = require("cookie-parser");
app.use(cookieParser());



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
  origin: ["http://localhost:3000", "https://connorspackman.com","https://connorspackman-49d00.web.app"],
  credentials: true,
}
app.use(cors(corsOptions));



async function  genUser(){
  const users=[];
      try{
          const hashedPassword =  await bcrypt.hash("password", 10);
          users.push({
              username: "admin",
              password: hashedPassword
          }) 
      }catch{
          console.log("error")
      }
      //console.log(users);
      //var users_data = JSON.stringify(users);
      //fs.writeFile('data.json',users_data,'utf8',function(){
      //})
  }
  genUser();



async function getData(collection,document){
  const cityRef = db.collection(collection).doc(document);
  const doc = await cityRef.get();
if (!doc.exists) {
  console.log('No such document!');
} else {
  return await doc.data();
}
}



app.post('/authenticate', async function(req, res){
    const secret="secret"
    const { username, password } = req.body;
    var passwordToCheck = await getData("users","admin");
    passwordToCheck=passwordToCheck.password;
    checkPassword(password, passwordToCheck, function (err,same) {  
        if(err){
          console.log("Internal error")
            res.status(500)
              .json({
              error: 'Internal error please try again'
            });
        }else if(!same){
          console.log("Wrong Email")
            res.status(401)
              .json({
              error: 'Incorrect email or password'
            });
        }else{
          const payload = { username };
          const token = jwt.sign(payload, secret, {
            expiresIn: '1h'

          });
          res.setHeader('Cache-Control', 'private');
          res.cookie('__session', token, { httpsOnly: true }).sendStatus(200);
      }
    });
  });
  app.post('/upload/skills', async function (req, res) {
      const skills = req.body.mesg
      if(skills===null){
        return res.status(500).send({ msg: "file is not found" })
      }else{
          await db.collection("publicData").doc("home").set({
            skills: skills
          });
          }
      });
app.post('/upload/resume', (req, res) => {
  console.log(req.files)
  if(req.files.foo===null){
    return res.status(500).send({ msg: "file is not found" })
  }else{
    const resume = req.files.foo;
    console.log(resume)
  }
});
app.get('/skills', async function(req, res){
  res.send((await getData("publicData","home")).skills);
})
app.get('/first', async function(req, res){
  res.send((await getData("publicData","home")).first);
})
app.get('/second', async function(req, res){
  res.send((await getData("publicData","home")).second);
})
app.get('/resume', (req, res) => {

    //res.sendFile('uploads/Myresume.pdf', { root: __dirname });
});

app.get('/home', function(req, res) {
    res.send('Welcome!');
  });

app.get('/checkToken',initizalize, function(req, res) {
  res.sendStatus(200);
  });



exports.app = functions.https.onRequest(app);
