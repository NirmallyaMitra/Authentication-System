import userModel from "../models/users.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import config from "../config/config.js";

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

  const token = jwt.sign({
    id: user._id
  },config.JWT_SECRET,{
    expiresIn: "1h"
  });

  res.status(201).json({
    message: "User created successfully.",
    userid: user._id,
    token
  })
}