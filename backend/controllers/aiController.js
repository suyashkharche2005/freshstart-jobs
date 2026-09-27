import crypto from 'node:crypto';
import Job from '../models/Job.js';
import AiJobMatch from '../models/AiJobMatch.js';
import {analyzeJobMatch} from '../services/aiMatchService.js';

const fingerprintFor=(profile,job)=>crypto.createHash('sha256').update(JSON.stringify({
  profile:{headline:profile.headline||'',location:profile.location||'',bio:profile.bio||'',skills:profile.skills||[]},
  job:{title:job.title,location:job.location,workMode:job.workMode,type:job.type,experience:job.experience,description:job.description,skills:job.skills||[]}
})).digest('hex');

export const matchJob=async(req,res)=>{
  const job=await Job.findById(req.params.id);
  if(!job)return res.status(404).json({message:'Job not found'});
  const profile=req.user.profile||{};
  if(!profile.skills?.length&&!profile.headline&&!profile.bio)return res.status(400).json({message:'Add skills, a headline, or a bio to your profile before using AI Match'});
  const fingerprint=fingerprintFor(profile,job);
  const cached=await AiJobMatch.findOne({candidate:req.user._id,job:job._id,fingerprint});
  if(cached)return res.json({match:cached,cached:true});
  const analysis=await analyzeJobMatch({profile,job});
  const match=await AiJobMatch.findOneAndUpdate({candidate:req.user._id,job:job._id},{$set:{fingerprint,...analysis}},{new:true,upsert:true,runValidators:true});
  res.json({match,cached:false});
};
