
import express from "express";
import morgan from "morgan";
import cookie from "cookie-parser";

// import config from "./configs/config.js";


//importar las rutas 
// import Auth from "./routes/authRouter.js";
// import User from "./routes/userRouter.js";
// import Rol from "./routes/rolRouter.js";



const app = express();

//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookie());

//utilizar rutas
// Auth(app);
// User(app);
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
