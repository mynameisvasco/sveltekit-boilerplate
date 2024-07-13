import { SECRET_REDIS_URL } from '$env/static/private';
import IORedis from 'ioredis';

export const redis = new IORedis(SECRET_REDIS_URL, {
	maxRetriesPerRequest: null,
	connectTimeout: 15_000
});
