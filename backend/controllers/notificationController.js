import Notification from'../models/Notification.js';
export const listNotifications=async(req,res)=>{const notifications=await Notification.find({recipient:req.user._id}).sort({createdAt:-1}).limit(30);const unread=await Notification.countDocuments({recipient:req.user._id,read:false});res.json({notifications,unread})};
export const markRead=async(req,res)=>{const notification=await Notification.findOneAndUpdate({_id:req.params.id,recipient:req.user._id},{read:true},{new:true});if(!notification)return res.status(404).json({message:'Notification not found'});res.json({notification})};
export const markAllRead=async(req,res)=>{await Notification.updateMany({recipient:req.user._id,read:false},{read:true});res.json({message:'All notifications marked as read'})};
