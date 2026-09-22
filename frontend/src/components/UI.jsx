import{LoaderCircle,BriefcaseBusiness}from'lucide-react';
export const Loader=()=> <div className="center"><LoaderCircle className="spin"/><span>Loading…</span></div>;
export const Empty=({title='Nothing here yet',text='Try changing your filters or come back later.'})=><div className="empty"><BriefcaseBusiness/><h3>{title}</h3><p>{text}</p></div>;
export const Status=({value})=><span className={`status ${value}`}>{value}</span>;
export const Field=({label,error,...p})=><label className="field"><span>{label}</span><input {...p}/>{error&&<small>{error}</small>}</label>;
export const TextArea=({label,...p})=><label className="field"><span>{label}</span><textarea {...p}/></label>;
