import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCoylt3gTjOmyDXUeAV6u0mXUVSjc7XbvQ",
    authDomain: "shipping-c7b07.firebaseapp.com",
    projectId: "shipping-c7b07",
    storageBucket: "shipping-c7b07.appspot.com",
    messagingSenderId: "102651132513",
    appId: "1:102651132513:web:22fae5c9ac02f61ce80820"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Check authentication state when page loads
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Redirect to login if not authenticated
        window.location.href = 'admin-login.html';
        return;
    }
    
    // Initialize admin functionality if authenticated
    initializeAdmin();
});

function initializeAdmin() {
    // Add event listener for the product form
    const form = document.getElementById('product-form');
    if (form) {
        form.addEventListener('submit', handleProductSubmit);
    }
    
    // Set up image preview
    setupImagePreview();
    
    // Load existing products
    loadProducts();
}

function setupImagePreview() {
    const imageInput = document.getElementById('product-image');
    const imagePreview = document.getElementById('image-preview');

    if (imageInput && imagePreview) {
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imagePreview.src = e.target.result;
                    imagePreview.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

async function handleProductSubmit(e) {
    e.preventDefault();
    const loadingIndicator = document.getElementById('loading-indicator');

    try {
        // Check if user is authenticated
        const user = auth.currentUser;
        if (!user) {
            throw new Error('You must be logged in to add products');
        }

        loadingIndicator?.classList.remove('hidden');
        
        const imageFile = document.getElementById('product-image').files[0];
        if (!imageFile) throw new Error('Please select an image');

        // Validate file size (optional, but recommended)
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        if (imageFile.size > MAX_FILE_SIZE) {
            throw new Error('Image file is too large (max 5MB)');
        }

        // Create a reference to the file in Firebase Storage
        const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        
        // Log for debugging
        console.log('Uploading file:', imageFile.name);
        
        // Upload the file
        const snapshot = await uploadBytes(storageRef, imageFile);
        console.log('File uploaded successfully');
        
        // Get the download URL
        const imageUrl = await getDownloadURL(snapshot.ref);
        console.log('Download URL obtained:', imageUrl);

        // Add product to Firestore
        const docRef = await addDoc(collection(db, "products"), {
            name: document.getElementById('product-name').value,
            price: parseFloat(document.getElementById('product-price').value),
            description: document.getElementById('product-description').value,
            category: document.getElementById('product-category').value,
            stock: parseInt(document.getElementById('product-stock').value),
            imageUrl,
            createdAt: new Date(),
            createdBy: user.uid // Optional: track who created the product
        });

        // Reset form and UI
        e.target.reset();
        document.getElementById('image-preview').classList.add('hidden');
        
        // Reload products list
        loadProducts();
        
        alert('Product added successfully!');
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Error adding product');
    } finally {
        loadingIndicator?.classList.add('hidden');
    }
}

async function loadProducts() {
    const productList = document.getElementById('product-list');
    if (!productList) return;

    productList.innerHTML = '';

    try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        querySnapshot.forEach((doc) => {
            const product = doc.data();
            const productElement = document.createElement('div');
            productElement.className = 'flex justify-between items-center p-4 border rounded';
            productElement.innerHTML = `
                <div class="flex items-center space-x-4">
                    <img src="${product.imageUrl}" alt="${product.name}" 
                         class="w-16 h-16 object-cover rounded">
                    <div>
                        <h3 class="font-semibold">${product.name}</h3>
                        <p class="text-gray-600">₵${product.price}</p>
                        <p class="text-sm text-gray-500">${product.category}</p>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button onclick="editProduct('${doc.id}')" 
                            class="text-blue-500 hover:text-blue-700">
                        Edit
                    </button>
                    <button onclick="deleteProduct('${doc.id}')" 
                            class="text-red-500 hover:text-red-700">
                        Delete
                    </button>
                </div>
            `;
            productList.appendChild(productElement);
        });
    } catch (error) {
        console.error('Error loading products:', error);
        productList.innerHTML = '<p class="text-red-500">Error loading products</p>';
    }
}

// Make functions available globally
window.deleteProduct = async (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            await deleteDoc(doc(db, 'products', productId));
            loadProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error deleting product. Please try again.');
        }
    }
};

window.editProduct = (productId) => {
    // Implement edit functionality
    alert('Edit functionality coming soon!');
};