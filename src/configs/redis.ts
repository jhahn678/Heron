import { createClient } from 'redis'

const redis = createClient();

redis.on('ready', () => console.log('🏓 Connected to redis'));

export default redis;
