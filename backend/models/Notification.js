import mongoose from'mongoose';
const schema=new mongoose.Schema({recipient:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},title:{type:String,required:true,trim:true},message:{type:String,required:true,trim:true},type:{type:String,enum:['application_status'],default:'application_status'},link:{type:String,default:'/dashboard'},read:{type:Boolean,default:false,index:true},eventKey:{type:String,required:true,unique:true}},{timestamps:true});
export default mongoose.model('Notification',schema);
