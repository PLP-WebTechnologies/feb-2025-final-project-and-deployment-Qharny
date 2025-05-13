// Import Firebase modules
import { db } from './firebase-config.js';
import { collection, getDocs, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Cart functionality
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCartBtn = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const productDetailsModal = document.getElementById('product-details-modal');
const closeProductDetailsBtn = document.getElementById('close-product-details');
let currentProductId = null;

// Show/Hide cart modal
cartBtn?.addEventListener('click', () => {
    cartModal.classList.remove('hidden');
    updateCartDisplay();
});

closeCartBtn?.addEventListener('click', () => {
    cartModal.classList.add('hidden');
});

// Close cart when clicking outside
cartModal?.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.classList.add('hidden');
    }
});

// Product details functionality
const showProductDetails = async (productId) => {
    try {
        const productDoc = await getDoc(doc(db, "products", productId));
        if (!productDoc.exists()) {
            throw new Error('Product not found');
        }

        const product = {
            id: productId,
            ...productDoc.data()
        };

        // Store current product ID for add to cart functionality
        currentProductId = productId;

        // Update modal content
        document.getElementById('modal-product-image').src = product.imageUrl;
        document.getElementById('modal-product-image').alt = product.name;
        document.getElementById('modal-product-name').textContent = product.name;
        document.getElementById('modal-product-price').textContent = `₵${product.price}`;
        document.getElementById('modal-product-description').textContent = product.description;
        document.getElementById('modal-product-category').textContent = `Category: ${product.category || 'General'}`;

        // Show modal
        productDetailsModal.classList.remove('hidden');
        
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
    } catch (error) {
        console.error('Error showing product details:', error);
        alert('Error loading product details');
    }
};

// Close product details modal
const closeProductDetails = () => {
    productDetailsModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    currentProductId = null;
};

// Event listeners for product details modal
closeProductDetailsBtn?.addEventListener('click', closeProductDetails);
productDetailsModal?.addEventListener('click', (e) => {
    if (e.target === productDetailsModal) {
        closeProductDetails();
    }
});

// Modal add to cart button
document.getElementById('modal-add-to-cart')?.addEventListener('click', () => {
    if (currentProductId) {
        addToCart(currentProductId);
    }
});

// Fetch and display products
const fetchProducts = async () => {
    const productsGrid = document.getElementById('products-grid');
    const loadingState = document.getElementById('loading-state');

    try {
        loadingState.classList.remove('hidden');
        const querySnapshot = await getDocs(collection(db, "products"));

        productsGrid.innerHTML = ''; // Clear existing products

        querySnapshot.forEach((doc) => {
            const product = doc.data();
            const productCard = `
                <div class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                     onclick="showProductDetails('${doc.id}')">
                    <div class="relative">
                        <img src="${product.imageUrl}" 
                             alt="${product.name}" 
                             class="w-full h-48 object-cover transition duration-300">
                    </div>
                    <div class="p-4">
                        <h3 class="text-lg font-semibold">${product.name}</h3>
                        <p class="text-gray-600 line-clamp-2">${product.description}</p>
                        <div class="mt-4 flex justify-between items-center">
                            <span class="text-purple-600 font-bold">₵${product.price}</span>
                            <button onclick="event.stopPropagation(); addToCart('${doc.id}')" 
                                    class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `;
            productsGrid.innerHTML += productCard;
        });
    } catch (error) {
        console.error("Error fetching products: ", error);
    } finally {
        loadingState.classList.add('hidden');
    }
};

// Add to cart function
const addToCart = async (productId) => {
    try {
        const productDoc = await getDoc(doc(db, "products", productId));
        if (!productDoc.exists()) {
            throw new Error('Product not found');
        }

        const product = {
            id: productId,
            ...productDoc.data()
        };

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProductIndex = cart.findIndex(item => item.id === productId);

        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();

        // Show success message
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-500';
        toast.textContent = 'Added to cart!';
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 2000);
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Error adding product to cart');
    }
};

// Update cart display
const updateCartDisplay = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (cartItems) {
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            cartItems.innerHTML += `
                <div class="flex justify-between items-center border-b pb-2">
                    <div class="flex items-center space-x-4">
                        <img src="${item.imageUrl}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
                        <div>
                            <h4 class="font-semibold">${item.name}</h4>
                            <p class="text-gray-600">₵${item.price} × ${item.quantity}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})" 
                                class="text-gray-500 hover:text-gray-700">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})" 
                                class="text-gray-500 hover:text-gray-700">+</button>
                        <button onclick="removeFromCart('${item.id}')" 
                                class="text-red-500 hover:text-red-700 ml-4">×</button>
                    </div>
                </div>
            `;
        });

        if (cartTotal) {
            cartTotal.textContent = `₵${total.toFixed(2)}`;
        }
    }
};

