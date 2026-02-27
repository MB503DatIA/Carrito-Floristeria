import { listProducts } from "./functions.js";
import { initializeCart } from "./cart.js";

document.addEventListener('DOMContentLoaded', () => {
    listProducts()
        .then(products => initializeCart(products))
})