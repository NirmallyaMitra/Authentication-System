import userModel from "../models/users.model";
import crypto from "crypto";

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
}