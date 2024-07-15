import { emailService } from './service';
import { Worker, type Job } from 'bullmq';
import { redis } from '../cache/adapter';

const sendEmailHandler = async (job: Job) => {
	const { to, html } = job.data;
	await emailService.sendEmail(to, html);
};

export const sendEmailWorker = new Worker('send-email', sendEmailHandler, {
	concurrency: 1,
	connection: redis
});
