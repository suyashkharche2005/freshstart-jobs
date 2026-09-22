import mongoose from 'mongoose';
const profileSchema = new mongoose.Schema({
  headline:{type:String,trim:true,maxlength:120}, location:{type:String,trim:true,maxlength:80},
  bio:{type:String,trim:true,maxlength:500}, skills:[{type:String,trim:true}], phone:{type:String,trim:true,maxlength:20},
  portfolio:{type:String,trim:true}, github:{type:String,trim:true}, company:{type:String,trim:true,maxlength:100}
},{_id:false});
const userSchema = new mongoose.Schema({
  name:{type:String,required:true,trim:true,minlength:2,maxlength:60},
  email:{type:String,required:true,unique:true,lowercase:true,trim:true},
  password:{type:String,required:true,select:false,minlength:8},
  role:{type:String,enum:['candidate','recruiter'],default:'candidate'}, profile:{type:profileSchema,default:()=>({})}
},{timestamps:true});
export default mongoose.model('User',userSchema);
