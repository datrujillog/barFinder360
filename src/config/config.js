
'use strict';

import 'dotenv/config'


 const config = {
    jwtSecret: process.env.JW_SECRET || 'secret',
    port: process.env.PORT || 5000,
    urlMongodb : process.env.DATABASE_URL || 'mongodb://mongodb:27017'
 };

 export default config;
