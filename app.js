
import express from "express";
import morgan from "morgan";
import cookie from "cookie-parser";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerDocument from "./documentation/swagger.js";



//importar las rutas 
import Auth from "./src/router/authRouter.js";
import Business from "./src/router/businessRouter.js";
import User from "./src/router/userRouter.js";
import Rol from "./src/router/roleRouter.js";
import Table from "./src/router/tableRouter.js";
import Order from "./src/router/orderRouter.js";
import Category from "./src/router/categoryRouter.js";
import Product from "./src/router/productRouter.js";



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
