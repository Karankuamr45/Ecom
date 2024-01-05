import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
 
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'], // Enumerated values for gender
    required: true,
  },

  country: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user', // Default role is set to 'user'
  },
});

const userModel = mongoose.model('User', userSchema);

export default userModel;
