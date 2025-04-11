import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name:{
    type:String,
    required: true
  },
  ip:{
    type: String,
    required: true
  },
  username:{
    type:String,
    required: true
  },
  password:{
    type:String,
    required:true
  }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;