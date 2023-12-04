import express from "express";
import handlebars from "express-handlebars";
import viewRouter from './routes/views.routes.js'
import __dirname from "./utils.js";
import {Server} from 'socket.io'
import ProductManager from "./manager/ProductManager.js";
import * as path from 'path';


const app = express();
const PORT = 8000;
const httpServer = app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

const socketServer = new Server(httpServer);

//? Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//? Configuramos el engine
app.engine(
    "hbs",
    handlebars.engine({
      // index.hbs
      extname: "hbs",
      // Plantilla principal
      defaultLayout: "main",
    })
  );
  
  //? Seteamos nuestro motor
  app.set("view engine", "hbs");
  app.set("views", `${__dirname}/views`);

  //? Public
  app.use(express.static(path.join(__dirname, 'public')));
  // app.use(express.static(`${__dirname}/public`));
  

  //?Ruta principal
  app.use('/', viewRouter);

  //? Ruta a productos en tiempo real
  app.use('/realTimeProducts', viewRouter)

  
    const productManager = new ProductManager('./src/data/productos.json');
    productManager.init();

    //? realizamos la conexion cliente - websocket
    socketServer.on('connection', async(socket)=> {
      console.log('Cliente conectado al websocket');

      const products = await productManager.getProducts();
      socket.emit('product_update', products);//*Enviamos productos al cliente 
      socket.on('product_send', async(data)=>{
        console.log(data);
        //*Recibe la informacion del cliente
        try {
          const product = {
            title: data.title,
            description: data.description,
            code: data.code,
            price: data.price,
            stock: data.stock,
            category: data.category,
            body: data.body
          };

          await productManager.addProduct(product)
          socket.emit('product_update', [product])
        } catch (error) {
            console.error(error)
        }
      })
    })

    export {socketServer}