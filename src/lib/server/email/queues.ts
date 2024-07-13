import { Queue } from 'bullmq';

export const sendEmailQueue = new Queue('send-email');
