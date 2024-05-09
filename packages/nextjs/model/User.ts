import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  self_rating: {
    type: Number,
    required: true,
  },
  peer_rating: {
    type: Number,
    required: true,
  },
  proof_of_work: [String],
  verifiers: [String],
});

// Define the user schema
export const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  image: String,
  github: String,
  portfolio: String,
  buidlguidl: String,
  twitter: String,
  skills: [SkillSchema], // Use the skills subdocument schema here
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
