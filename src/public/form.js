// const socketClient = io();
// console.log('Mensaje del lado del cliente');

// const form = document.querySelector("#form");

// form.addEventListener("submit", (e) => {
//   e.preventDefault();

//   const formData = new FormData(form);
//   const producto = {    
//     title: formData.get("title"),
//     description: formData.get("description"),
//     code: formData.get("code"),
//     price: parseFloat(formData.get("price")),
//     stock: parseInt(formData.get("stock")),
//     category: formData.get("category"),
//     body: formData.get("body")
//   };

//   socketClient.emit("product_send", producto);
//   form.reset();
// });

// const forms = document.querySelector("#forms");
// socketClient.on("product_send", (data) => {
//   console.log(data);

//   data.forEach((producto) => {
//     const li = document.createElement('li');
//     li.innerHTML = `
//       <p>
//         Title: ${producto.title} -
//         Body: ${producto.body} -
//         <button id="button-${producto.id}">Eliminar</button>
//       </p>
//     `;
//     forms.appendChild(li);
//   });

  
// });
const socketClient = io();
console.log('Mensaje del lado del cliente');

const form = document.querySelector("#form");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const producto = {
        title: formData.get("title"),
        description: formData.get("description"),
        code: formData.get("code"),
        price: parseFloat(formData.get("price")),
        stock: parseInt(formData.get("stock")),
        category: formData.get("category"),
        body: formData.get("body")
    };

    socketClient.emit("product_send", producto);
    form.reset();
});

const forms = document.querySelector("#forms");
socketClient.on("product_update", (data) => {
    console.log(data);

    
   if (Array.isArray(data)) {
    
    data.forEach((producto) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <p>
            Titulo: ${producto.title}  <br>
            Descripcion:${producto.description}  <br>
            Codigo:${producto.code}  <br>
            Precio:${producto.price} <br>
            Stock: ${producto.stock} <br>
            <button class="button" id="button-${producto.id}">Eliminar</button>
          </p>
        `;
        forms.appendChild(li);
    });
}
});