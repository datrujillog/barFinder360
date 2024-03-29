
'use strict';

import 'dotenv/config'


 const config = {
    jwtSecret: process.env.JW_SECRET || 'secret',
    port: process.env.PORT || 5000,
    urlMongodb : process.env.DATABASE_URL
 };

 export default config;
