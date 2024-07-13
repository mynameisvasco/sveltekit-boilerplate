import { Worker, type Job } from 'bullmq';
import { redis } from '../cache/adapter';

export const sendEmailWorker = new Worker(
	'send-email',
	async (job: Job) => {
		const { to, text, html } = job.data;
		console.log({ to, text, html });
	},
	{ concurrency: 1, connection: redis }
);
