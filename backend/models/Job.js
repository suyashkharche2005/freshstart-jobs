import mongoose from 'mongoose';
const jobSchema = new mongoose.Schema({
  recruiter:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},
  title:{type:String,required:true,trim:true,maxlength:100}, company:{type:String,required:true,trim:true,maxlength:100},
  location:{type:String,required:true,trim:true}, workMode:{type:String,enum:['On-site','Hybrid','Remote'],default:'Hybrid'},
  type:{type:String,enum:['Full-time','Internship','Contract'],default:'Full-time'},
  experience:{type:String,required:true,trim:true}, salary:{type:String,trim:true},
  description:{type:String,required:true,trim:true,minlength:30,maxlength:5000},
  skills:[{type:String,trim:true}], deadline:{type:Date}, status:{type:String,enum:['active','closed'],default:'active'}
},{timestamps:true});
jobSchema.index({title:'text',company:'text',location:'text',skills:'text'});
export default mongoose.model('Job',jobSchema);
