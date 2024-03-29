
'use strict';

import 'dotenv/config'


 const config = {
    jwtSecret: process.env.JW_SECRET || 'secret',
    port: process.env.PORT || 3000,
 };

 export default config;
