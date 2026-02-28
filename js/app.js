import { listProducts } from "./functions.js";
import { initializeCart } from "./cart.js";

document.addEventListener('DOMContentLoaded', () => {
    listProducts()
        .then(products => initializeCart(products))
})

//footer
const year = new Date().getFullYear();

const container = document.getElementsByClassName('footer-page')[0];
container.textContent = year + ". All rights reserved";