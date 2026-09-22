import{Queue}from'bullmq';import IORedis from'ioredis';let queue;
const connection=()=>new IORedis(process.env.REDIS_URL,{maxRetriesPerRequest:null,enableReadyCheck:false});
export const enqueueNotification=async data=>{if(!process.env.REDIS_URL){console.warn('REDIS_URL missing: notification was not queued');return false}if(!queue)queue=new Queue('notifications',{connection:connection()});await queue.add('create-notification',data,{jobId:data.eventKey,attempts:3,backoff:{type:'exponential',delay:1000},removeOnComplete:100,removeOnFail:100});return true};
