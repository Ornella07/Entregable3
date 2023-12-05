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

//?Instancia de socket
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
  app.use('/public', express.static(path.join(__dirname, 'public')));


  //?Ruta principal
  app.use('/', viewRouter);
  
  //? Ruta a productos en tiempo real
  app.use('/realTimeProducts', viewRouter)
  
//   const productManager = new ProductManager('./src/data/productos.json');

// socketServer.on('connection', (socketClient) => {
//     console.log('Cliente conectado al websocket');

//     // Emit the initial list of products to the connected client
//     const products = productManager.getProducts();
//     socketClient.emit('product_update', products);

//     socketClient.on('product_send', (data) => {
//         console.log(data);
//         try {
//             const product = {
//                 title: data.title,
//                 description: data.description,
//                 code: data.code,
//                 price: data.price,
//                 stock: data.stock,
//                 category: data.category,
//                 body: data.body
//             };

//             productManager.addProduct(product);
//             // Emit the updated list of products to all connected clients
//             const updatedProducts = productManager.getProducts();
//             socketServer.emit('product_update', updatedProducts);
//         } catch (error) {
//             console.error(error)
//         }
//     });
// })


// export { socketServer }


  const productManager = new ProductManager('./src/data/productos.json'); 

    socketServer.on('connection', (socketClient)=> {
      console.log('Cliente conectado al websocket y funciona hasta');

      const product =  productManager.getProducts();
      socketClient.emit('product_update', product);//*Enviamos productos al cliente 
      socketClient.on('product_send', (data)=>{
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

          productManager.addProduct(product)
          socketClient.emit('product_update', [product])
        } catch (error) {
            console.error(error)
        }
      })
    })

    export {socketServer}