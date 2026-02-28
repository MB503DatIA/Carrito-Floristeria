var htmlCheckout = "<table>\
<thead><tr><th>Item</th><th>Precio Unitario</th><th>Cantidad</th><th>Monto total</th></tr></thead>\
<tbody>";

var carritoActual = JSON.parse(localStorage.getItem("shopping_cart_items"));
var totalCarrito = 0;
var totalItems = 0;

carritoActual.forEach(item => {
    htmlCheckout += "<tr><td>"+item.title+"</td><td>$"+item.price+"</td><td>"+item.quantity+"</td><td>$"+(item.quantity*item.price)+"</td></tr>"
    totalItems += item.quantity;
    totalCarrito += item.quantity*item.price;
});

htmlCheckout += "<tr><td><strong>Total: </strong></td><td></td><td><strong>"+totalItems+"</strong></td><td><strong>$"+totalCarrito.toFixed(2)+"</strong></td></tr> \
</tbody></table>";

document.querySelector("#checkout-container").innerHTML = htmlCheckout;