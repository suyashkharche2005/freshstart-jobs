const endpoint='https://openrouter.ai/api/v1/chat/completions';

const cleanList=(value,maxItems,maxLength)=>Array.isArray(value)
  ? value.filter(item=>typeof item==='string').map(item=>item.trim()).filter(Boolean).slice(0,maxItems).map(item=>item.slice(0,maxLength))
  : [];

export const normalizeMatchResult=value=>{
  const score=Math.max(0,Math.min(100,Math.round(Number(value?.score)||0)));
  const summary=typeof value?.summary==='string'?value.summary.trim().slice(0,500):'';
  if(!summary)throw Object.assign(new Error('AI returned an incomplete analysis'),{status:502});
  return{score,summary,strengths:cleanList(value.strengths,5,160),missingSkills:cleanList(value.missingSkills,5,120),recommendations:cleanList(value.recommendations,5,200),interviewQuestions:cleanList(value.interviewQuestions,4,220)};
};

const parseJson=content=>{
  const cleaned=String(content||'').replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'').trim();
  try{return JSON.parse(cleaned)}catch{throw Object.assign(new Error('AI returned an invalid response'),{status:502})}
};

export const analyzeJobMatch=async({profile,job})=>{
  if(!process.env.OPENROUTER_API_KEY)throw Object.assign(new Error('AI matching is not configured'),{status:503});
  const model=process.env.OPENROUTER_MODEL||'openai/gpt-4o-mini';
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),25000);
  let response;
  try{
    response=await fetch(endpoint,{
      method:'POST',signal:controller.signal,
      headers:{Authorization:`Bearer ${process.env.OPENROUTER_API_KEY}`,'Content-Type':'application/json','HTTP-Referer':process.env.CLIENT_URL?.split(',')[0]||'http://localhost:5173','X-Title':'FreshStart Jobs'},
      body:JSON.stringify({
        model,temperature:0.2,max_tokens:850,response_format:{type:'json_object'},
        messages:[
          {role:'system',content:'You are a careful career matching assistant. Compare only the supplied candidate profile and job. Do not infer age, gender, caste, religion, disability, ethnicity or other sensitive traits. Return valid JSON only with keys: score (0-100 integer), summary (2 short sentences), strengths (array), missingSkills (array), recommendations (array), interviewQuestions (array). Keep arrays concise and actionable.'},
          {role:'user',content:JSON.stringify({candidate:{headline:profile.headline||'',location:profile.location||'',bio:profile.bio||'',skills:profile.skills||[]},job:{title:job.title,company:job.company,location:job.location,workMode:job.workMode,type:job.type,experience:job.experience,description:job.description,skills:job.skills||[]}})}
        ]
      })
    });
  }catch(error){
    if(error.name==='AbortError')throw Object.assign(new Error('AI analysis timed out. Please try again.'),{status:504});
    throw Object.assign(new Error('Could not reach the AI service'),{status:502});
  }finally{clearTimeout(timeout)}
  const payload=await response.json().catch(()=>({}));
  if(!response.ok)throw Object.assign(new Error(payload?.error?.message||'AI service request failed'),{status:response.status===429?429:502});
  const result=normalizeMatchResult(parseJson(payload.choices?.[0]?.message?.content));
  return{...result,model:payload.model||model,usage:{promptTokens:payload.usage?.prompt_tokens||0,completionTokens:payload.usage?.completion_tokens||0,totalTokens:payload.usage?.total_tokens||0}};
};
