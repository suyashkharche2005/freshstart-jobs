import mongoose from 'mongoose';

const aiJobMatchSchema = new mongoose.Schema({
  candidate:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},
  job:{type:mongoose.Schema.Types.ObjectId,ref:'Job',required:true,index:true},
  fingerprint:{type:String,required:true},
  score:{type:Number,required:true,min:0,max:100},
  summary:{type:String,required:true,trim:true,maxlength:500},
  strengths:[{type:String,trim:true,maxlength:160}],
  missingSkills:[{type:String,trim:true,maxlength:120}],
  recommendations:[{type:String,trim:true,maxlength:200}],
  interviewQuestions:[{type:String,trim:true,maxlength:220}],
  model:{type:String,required:true,trim:true},
  usage:{promptTokens:Number,completionTokens:Number,totalTokens:Number}
},{timestamps:true});

aiJobMatchSchema.index({candidate:1,job:1},{unique:true});

export default mongoose.model('AiJobMatch',aiJobMatchSchema);
