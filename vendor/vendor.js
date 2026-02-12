import { database, auth } from "../Config/config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const CLOUD_NAME = "YOUR_CLOUD_NAME"; 
const UPLOAD_PRESET = "YOUR_PRESET"; 
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const themeBtn = document.getElementById('theme-toggle');
const logoutBtn = document.getElementById('logout-btn');
const foodForm = document.getElementById('food-form');
const fileInput = document.getElementById('food-file');
const finalImgUrl = document.getElementById('final-img-url');
const prevImg = document.getElementById('prev-img');

onAuthStateChanged(auth, (user) => {
    if (!user) window.location.href = "../Login/login.html";
});

logoutBtn?.addEventListener('click', () => {
    signOut(auth).then(() => window.location.href = "../index.html");
});

themeBtn?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = document.getElementById('theme-icon');
    if (icon) {
        icon.textContent = document.body.classList.contains('dark-mode') ? '🌙' : '☀️';
    }
});

const updatePreview = () => {
    document.getElementById('prev-name').innerText = document.getElementById('food-name').value || "Dish Name";
    document.getElementById('prev-price').innerText = document.getElementById('food-price').value || "0.00";
    document.getElementById('prev-desc').innerText = document.getElementById('food-desc').value || "Description...";
    document.getElementById('prev-cat').innerText = document.getElementById('food-cat').value;
};

['food-name', 'food-price', 'food-desc', 'food-cat'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', updatePreview);
});



fileInput?.addEventListener('change', async function() {
    const file = this.files[0];
    if (!file) return;

    prevImg.src = URL.createObjectURL(file);

    try {
        Swal.fire({ 
            title: 'Uploading...', 
            didOpen: () => Swal.showLoading() 
        });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        const res = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData });
        const data = await res.json();
        
        finalImgUrl.value = data.secure_url;
        Swal.fire("Success", "Image Ready!", "success");
    } catch (err) {
        Swal.fire("Error", "Upload failed", "error");
    }
});

foodForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!finalImgUrl.value) {
        return Swal.fire("Wait", "Upload an image first", "warning");
    }

    const dishData = {
        name: document.getElementById('food-name').value,
        price: document.getElementById('food-price').value,
        description: document.getElementById('food-desc').value,
        category: document.getElementById('food-cat').value,
        image: finalImgUrl.value,
        vendorEmail: auth.currentUser?.email || "Unknown",
        status: "pending",
        timestamp: new Date().toISOString()
    };

    try {
        await addDoc(collection(database, "pending_food"), dishData);
        Swal.fire("Success", "Dish submitted for approval!", "success");
        foodForm.reset();
        prevImg.src = "https://via.placeholder.com/400x300";
        finalImgUrl.value = "";
    } catch (err) {
        Swal.fire("Error", "Submission failed", "error");
    }
});