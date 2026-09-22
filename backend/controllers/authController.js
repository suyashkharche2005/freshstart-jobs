import bcrypt from 'bcryptjs'; import User from '../models/User.js'; import {signToken} from '../utils/token.js';
const safe=u=>({id:u._id,name:u.name,email:u.email,role:u.role,profile:u.profile});
export const register=async(req,res)=>{const {name,email,password,role}=req.body;if(await User.findOne({email}))return res.status(409).json({message:'An account with this email already exists'});const user=await User.create({name,email,password:await bcrypt.hash(password,12),role});res.status(201).json({token:signToken(user),user:safe(user)});};
export const login=async(req,res)=>{const user=await User.findOne({email:req.body.email}).select('+password');if(!user||!await bcrypt.compare(req.body.password,user.password))return res.status(401).json({message:'Incorrect email or password'});res.json({token:signToken(user),user:safe(user)});};
export const me=async(req,res)=>res.json({user:safe(req.user)});
