
import express from "express";
import morgan from "morgan";
import cookie from "cookie-parser";

// import config from "./configs/config.js";


//importar las rutas 
import Auth from "./src/router/authRouter.js";
import Business from "./src/router/businessRouter.js";
import User from "./src/router/userRouter.js";
// import Rol from "./routes/rolRouter.js";



const app = express();

//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookie());

//utilizar rutas
Auth(app);
Business(app);
User(app);
// Rol(app);

//middleware de errores
app.use((error, req, res, next) => {
  console.error(error.message);
 res.status(500).json({ message:  error.message || error });

});



//levantar el servidor


export default app;

// app.listen(config.port, () => {
//   console.log("Server is running on port " + config.port);
//   console.log("http://localhost:" + config.port + "/api/");
// });
