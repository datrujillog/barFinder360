
import express from "express";
import morgan from "morgan";
import cookie from "cookie-parser";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from "../documentation/swagger.js";



//importar las rutas 
import Auth from "./router/authRouter.js";
import Business from "./router/businessRouter.js";
import User from "./router/userRouter.js";
import Rol from "./router/roleRouter.js";
import Table from "./router/tableRouter.js";
import Order from "./router/orderRouter.js";
import Category from "./router/categoryRouter.js";
import Product from "./router/productRouter.js";



const app = express();

//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookie());

//# utilizar rutas
Auth(app);
Business(app);
User(app);
Rol(app);
Table(app);
Order(app);
Category(app);
Product(app);



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))



//middleware de errores
app.use((error, req, res, next) => {
  console.error(error.message);
 res.status(500).json({ message:  error.message || error });

});



export default app;