// Update cart count
const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
};

// Update quantity
window.updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === productId);

    if (itemIndex !== -1) {
        cart[itemIndex].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        updateCartCount();
    }
};

// Remove from cart
window.removeFromCart = (productId) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartCount();
};

// Checkout functionality
window.proceedToCheckout = function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if cart is empty
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Format cart content for WhatsApp
    const message = formatCartForWhatsApp(cart);
    
    // WhatsApp business number
    const phoneNumber = '+233544825225';

    // Create WhatsApp link
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;

    // Open WhatsApp in new tab
    window.open(whatsappURL, '_blank');

    // Close cart modal
    cartModal.classList.add('hidden');

    // clear cart after checkout
    localStorage.removeItem('cart');


};

// Format cart for WhatsApp message
function formatCartForWhatsApp(cart) {
    let message = "🛒 *New Order from Beadsbykorngo*\n\n";

    // Add cart items
    message += "*Order Details:*\n";
    cart.forEach(item => {
        message += `▪ ${item.name} (${item.quantity}x) - ₵${(item.price * item.quantity).toFixed(2)}\n`;
    });

    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\n*Total: ₵${total.toFixed(2)}*`;

    // Add note
    message += "\n\nPlease confirm my order. Thank you!";

    return encodeURIComponent(message);
}

// Filter and search functionality
const setupFilters = () => {
    const searchInput = document.getElementById('search-input');
    const categorySelect = document.getElementById('category-select');
    const sortSelect = document.getElementById('sort-select');

    const applyFilters = async () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categorySelect.value;
        const sortOption = sortSelect.value;

        try {
            const querySnapshot = await getDocs(collection(db, "products"));
            let filteredProducts = [];

            querySnapshot.forEach((doc) => {
                const product = { id: doc.id, ...doc.data() };
                const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                                    product.description.toLowerCase().includes(searchTerm);
                const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

                if (matchesSearch && matchesCategory) {
                    filteredProducts.push(product);
                }
            });

            // Apply sorting
            switch (sortOption) {
                case 'price-asc':
                    filteredProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    filteredProducts.sort((a, b) => b.price - a.price);
                    break;
                case 'newest':
                    filteredProducts.sort((a, b) => b.createdAt - a.createdAt);
                    break;
            }

            // Update products display
            const productsGrid = document.getElementById('products-grid');
            const noResults = document.getElementById('no-results');

            if (filteredProducts.length === 0) {
                productsGrid.innerHTML = '';
                noResults.classList.remove('hidden');
            } else {
                noResults.classList.add('hidden');
                productsGrid.innerHTML = filteredProducts.map(product => `
                    <div class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                         onclick="showProductDetails('${product.id}')">
                        <div class="relative">
                            <img src="${product.imageUrl}" 
                                 alt="${product.name}" 
                                 class="w-full h-48 object-cover transition duration-300">
                        </div>
                        <div class="p-4">
                            <h3 class="text-lg font-semibold">${product.name}</h3>
                            <p class="text-gray-600 line-clamp-2">${product.description}</p>
                            <div class="mt-4 flex justify-between items-center">
                                <span class="text-purple-600 font-bold">₵${product.price}</span>
                                <button onclick="event.stopPropagation(); addToCart('${product.id}')" 
                                        class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error("Error applying filters:", error);
        }
    };

    // Add event listeners for filters
    searchInput?.addEventListener('input', applyFilters);
    categorySelect?.addEventListener('change', applyFilters);
    sortSelect?.addEventListener('change', applyFilters);
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCartCount();
    setupFilters();

    // Make functions available globally
    window.addToCart = addToCart;
    window.showProductDetails = showProductDetails;
    
    // Set up checkout button handler
    const checkoutButton = document.querySelector('#cart-modal button.w-full.mt-4');
    if (checkoutButton) {
        checkoutButton.onclick = proceedToCheckout;
    }
});

// Add keyboard support for closing modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (!productDetailsModal.classList.contains('hidden')) {
            closeProductDetails();
        }
        if (!cartModal.classList.contains('hidden')) {
            cartModal.classList.add('hidden');
        }
    }
});