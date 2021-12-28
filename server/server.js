if(process.env.NODE_ENV !='production'){
    require('dotenv').config()
}


const fileUpload = require('express-fileupload');
const express = require('express');
const bcrypt = require('bcrypt');
const app = express();

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.json())
const initizalize = require('./passportConfig');
const fs = require('fs');
const cors = require('cors');
app.use(express.text())


app.use(fileUpload());
app.use(cors({
  origin: 'http://localhost:3000'
}));


const users=[]

async function  genUser(){
    try{
        const hashedPassword =  await bcrypt.hash("password", 10);
        users.push({
            username: "admin",
            password: hashedPassword
        }) 
    }catch{
        console.log("error")
    }
    var users_data = JSON.stringify(users);
    fs.writeFile('data.json',users_data,'utf8',function(){
    })
}
genUser();


const port = process.env.PORT || 8000

function checkPassword(password, passwordToCheck, callback) {
    bcrypt.compare(password, passwordToCheck, function (err,same) {
        if(err){
            callback(err);
        }else{
            callback(err,same);
        }
    })
}

app.get('/home', function(req, res) {
    res.send('Welcome!');
  });
  app.get('/checkToken', initizalize, function(req, res) {
    res.sendStatus(200);
  });
 
  app.get('/skills', function (req, res) {
    let rawData = fs.readFileSync('./uploads/data.json');
    let parsedData = JSON.parse(rawData)
    console.log(parsedData.skills)
    res.send(parsedData.skills)
    
  })


app.get('/secret', initizalize, function(req, res) {
    res.send('The password is potato');
  });



app.post('/authenticate', function(req, res){
    const { username, password } = req.body;
    const passwordToCheck =users[0].password
    const secret = process.env.SESSION_SECRET
    checkPassword(password, passwordToCheck, function (err,same) {
        if(err){
            res.status(500)
              .json({
              error: 'Internal error please try again'
            });
        }else if(!same){
            res.status(401)
              .json({
              error: 'Incorrect email or password'
            });
        }else{
            const payload = { username };
            const token = jwt.sign(payload, secret, {
              expiresIn: '1h'
            });
            res.cookie('token', token, { httpOnly: true }).sendStatus(200);
        }
        
    })
})
app.post('/upload/resume', (req, res) => {
  if(req.files===null){
    return res.status(500).send({ msg: "file is not found" })
  }else{
    const resume = req.files.file;
    resume.name = "My_RESUME.pdf";
    resume.mv('./uploads/'+resume.name)
    res.send({msg: "file uploaded"})
    }
  });
app.post('/upload/skills', function (req, res) {
  const skills = req.body.mesg
  if(skills===null){
    return res.status(500).send({ msg: "file is not found" })
  }else{
      let rawData = fs.readFileSync('./uploads/data.json');
      let parsedData = JSON.parse(rawData)
      parsedData.skills = skills
      var finalData = JSON.stringify(parsedData)
      console.log(parsedData)
      fs.writeFile('./uploads/data.json', finalData, function(err){
        if(err) return console.log(err);
        console.log("Success")
      })

    // data = JSON.stringify(parsedData)
    // fs.writeFile('./uploads/data.json',data, (err)=>{
    //   if(err) throw err;
    // })
  }
  
})

app.get('/resume', (req, res) => {
  res.sendFile('uploads/Myresume.pdf', { root: __dirname });
});

// app.post('/test', function(req, res) {
//     const { email, password } = req.body;
//     users[1], function(err, user) {
//       if (err) {
//         console.error(err);
//         res.status(500)
//           .json({
//           error: 'Internal error please try again'
//         });
//       } else if (!user) {
//         res.status(401)
//           .json({
//           error: 'Incorrect email or password'
//         });
//       } else {
//         user.checkPassword(password, function(err, same) {
//           if (err) {
//             res.status(500)
//               .json({
//               error: 'Internal error please try again'
//             });
//           } else if (!same) {
//             res.status(401)
//               .json({
//               error: 'Incorrect email or password'
//             });
//           } else {
//             // Issue token
//             const payload = { email };
//             const token = jwt.sign(payload, secret, {
//               expiresIn: '1h'
//             });
//             res.cookie('token', token, { httpOnly: true }).sendStatus(200);
//           }
//         });
//       }
//     };
// });
//dev

console.log('Your server available at http://localhost:'+port)

app.listen(port)