import { API_URI } from "./constants.js";

export function getAllProducts() {
    return fetch(`${API_URI}/products`)
        .then(response => response.json())
        .catch(error => console.error('Error fetching products:', error));
}

export async function listProducts() {
    const container = document.getElementById('products-container')

    if (!container) return

    container.innerHTML = `
        <div class="w-100 d-flex justify-content-center align-items-center py-5">
            <div class="spinner-border spinner-border-lg text-info" role="status" aria-label="Cargando productos" style="width: 5rem; height: 5rem; border-width: 0.5em;">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `

    const products = await getAllProducts()

    if (!products || !products.data) {
        container.innerHTML = '<p class="text-center w-100">No se pudieron cargar los productos.</p>'
        return []
    }

    container.innerHTML = products.data.map(product => `
        <div class="product position-relative card col-12 col-sm-5 col-md-5 col-lg-4 p-0">
            <div class="position-relative">
                <img src="${product.image}" alt="${product.title}" class="card-img-top z-2">
                <span class="bg-info text-light py-2 px-4 position-absolute z-3 product-discount"> -${Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%</span>
            </div>    
            <div class="card-body product-info">
                <h4 class="product-title">${product.title}</h4>
                <p class="product-text">${product.description}</p>
                
                <div class="product-rating">
                    ${Array(Math.round(product.rating)).fill('<i class="fa-solid fa-star icon-star"></i>').join('')}
                </div>

                <div class="price">
                    <span class="old-price">$${product.oldPrice}</span>
                    <p class="current-price">$${product.price}</p>
                </div>
                <button class="btn btn-info text-white" type="button" data-id="${product._id ?? product.id}">
                    <i class="fa-solid fa-cart-plus"></i> Add Cart
                </button>
            </div>
        </div>
    `).join('')

    return products.data
}