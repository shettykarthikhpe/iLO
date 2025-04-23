import mongoose, { model, models } from 'mongoose';

const SutSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  sut:[
    {
      ip:{
      type:String,
      required:true
    },
    username:{
      type:String,
      required: true
    },
    password:{
      type:String,
      required:true
    }
  }
  ]
});

const Sut = models.Sut || model('Sut', SutSchema);
export default Sut;