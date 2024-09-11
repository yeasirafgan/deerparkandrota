//mainfolder/app/api/auth/[kindeAuth]/route.js

import { handleAuth } from '@kinde-oss/kinde-auth-nextjs/server';
export const GET = handleAuth();
