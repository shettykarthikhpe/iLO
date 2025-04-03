import mongoose from 'mongoose';

const SutSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name:{
    type:String,
    required: true
  },
  sut:[
    {
        type:String,
        required:true
    }
  ]
});

export default mongoose.models.Sut || mongoose.model('Sut', SutSchema);