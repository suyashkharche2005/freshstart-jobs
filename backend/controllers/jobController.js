import Job from '../models/Job.js';
import SavedJob from '../models/SavedJob.js';
import Application from '../models/Application.js';

export const listJobs=async(req,res)=>{const page=Math.max(Number(req.query.page)||1,1),limit=Math.min(Number(req.query.limit)||9,30);const query={status:'active'};if(req.query.search)query.$text={$search:req.query.search};if(req.query.location)query.location=new RegExp(req.query.location,'i');if(req.query.workMode)query.workMode=req.query.workMode;if(req.query.type)query.type=req.query.type;const sort=req.query.sort==='oldest'?{createdAt:1}:req.query.sort==='deadline'?{deadline:1}:{createdAt:-1};const[jobs,total]=await Promise.all([Job.find(query).populate('recruiter','name profile.company').sort(sort).skip((page-1)*limit).limit(limit),Job.countDocuments(query)]);res.json({jobs,pagination:{page,pages:Math.ceil(total/limit),total}})};
export const getJob=async(req,res)=>{const job=await Job.findById(req.params.id).populate('recruiter','name profile.company');if(!job)return res.status(404).json({message:'Job not found'});res.json({job})};
export const createJob=async(req,res)=>res.status(201).json({job:await Job.create({...req.body,recruiter:req.user._id}),message:'Job published'});
export const updateJob=async(req,res)=>{const job=await Job.findOneAndUpdate({_id:req.params.id,recruiter:req.user._id},req.body,{new:true,runValidators:true});if(!job)return res.status(404).json({message:'Job not found or not owned by you'});res.json({job,message:'Job updated'})};
export const deleteJob=async(req,res)=>{const job=await Job.findOneAndDelete({_id:req.params.id,recruiter:req.user._id});if(!job)return res.status(404).json({message:'Job not found or not owned by you'});await Promise.all([Application.deleteMany({job:job._id}),SavedJob.deleteMany({job:job._id})]);res.json({message:'Job deleted'})};
export const recruiterJobs=async(req,res)=>res.json({jobs:await Job.find({recruiter:req.user._id}).sort({createdAt:-1})});

export const recruiterStats=async(req,res)=>{
  const jobs=await Job.find({recruiter:req.user._id}).select('_id status');
  const jobIds=jobs.map(job=>job._id);
  const[totalApplicants,shortlisted,hired]=await Promise.all([
    Application.countDocuments({job:{$in:jobIds}}),
    Application.countDocuments({job:{$in:jobIds},status:'shortlisted'}),
    Application.countDocuments({job:{$in:jobIds},status:'hired'})
  ]);
  res.json({stats:{totalJobs:jobs.length,activeJobs:jobs.filter(job=>job.status==='active').length,totalApplicants,shortlisted,hired}});
};

export const toggleSave=async(req,res)=>{const found=await SavedJob.findOne({candidate:req.user._id,job:req.params.id});if(found){await found.deleteOne();return res.json({saved:false,message:'Removed from saved jobs'})}await SavedJob.create({candidate:req.user._id,job:req.params.id});res.status(201).json({saved:true,message:'Job saved'})};
export const savedJobs=async(req,res)=>{const rows=await SavedJob.find({candidate:req.user._id}).populate('job');res.json({jobs:rows.filter(row=>row.job).map(row=>row.job)})};
