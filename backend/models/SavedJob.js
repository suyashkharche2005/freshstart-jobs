import mongoose from 'mongoose';
const schema=new mongoose.Schema({candidate:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},job:{type:mongoose.Schema.Types.ObjectId,ref:'Job',required:true}},{timestamps:true});
schema.index({candidate:1,job:1},{unique:true});
export default mongoose.model('SavedJob',schema);
