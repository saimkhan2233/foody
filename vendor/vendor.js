const prevImg = document.getElementById('prev-img');

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "../Login/login.html";
    }
    if (!user) window.location.href = "../Login/login.html";
});

logoutBtn?.addEventListener('click', () => {
    signOut(auth).then(() => window.location.href = "../index.html");
});

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            window.location.href = "../index.html";
        }).catch((err) => {
            console.error(err);
        });
    });
}

themeBtn.addEventListener('click', () => {
themeBtn?.addEventListener('click', () => {
document.body.classList.toggle('dark-mode');
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.textContent = document.body.classList.contains('dark-mode') ? '🌙' : '☀️';
    }
    const icon = document.getElementById('theme-icon');
    if (icon) icon.textContent = document.body.classList.contains('dark-mode') ? '🌙' : '☀️';
});

const updatePreview = () => {
@@ -45,32 +35,24 @@ const updatePreview = () => {
};

['food-name', 'food-price', 'food-desc', 'food-cat'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updatePreview);
    document.getElementById(id)?.addEventListener('input', updatePreview);
});

fileInput.addEventListener('change', async function() {
fileInput?.addEventListener('change', async function() {
const file = this.files[0];
if (!file) return;

prevImg.src = URL.createObjectURL(file);

try {
        Swal.fire({ 
            title: 'Uploading...', 
            allowOutsideClick: false, 
            didOpen: () => Swal.showLoading() 
        });
        Swal.fire({ title: 'Uploading...', didOpen: () => Swal.showLoading() });

const formData = new FormData();
formData.append('file', file);
formData.append('upload_preset', UPLOAD_PRESET);

        const response = await fetch(CLOUDINARY_URL, { 
            method: 'POST', 
            body: formData 
        });
        const data = await response.json();
        const res = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData });
        const data = await res.json();

finalImgUrl.value = data.secure_url;
Swal.fire("Success", "Image Ready!", "success");
@@ -79,8 +61,11 @@ fileInput.addEventListener('change', async function() {
}
});

foodForm.addEventListener('submit', async (e) => {


foodForm?.addEventListener('submit', async (e) => {
e.preventDefault();
    
if (!finalImgUrl.value) return Swal.fire("Wait", "Upload an image first", "warning");

const dishData = {
