import { auth, database } from "./Config/config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, collection, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let currentUserEmail = null;
let cartCount = 0;

// THEME TOGGLE LOGIC ONLY
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            if (themeIcon) {
                themeIcon.textContent = body.classList.contains('dark-mode') ? '☀️' : '🌙';
            }
        });
    }
});

onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUserEmail = user.email;
        const userDoc = await getDoc(doc(database, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const ra = document.getElementById('role-actions');
            if (userData.role === "vendor" && ra) {
                ra.innerHTML = '<a href="vendor.html" class="publish-btn">Publish Product</a>';
            }
            const fc = document.getElementById('floating-cart');
            if (userData.role === "customer" && fc) fc.style.display = "flex";
        }
        const lb = document.getElementById('logout-btn');
        if (lb) lb.style.display = "block";
    }
    loadMarket();
});

async function loadMarket() {
    const container = document.getElementById('food-container');
    if (!container) return;

    try {
        const querySnapshot = await getDocs(collection(database, "pending_food"));
        container.innerHTML = ""; 

        querySnapshot.forEach((item) => {
            const data = item.data();
            const isOwner = (currentUserEmail === data.vendorEmail);
            const card = document.createElement('div');
            card.className = "food-card";

            const imgBox = document.createElement('div');
            imgBox.className = "img-box";
            imgBox.style.height = "220px";
            imgBox.style.width = "100%";
            imgBox.style.overflow = "hidden";
            imgBox.style.position = "relative";

            const img = document.createElement('img');
            img.src = data.image;
            img.alt = data.name;
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "cover";
            img.style.display = "block";

            const priceBadge = document.createElement('span');
            priceBadge.className = "price-badge";
            priceBadge.textContent = `$${data.price || '0'}`;
            
            imgBox.append(img, priceBadge);

            const content = document.createElement('div');
            content.className = "card-content";
            content.innerHTML = `
                <span class="vendor-info" style="color: #d32f2f; font-weight: bold; text-transform: uppercase; font-size: 12px;">${data.category || 'Fast Food'}</span>
                <h3 style="margin: 10px 0 5px 0; font-size: 20px;">${data.name}</h3>
                <p style="color: #666; font-size: 14px; margin-bottom: 15px;">${data.description || ''}</p>
            `;

            const btnGroup = document.createElement('div');
            btnGroup.className = "btn-group-column";
            btnGroup.style.display = "flex";
            btnGroup.style.flexDirection = "column";
            btnGroup.style.gap = "10px";

            if (isOwner) {
                btnGroup.innerHTML = `
                    <button class="publish-btn" style="background:#007bff; border:none; cursor:pointer;" onclick="location.href='vendor.html?edit=${item.id}'">Edit Dish</button>
                    <button class="publish-btn" style="background:#dc3545; border:none; cursor:pointer;" onclick="deleteDish('${item.id}', '${data.name}')">Delete Dish</button>
                `;
            } else {
                const addBtn = document.createElement('button');
                addBtn.className = "publish-btn";
                addBtn.style.width = "100%";
                addBtn.textContent = "Add to Cart";
                addBtn.onclick = () => {
                    cartCount++;
                    const cs = document.getElementById('cart-count');
                    if (cs) cs.innerText = `(${cartCount})`;
                };
                btnGroup.append(addBtn);
            }

            card.append(imgBox, content, btnGroup);
            container.appendChild(card);
        });
    } catch (err) { console.error("Error loading items:", err); }
}

async function deleteDish(id, name) {
    if (confirm(`Delete ${name}?`)) {
        await deleteDoc(doc(database, "pending_food", id));
        location.reload();
    }
}

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            window.location.href = "index.html";
        });
    });
}