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
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  github: String,
  portfolio: String,
  buidlguidl: String,
  skills: [SkillSchema], // Use the skills subdocument schema here
});

const UsersArraySchema = new mongoose.Schema({
  users: [UserSchema], // Use the user schema here
});

let UsersArray;
try {
  UsersArray = mongoose.model("UsersArray");
} catch (e) {
  UsersArray = mongoose.model("UsersArray", UsersArraySchema);
}

export default UsersArray;
