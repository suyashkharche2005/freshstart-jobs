import mongoose from 'mongoose';
const applicationSchema = new mongoose.Schema({
  job:{type:mongoose.Schema.Types.ObjectId,ref:'Job',required:true,index:true},
  candidate:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},
  coverLetter:{type:String,trim:true,maxlength:1500}, resumeUrl:{type:String,required:true,trim:true},
  status:{type:String,enum:['applied','reviewing','shortlisted','rejected','hired'],default:'applied'}
},{timestamps:true});
applicationSchema.index({job:1,candidate:1},{unique:true});
export default mongoose.model('Application',applicationSchema);
