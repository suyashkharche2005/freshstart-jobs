import{useEffect,useState}from'react';
import{useParams,useNavigate,Link}from'react-router-dom';
import api from'../services/api';
import{useAuth}from'../context/AuthContext';
import{Loader,TextArea,Field}from'../components/UI';
import{MapPin,Building2,Clock,Bookmark,Sparkles,CheckCircle2,Target}from'lucide-react';

export default function JobDetails(){
  const{id}=useParams(),{user}=useAuth(),nav=useNavigate();
  const[job,setJob]=useState(),[form,setForm]=useState({resumeUrl:'',coverLetter:''});
  const[message,setMessage]=useState(''),[error,setError]=useState('');
  const[match,setMatch]=useState(null),[aiLoading,setAiLoading]=useState(false),[aiError,setAiError]=useState('');

  useEffect(()=>{api.get(`/jobs/${id}`).then(r=>setJob(r.data.job)).catch(e=>setError(e.message))},[id]);

  const apply=async e=>{e.preventDefault();if(!user)return nav('/login');try{const r=await api.post(`/applications/${id}`,form);setMessage(r.data.message);setError('')}catch(e){setError(e.message)}};
  const save=async()=>{if(!user)return nav('/login');try{const r=await api.post(`/jobs/${id}/save`);setMessage(r.data.message);setError('')}catch(e){setError(e.message)}};
  const analyzeMatch=async()=>{if(!user)return nav('/login');setAiLoading(true);setAiError('');try{const r=await api.post(`/jobs/${id}/ai-match`);setMatch(r.data.match)}catch(e){setAiError(e.message)}finally{setAiLoading(false)}};

  if(!job&&!error)return <Loader/>;
  if(error&&!job)return <main className="page container"><div className="alert error">{error}</div></main>;

  return <main className="page container detail-grid">
    <section className="detail">
      <Link to="/jobs">← Back to jobs</Link>
      <div className="company-mark large">{job.company[0]}</div>
      <h1>{job.title}</h1><p className="company-name">{job.company}</p>
      <div className="meta"><span><MapPin/>{job.location}</span><span><Building2/>{job.workMode}</span><span><Clock/>{job.experience}</span></div>
      <div className="chips">{job.skills?.map(x=><span key={x}>{x}</span>)}</div>
      {user?.role==='candidate'&&<section className="ai-match-card">
        <div className="ai-match-head"><div><span className="ai-label"><Sparkles/> AI POWERED</span><h2>How well do you match?</h2><p>Compare your FreshStart profile with this role.</p></div>{match&&<div className="ai-score"><strong>{match.score}%</strong><span>match</span></div>}</div>
        {!match&&<button className="btn ai-button" onClick={analyzeMatch} disabled={aiLoading}><Sparkles/>{aiLoading?'Analyzing profile...':'Analyze with AI'}</button>}
        {aiError&&<div className="alert error">{aiError}</div>}
        {match&&<div className="ai-results">
          <p className="ai-summary">{match.summary}</p>
          <div className="ai-columns">
            <div><h3><CheckCircle2/> Your strengths</h3><ul>{match.strengths.map(item=><li key={item}>{item}</li>)}</ul></div>
            <div><h3><Target/> Skills to improve</h3><ul>{match.missingSkills.length?match.missingSkills.map(item=><li key={item}>{item}</li>):<li>No major skill gaps identified.</li>}</ul></div>
          </div>
          <h3>Recommended next steps</h3><ul>{match.recommendations.map(item=><li key={item}>{item}</li>)}</ul>
          {!!match.interviewQuestions.length&&<><h3>Questions to practise</h3><ol>{match.interviewQuestions.map(item=><li key={item}>{item}</li>)}</ol></>}
          <small>AI suggestions can be inaccurate. Use them as guidance, not as a hiring decision.</small>
        </div>}
      </section>}
      <hr/><h2>About the role</h2><p className="description">{job.description}</p>
    </section>
    <aside className="apply-card"><h2>Interested in this role?</h2><p>{job.salary||'Salary discussed during the process'} · {job.type}</p>{message&&<div className="alert success">{message}</div>}{error&&<div className="alert error">{error}</div>}{user?.role==='candidate'?<form onSubmit={apply}><Field label="Resume URL" type="url" required placeholder="https://drive.google.com/..." value={form.resumeUrl} onChange={e=>setForm({...form,resumeUrl:e.target.value})}/><TextArea label="Short cover note" rows="5" value={form.coverLetter} onChange={e=>setForm({...form,coverLetter:e.target.value})}/><button className="btn full">Submit application</button><button type="button" className="btn secondary full" onClick={save}><Bookmark/> Save job</button></form>:!user?<Link className="btn full" to="/login">Log in to apply</Link>:<p>Recruiter accounts cannot apply to jobs.</p>}</aside>
  </main>;
}
