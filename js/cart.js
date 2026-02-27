import { CART_STORAGE_KEY } from "./constants.js";

const cartState = new Map();

function saveCartToStorage() {
    const items = Array.from(cartState.values());
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

function loadCartFromStorage() {
    const rawValue = localStorage.getItem(CART_STORAGE_KEY);

    if (!rawValue) return;

    try {
        const parsedItems = JSON.parse(rawValue);

        if (!Array.isArray(parsedItems)) return;

        cartState.clear();

        parsedItems.forEach(item => {
            if (!item || !item._id) return;

            cartState.set(String(item._id), {
                _id: String(item._id),
                title: item.title,
                image: item.image,
                price: Number(item.price) || 0,
                quantity: Math.max(1, Math.floor(Number(item.quantity) || 1))
            });
        });
    } catch {
        localStorage.removeItem(CART_STORAGE_KEY);
    }
}

function getProductKey(product) {
    return String(product._id ?? product.id);
}

function formatPrice(value) {
    return `$${Number(value).toFixed(2)}`;
}

function getElements() {
    return {
        contentProducts: document.getElementById('contentProducts'),
        total: document.getElementById('total'),
        cartCount: document.getElementById('cartCount'),
        emptyCart: document.getElementById('emptyCart')
    };
}

function updateSummary(totalElement, cartCountElement) {
    const items = Array.from(cartState.values());
    const totalPrice = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    if (totalElement) totalElement.textContent = formatPrice(totalPrice);
    if (cartCountElement) cartCountElement.textContent = String(totalItems);
}

function removeItem(productId, elements) {
    cartState.delete(String(productId));
    renderCart(elements);
}

function updateItemQuantity(productId, quantity, elements) {
    const key = String(productId);
    const item = cartState.get(key);

    if (!item) return;

    const newQuantity = Number(quantity);

    if (!Number.isFinite(newQuantity) || newQuantity <= 0) {
        cartState.delete(key);
    } else {
        item.quantity = Math.floor(newQuantity);
        cartState.set(key, item);
    }

    renderCart(elements);
}

function renderCart(elements = getElements()) {
    const { contentProducts, total, cartCount } = elements;

    if (!contentProducts) return;

    const rows = Array.from(cartState.values()).map(item => `
        <tr data-id="${item._id}">
            <td><img src="${item.image}" alt="${item.title}"></td>
            <td>${item.title}</td>
            <td>${formatPrice(item.price)}</td>
            <td>
                <input
                    type="number"
                    min="1"
                    class="cart-qty"
                    data-id="${item._id}"
                    value="${item.quantity}"
                >
            </td>
            <td>
                <button type="button" class="remove-item" data-id="${item._id}">X</button>
            </td>
        </tr>
    `).join('');

    contentProducts.innerHTML = rows;
    updateSummary(total, cartCount);
    saveCartToStorage();
}

function addProductToCart(product, elements = getElements()) {
    const key = getProductKey(product);
    const existing = cartState.get(key);

    if (existing) {
        existing.quantity += 1;
        cartState.set(key, existing);
    } else {
        cartState.set(key, {
            _id: key,
            title: product.title,
            image: product.image,
            price: Number(product.price) || 0,
            quantity: 1
        });
    }

    renderCart(elements);
}

export function initializeCart(products = []) {
    const elements = getElements();
    const productById = new Map(products.map(product => [String(product._id ?? product.id), product]));

    if (elements.contentProducts) {
        elements.contentProducts.innerHTML = '';
    }

    loadCartFromStorage();
    renderCart(elements);

    document.addEventListener('click', (event) => {
        const addButton = event.target.closest('button[data-id]');
        const removeButton = event.target.closest('.remove-item');

        if (addButton && !removeButton) {
            const id = String(addButton.dataset.id);
            const product = productById.get(id);

            if (product) {
                addProductToCart(product, elements);
            }
        }

        if (removeButton) {
            removeItem(removeButton.dataset.id, elements);
        }
    });

    if (elements.contentProducts) {
        elements.contentProducts.addEventListener('input', (event) => {
            const quantityInput = event.target.closest('.cart-qty');

            if (!quantityInput) return;

            updateItemQuantity(quantityInput.dataset.id, quantityInput.value, elements);
        });
    }

    if (elements.emptyCart) {
        elements.emptyCart.addEventListener('click', () => {
            cartState.clear();
            renderCart(elements);
        });
    }
}
