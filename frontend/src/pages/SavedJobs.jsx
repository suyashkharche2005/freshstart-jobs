import{useEffect,useState}from'react';
import api from'../services/api';
import JobCard from'../components/JobCard';
import{Empty,Loader}from'../components/UI';

export default function SavedJobs(){
  const[jobs,setJobs]=useState(null);
  const[error,setError]=useState('');
  const[message,setMessage]=useState('');

  useEffect(()=>{
    api.get('/jobs/saved').then(response=>setJobs(response.data.jobs)).catch(requestError=>setError(requestError.message));
  },[]);

  const removeSavedJob=async jobId=>{
    try{
      const response=await api.post(`/jobs/${jobId}/save`);
      setJobs(currentJobs=>currentJobs.filter(job=>job._id!==jobId));
      setMessage(response.data.message);
      setError('');
    }catch(requestError){setError(requestError.message)}
  };

  return <main className="page container">
    <div className="page-heading"><span className="eyebrow">YOUR SHORTLIST</span><h1>Saved jobs</h1><p>Keep promising roles together and apply when you are ready.</p></div>
    {message&&<div className="alert success">{message}</div>}
    {error&&<div className="alert error">{error}</div>}
    {!jobs?<Loader/>:jobs.length?<div className="saved-grid">{jobs.map(job=><div className="saved-item" key={job._id}><JobCard job={job}/><button className="remove-saved" onClick={()=>removeSavedJob(job._id)}>Remove from saved</button></div>)}</div>:<Empty title="No saved jobs yet" text="Save roles from the job search and they will appear here."/>}
  </main>;
}
