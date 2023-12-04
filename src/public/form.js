const socket = io();

console.log('mensaje del lado del cliente');

const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const product = {
    title: formData.get("title"),
    description: formData.get("description"),
    code: formData.get("code"),
    price: parseFloat(formData.get("price")), // Convertir el valor a un número
    stock: parseInt(formData.get("stock")), // Convertir el valor a un número entero
    category: formData.get("category"),
    body: formData.get("body")
  };

  socket.emit("product_send", product);
  form.reset();
});

socket.on("product_update", (data) => {
  console.log(data);
  const forms = document.querySelector('#forms');
  forms.innerHTML = data
    .map((product) => {
      return `
      <p>
        Title: ${product.title} - 
        Body : ${product.body} -
        <button id="button-${product.id}">Eliminar</button>
      </p>
      `;
    })
    .join(''); // Agregar join para convertir el array de strings en un string único
});