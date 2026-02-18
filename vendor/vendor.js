import { database, auth } from "../Config/config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const CLOUD_NAME = "dhqpjv2gw";
const UPLOAD_PRESET = "food-application";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const themeBtn = document.getElementById('theme-toggle');
const logoutBtn = document.getElementById('logout-btn');
const foodForm = document.getElementById('food-form');
const fileInput = document.getElementById('food-file');
const finalImgUrl = document.getElementById('final-img-url');
const prevImg = document.getElementById('prev-img');
const submitBtn = document.getElementById('submit-btn');

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "../Login/login.html";
    }
});

logoutBtn?.addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = "../index.html";
    }).catch((error) => {
        console.error("Logout error:", error);
    });
});

themeBtn?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

const updatePreview = () => {
    const nameInput = document.getElementById('food-name');
    const priceInput = document.getElementById('food-price');
    const descInput = document.getElementById('food-desc');
    const catInput = document.getElementById('food-cat');
    
    document.getElementById('prev-name').innerText = nameInput?.value || "Dish Name";
    document.getElementById('prev-price').innerText = priceInput?.value || "0.00";
    document.getElementById('prev-desc').innerText = descInput?.value || "Description...";
    document.getElementById('prev-cat').innerText = catInput?.value || "Category";
};

document.getElementById('food-name')?.addEventListener('input', updatePreview);
document.getElementById('food-price')?.addEventListener('input', updatePreview);
document.getElementById('food-desc')?.addEventListener('input', updatePreview);
document.getElementById('food-cat')?.addEventListener('change', updatePreview);

fileInput?.addEventListener('click', function(e) {
    e.stopPropagation();
});

fileInput?.addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (prevImg) {
        prevImg.src = URL.createObjectURL(file);
    }

    try {
        Swal.fire({
            title: 'Uploading...',
            didOpen: () => Swal.showLoading(),
            allowOutsideClick: false
        });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        const res = await fetch(CLOUDINARY_URL, {
            method: 'POST',
            body: formData
        });
        
        if (!res.ok) {
            throw new Error('Upload failed');
        }
        
        const data = await res.json();
        
        if (finalImgUrl) {
            finalImgUrl.value = data.secure_url;
        }
        
        Swal.close();
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Image uploaded successfully',
            timer: 1500,
            showConfirmButton: false
        });
    } catch (err) {
        Swal.close();
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Upload failed. Please try again.'
        });
    }
});

foodForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('food-name')?.value;
    const price = document.getElementById('food-price')?.value;
    const description = document.getElementById('food-desc')?.value;
    const category = document.getElementById('food-cat')?.value;
    const imageUrl = finalImgUrl?.value;
    
    if (!name || name.trim() === '') {
        return Swal.fire({
            icon: 'warning',
            title: 'Missing Information',
            text: 'Please enter a dish name'
        });
    }
    
    if (!price || price <= 0) {
        return Swal.fire({
            icon: 'warning',
            title: 'Invalid Price',
            text: 'Please enter a valid price greater than 0'
        });
    }
    
    if (!description || description.trim() === '') {
        return Swal.fire({
            icon: 'warning',
            title: 'Missing Information',
            text: 'Please enter a description'
        });
    }
    
    if (!category || category === '') {
        return Swal.fire({
            icon: 'warning',
            title: 'Missing Information',
            text: 'Please select a category'
        });
    }
    
    if (!imageUrl || imageUrl.trim() === '') {
        return Swal.fire({
            icon: 'warning',
            title: 'Image Required',
            text: 'Please upload an image first'
        });
    }
    
    if (!auth.currentUser) {
        return Swal.fire({
            icon: 'error',
            title: 'Not Authenticated',
            text: 'Please login again'
        });
    }
    
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
    }
    
    const dishData = {
        name: name.trim(),
        price: parseFloat(price),
        description: description.trim(),
        category: category,
        image: imageUrl,
        vendorEmail: auth.currentUser.email,
        vendorId: auth.currentUser.uid,
        status: "pending",
        createdAt: new Date().toISOString(),
        timestamp: new Date().getTime()
    };

    try {
        await addDoc(collection(database, "pending_food"), dishData);
        
        await Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Your dish has been submitted for approval!',
            timer: 1500,
            showConfirmButton: false
        });
        
        foodForm.reset();
        
        if (prevImg) {
            prevImg.src = "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop";
        }
        
        if (finalImgUrl) {
            finalImgUrl.value = "";
        }
        
        updatePreview();
        
        setTimeout(() => {
            window.location.href = "vendor-dashboard.html";
        }, 1500);
        
    } catch (err) {
        console.error("Submission error:", err);
        
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit for Verification';
        }
        
        Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            text: err.message || 'Something went wrong. Please try again.'
        });
    }
});

updatePreview();

const uploadContainer = document.querySelector('.upload-container');
if (uploadContainer) {
    uploadContainer.addEventListener('click', function() {
        fileInput?.click();
    });
}
