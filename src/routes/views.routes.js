import { Router } from 'express';
import ProductManager from '../manager/ProductManager.js';
import __dirname from '../utils.js';

const router = Router();

const jsonFilePath = './src/data/productos.json';
const productManager = new ProductManager(jsonFilePath);

router.get('/', async(req, res)=>{
    const productos = await productManager.getProducts();
    res.render('home',{
        title:'Estos son los productos',
        fileCss: 'style.css',
        productos: productos
    });
});

//Form
router.get('/realtimeproducts',async (req,res) => {
    const productos = await productManager.getProducts();
    res.render('realtimeProducts', {
        title:"Lista de productos en tiempo real",
        fileCss: 'style.css',
        productos: productos
    });
});

export default router;
