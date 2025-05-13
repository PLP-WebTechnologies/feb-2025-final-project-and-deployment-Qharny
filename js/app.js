// // Sample product data
// const products = [
//     { id: 1, name: 'Crystal Beads', price: 9.99, image: './assets/IMG_8445.HEIC' },
//     { id: 2, name: 'Wooden Beads', price: 7.99, image: './assets/IMG_8448.HEIC' },
//     { id: 3, name: 'Glass Beads', price: 12.99, image: './assets/IMG_8450.HEIC' },
//     { id: 4, name: 'Pearl Beads', price: 15.99, image: './assets/IMG_8690.HEIC' },
//     { id: 5, name: 'Pearl Beads', price: 15.99, image: './assets/IMG_8693.HEIC' },
//     { id: 6, name: 'Pearl Beads', price: 15.99, image: './assets/IMG_8694.HEIC' },
//     { id: 7, name: 'Pearl Beads', price: 15.99, image: './assets/IMG_8696.HEIC' },
//     { id: 8, name: 'Pearl Beads', price: 15.99, image: './assets/IMG_8699.HEIC' },
//     { id: 9, name: 'Pearl Beads', price: 15.99, image: './assets/IMG_8714.HEIC' },
//     { id: 10, name: 'Pearl Beads', price: 15.99, image: './assets/IMG_8950.HEIC' },
//     { id: 11, name: 'Pearl Beads', price: 15.99, image: './assets/IMG_8955.HEIC' },

// ];

// let cart = [];

// // Fetch products from Firebase
// async function fetchProducts() {
//     const querySnapshot = await getDocs(collection(db, 'products'));
//     const products = [];
//     querySnapshot.forEach((doc) => {
//         products.push({
//             id: doc.id,
//             ...doc.data()
//         });
//     });
//     return products;
// }

// // Display products
// async function displayProducts() {
//     const productsGrid = document.getElementById('products-grid');
//     try {
//         const products = await fetchProducts();
//         productsGrid.innerHTML = products.map(product => `
//             <div class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
//                 <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded-md mb-4">
//                 <h3 class="text-lg font-semibold mb-2">${product.name}</h3>
//                 <div class="flex justify-between items-center">
//                     <span class="text-purple-600 font-bold">₵${product.price}</span>
//                     <button onclick="addToCart('${product.id}')" class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
//                         Add to Cart
//                     </button>
//                 </div>
//             </div>
//         `).join('');
//     } catch (error) {
//         console.error('Error fetching products:', error);
//         productsGrid.innerHTML = '<p class="text-red-500">Error loading products. Please try again later.</p>';
//     }
// }

// // Cart functions
// function addToCart(productId) {
//     const product = products.find(p => p.id === productId);
//     const existingItem = cart.find(item => item.id === productId);

//     if (existingItem) {
//         existingItem.quantity += 1;
//     } else {
//         cart.push({ ...product, quantity: 1 });
//     }

//     updateCartUI();
// }

// function updateCartUI() {
//     const cartCount = document.getElementById('cart-count');
//     const cartItems = document.getElementById('cart-items');
//     const cartTotal = document.getElementById('cart-total');

//     // Update cart count
//     const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
//     cartCount.textContent = totalItems;

//     // Update cart items
//     cartItems.innerHTML = cart.map(item => `
//         <div class="flex justify-between items-center">
//             <div>
//                 <h4 class="font-semibold">${item.name}</h4>
//                 <p class="text-gray-600">₵${item.price} x ${item.quantity}</p>
//             </div>
//             <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-700">Remove</button>
//         </div>
//     `).join('');

//     // Update total
//     const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//     cartTotal.textContent = `₵${total.toFixed(2)}`;
// }

// function removeFromCart(productId) {
//     cart = cart.filter(item => item.id !== productId);
//     updateCartUI();
// }

// // Modal handling
// document.getElementById('cart-btn').addEventListener('click', () => {
//     document.getElementById('cart-modal').classList.remove('hidden');
// });

// document.getElementById('close-cart').addEventListener('click', () => {
//     document.getElementById('cart-modal').classList.add('hidden');
// });

// // Initialize the page
// document.addEventListener('DOMContentLoaded', () => {
//     displayProducts();
// });

// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = mobileMenu.contains(event.target);
        const isClickOnMenuBtn = mobileMenuBtn.contains(event.target);

        if (!isClickInsideMenu && !isClickOnMenuBtn && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    });

    // Close mobile menu when window is resized to desktop size
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) { // 768px is Tailwind's md breakpoint
            mobileMenu.classList.add('hidden');
        }
    });
});

// Add this to your stylesheet or in a <style> tag in your HTML
const style = document.createElement('style');
style.textContent = `
    #mobile-menu {
        transition: all 0.3s ease-in-out;
    }
    
    #mobile-menu.hidden {
        display: none;
    }
`;
document.head.appendChild(style);

// Show admin link if user is authenticated as admin
function showAdminLink() {
    const adminLinks = document.querySelectorAll('.admin-link');
    // Add your admin authentication check here
    const isAdmin = true; // Replace with actual admin check
    
    adminLinks.forEach(link => {
        if (isAdmin) {
            link.classList.remove('hidden');
        } else {
            link.classList.add('hidden');
        }
    });
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', showAdminLink);