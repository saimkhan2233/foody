import { auth, database } from "./Config/config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, collection, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let currentUserEmail = null;
let cartCount = 0;

onAuthStateChanged(auth, async (user) => {
    const roleActions = document.getElementById('role-actions');
    const logoutBtn = document.getElementById('logout-btn');
    const floatingCart = document.getElementById('floating-cart');
    
    if (user) {
        currentUserEmail = user.email;
        const userDoc = await getDoc(doc(database, "users", user.uid));
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            
            if (userData.role === "vendor" && roleActions) {
                roleActions.innerHTML = '<a href="vendor.html" class="publish-btn">Publish Product</a>';
            }

            if (userData.role === "customer" && floatingCart) {
                floatingCart.style.display = "flex";
            }
        }
        if (logoutBtn) logoutBtn.style.display = "block";
    }
    loadMarket();
});

async function loadMarket() {
    const container = document.getElementById('food-container');
    if (!container) return;
    container.innerHTML = "<p class='no-data-msg'>Loading delicious items...</p>";

    try {
        const querySnapshot = await getDocs(collection(database, "pending_food"));
        container.innerHTML = ""; 

        if (querySnapshot.empty) {
            container.innerHTML = "<p class='no-data-msg'>No items available right now.</p>";
            return;
        }

        querySnapshot.forEach((item) => {
            const data = item.data();
            if (data.status === "verified" || data.status === "pending") {
                const isOwner = (currentUserEmail === data.vendorEmail);
                const card = document.createElement('div');
                card.className = "food-card";

                const imgBox = document.createElement('div');
                imgBox.className = "img-box";

                const img = document.createElement('img');
                const cloudUrl = data.image; 

                if (cloudUrl && cloudUrl !== "undefined") {
                    img.src = cloudUrl;
                } else {
                    img.style.display = 'none';
                    imgBox.innerHTML = `<div style="height:100%; display:flex; align-items:center; justify-content:center; color:var(--text-dim); font-weight:bold;">${data.name}</div>`;
                }
                
                img.onerror = function() {
                    this.style.display = 'none';
                    imgBox.innerHTML = `<div style="height:100%; display:flex; align-items:center; justify-content:center; color:var(--text-dim); font-weight:bold;">Image Error</div>`;
                };

                const priceBadge = document.createElement('span');
                priceBadge.className = "price-badge";
                priceBadge.textContent = `$${data.price || '0'}`;
                
                imgBox.appendChild(img);
                imgBox.appendChild(priceBadge);

                const content = document.createElement('div');
                content.className = "card-content";
                content.innerHTML = `
                    <span class="vendor-info">${data.category || 'Food'}</span>
                    <h3 style="margin:8px 0;">${data.name}</h3>
                    <p class="food-desc-text">${data.description || 'No description provided.'}</p>
                `;

                const btnGroup = document.createElement('div');
                btnGroup.style.cssText = "display:flex; flex-direction:column; gap:8px;";

                if (isOwner) {
                    const editBtn = document.createElement('button');
                    editBtn.className = "publish-btn";
                    editBtn.style.background = "#007bff";
                    editBtn.textContent = "Edit Dish";
                    editBtn.onclick = () => window.location.href = `vendor.html?edit=${item.id}`;

                    const delBtn = document.createElement('button');
                    delBtn.className = "publish-btn";
                    delBtn.style.background = "#dc3545";
                    delBtn.textContent = "Delete Dish";
                    delBtn.onclick = () => deleteDish(item.id, data.name);
                    btnGroup.append(editBtn, delBtn);
                } else {
                    const addBtn = document.createElement('button');
                    addBtn.className = "publish-btn";
                    addBtn.textContent = "Add to Cart";
                    
                    addBtn.onclick = () => {
                        const countSpan = document.getElementById('cart-count');
                        if (countSpan) {
                            cartCount++;
                            countSpan.innerText = `(${cartCount})`;
                            Swal.fire({
                                title: 'Added!',
                                text: `${data.name} is in your cart`,
                                icon: 'success',
                                toast: true,
                                position: 'top-end',
                                showConfirmButton: false,
                                timer: 2000
                            });
                        }
                    };
                    btnGroup.append(addBtn);
                }

                card.append(imgBox, content, btnGroup);
                container.appendChild(card);
            }
        });
    } catch (err) {
        console.error("Market error:", err);
    }
}

async function deleteDish(id, name) {
    if (confirm(`Delete ${name}?`)) {
        try {
            await deleteDoc(doc(database, "pending_food", id));
            location.reload();
        } catch (e) { alert("Delete failed"); }
    }
}

document.getElementById('theme-toggle')?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = document.getElementById('theme-icon');
    icon.innerText = document.body.classList.contains('dark-mode') ? "🌙" : "☀️";
});

document.getElementById('logout-btn')?.addEventListener('click', () => {
    signOut(auth).then(() => location.href = "index.html");
});