// import { db } from './firebase-config.js';
// import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// const addProduct = async (product) => {
//   try {
//     const docRef = await addDoc(collection(db, "products"), {
//       ...product,
//       createdAt: new Date()
//     });
//     console.log("Product added with ID: ", docRef.id);
//   } catch (e) {
//     console.error("Error adding product: ", e);
//   }
// };

// // Example usage:
// const product = {
//   name: "Crystal Bracelet",
//   price: 29.99,
//   description: "Beautiful crystal bracelet",
//   category: "Crystal Beads",
//   imageUrl: "https://example.com/crystal-bracelet.jpg",
//   stock: 10
// };

// addProduct(product); 