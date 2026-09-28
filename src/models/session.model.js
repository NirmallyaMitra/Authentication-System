import mongoose from "mongoose";
import { refreshToken } from "../controllers/auth.controller";

const sessionSchema = new mongoose.Schema({
  user:{
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: [true, "User is required."]
  },
  refreshTokenHash:{
    type: String,
    required: [true, "Refresh token is required."]
  },
  ip: {
    type: String,
    required: [true, "IP adress is required."]
  },
  userAgent: {
    type: String,
    required: [true, "User Agent Details are required."]
  },
  revoked: {
    type: Boolean,
    default: false
  }
},{
  timestamps: true
});

const sessionModel = mongoose.model("Sessions", sessionSchema);

export default sessionModel;