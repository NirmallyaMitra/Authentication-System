import userModel from "../models/users.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import config from "../config/config.js";

// export async function register(req, res){

//   const {username, email, password} = req.body;
//   const isAlreadyRegistered = await userModel.findOne({
//     $or:[
//       {username},
//       {email}
//     ]
//   })
//   if(isAlreadyRegistered){
//     res.status(400).json({
//       messgage: "Username or email already exists."
//     })
//   }

//   const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
  
//   const user = await userModel.create({
//     username,
//     email,
//     password: hashedPassword
//   });

//   const token = jwt.sign({
//     id: user._id
//   },config.JWT_SECRET,{
//     expiresIn: "1h"
//   });

//   res.status(201).json({
//     message: "User created successfully.",
//     userid: user._id,
//     token
//   })
// }

/*
// Some Notes About Cookies
// A cookie is a small piece of data stored in the user's browser.
// When the browser makes another request to your server, it can automatically send those cookies back.

// A common use is authentication:

// Browser
//    ↓
// Login
//    ↓
// Server creates authentication cookie
//    ↓
// Browser stores cookie
//    ↓
// Future requests automatically send cookie

*/
export async function register(req, res){

  const {username, email, password} = req.body;
  const isAlreadyRegistered = await userModel.findOne({
    $or:[
      {username},
      {email}
    ]
  })
  if(isAlreadyRegistered){
    res.status(400).json({
      messgage: "Username or email already exists."
    })
  }

  const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
  
  const user = await userModel.create({
    username,
    email,
    password: hashedPassword
  });

  const accessToken = jwt.sign({
    id: user._id
  },config.JWT_SECRET,{
    expiresIn: "15m"
  });

  const refreshToken = jwt.sign({
    id: user._id
  },config.JWT_SECRET,{
    expiresIn: "7d"
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(201).json({
    message: "User created successfully.",
    userid: user._id,
    accessToken
  });
}

export async function getUser(req, res){
  const token = req.headers.authorization?.split(" ")[1];

  const decoded = jwt.verify(token, config.JWT_SECRET);

  // console.log(decoded);

  const user = await userModel.findById(decoded.id);

  res.status(200).json({
    message: "User fetched Successfully",
    user:{
      username: user.username,
      email: user.email
    }
  })
}

export async function refreshToken(req, res) {

  const refreshToken = req.cookies.refreshToken;

  const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

  const accessToken = jwt.sign({
    id: decoded.id
  }, config.JWT_SECRET,{
    expiresIn: "15m"    
  });

  const newRefreshToken = jwt.sign({
    id: decoded.id,
  }, config.JWT_SECRET,{
    expiresIn: "7d"
  });

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    smeSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(200).json({
    message: "Access token refreshed successfully.",
    accessToken
  });
}