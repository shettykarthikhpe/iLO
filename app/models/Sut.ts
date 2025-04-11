import mongoose, { model, models } from 'mongoose';

const SutSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
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

const Sut = models.Sut || model('Sut', SutSchema);
export default Sut;