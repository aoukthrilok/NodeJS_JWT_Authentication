const express = require("express");
const app = express();
const path = require("path");
const jwt = require("jsonwebtoken");
const exjwt = require("express-jwt");
const bodyParser = require("body-parser");
const PORT = 3000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Headers", "Content-type, Authorization");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const secretKey = "My super secret key";

const jwtMW = exjwt({
  secret: secretKey,
  algorithms: ["HS256"],
});

let users = [
  {
    id: 1,
    username: "Thrilok",
    password: "1234",
  },
  {
    id: 2,
    username: "fabio",
    password: "1234",
  },
];

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

var1=false
for (let user of users) {
  if (username == user.username && password == user.password) {
    var1 = true;
    let token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: "3m" });
    res.json({
      success: true,
      err: null,
      // username,
      token
    });
    break;
  }
}
if (!var1) {
  res.status(401).json({
    success: false,
    token: null,
    err: "Username or password is incorrect"
  });
}
});

app.get("/api/dashboard", jwtMW, (req, res) => {
  console.log("called");
  res.json({
    success: true,
    myContent: "Secret content that only logged in people can see!!!",
  });
});

app.get("/api/settings", jwtMW, (req, res) => {
  res.json({
    success: true,
    myContent: "My settings Page",
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use(function (err, req, res, next) {
  // console.log("data", req.headers);
  const token = req.headers.authorization;
  // console.log(jwt.verify(token, secretKey));

  //if(jwt.verify(token, secretKey))
  try {
    var decoded = jwt.verify(token, secretKey);
    res.json({
      success: true,
      myContent: "Secret content that only logged in people can see!!!",
    });
  } catch (err) {
    // err
    res.status(401).json({
      success: false,
      officialError: err,
      err: "Incorrect token",
    });
  }

  // if(jwt.verify(token, secretKey))
  // {
  //    res.json({
  //       success: true,
  //       myContent: 'Secret content that only logged in people can see!!!'
  //   });
  // }
  // else
  // {
  //   res.status(401).json({
  //         success: false,
  //         officialError : err,
  //         err : 'Username or Password is incorrect 2'
  //     });
  // }
  // console.log(err.name == 'UnauthorizedError');
  // console.log(err);
  // if(err.name == 'UnauthorizedError'){
  //     res.status(401).json({
  //         success: false,
  //         officialError : err,
  //         err : 'Username or Password is incorrect 2'
  //     });
  // } else {
  //     next(err);
  // }
});

app.listen(PORT, () => {
  console.log(`Serving on port ${PORT}`);
});
