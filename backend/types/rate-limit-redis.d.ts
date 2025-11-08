declare module 'rate-limit-redis' {
  import { Store } from 'express-rate-limit';
  const RedisStore: any;
  export default RedisStore;
}
