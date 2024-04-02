import app from "../../app.js";
import config from "../config/config.js"
// import db from "../database/db.js";


const startServer = async () => {
    
    app.listen(config.port, () => {
        console.log("")
        console.log(`Server is running on port ${config.port} `);
        console.log("")
        console.log(`http://localhost:${config.port} En el microservicio de autenticación   LOCAL`);
    });
}

startServer();