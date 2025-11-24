import { registerAs } from '@nestjs/config'

export const REDIS_TOKEN = 'redis'

export default registerAs(REDIS_TOKEN, () => {
	return {
		host: process.env.REDIS_HOST || 'localhost',
		port: process.env.REDIS_PORT || 6379,
		password: process.env.REDIS_PASSWORD,
	}
})
