import { auth, database } from "./Config/config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let userRole = null;
let currentUserEmail = null;

onAuthStateChanged(auth, async (user) => {
    const roleActions = document.getElementById('role-actions');
    const logoutBtn = document.getElementById('logout-btn');
    const cartPill = document.getElementById('floating-cart');
    
    if (user) {
        currentUserEmail = user.email;
        try {
            const userDoc = await getDoc(doc(database, "users", user.uid));
            userRole = userDoc.data()?.role;

            if (cartPill) cartPill.style.display = (userRole === "customer") ? "flex" : "none";

            if (userRole === "vendor" && roleActions) {
                const pubLink = document.createElement('a');
                pubLink.href = "vendor.html";
                pubLink.className = "publish-btn";
                pubLink.textContent = "Publish Product";
                roleActions.innerHTML = "";
                roleActions.appendChild(pubLink);
            }
        } catch (e) { console.error(e); }
    }
    loadMarket();
});

async function loadMarket() {
    const container = document.getElementById('food-container');
    if (!container) return;
    container.innerHTML = "";

    try {
        const q = query(collection(database, "pending_food"), where("status", "==", "verified"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = "no-data-msg";
            emptyMsg.textContent = "No verified items found.";
            container.appendChild(emptyMsg);
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const isOwner = currentUserEmail === data.vendorEmail;

            const card = document.createElement('div');
            card.className = "food-card";

            const imgBox = document.createElement('div');
            imgBox.className = "img-box";
            
            const img = document.createElement('img');
            img.src = data.image;
            
            const price = document.createElement('span');
            price.className = "price-badge";
            price.textContent = `$${data.price}`;
            
            imgBox.append(img, price);

            const content = document.createElement('div');
            content.className = "card-content";
            
            const vendor = document.createElement('span');
            vendor.className = "vendor-info";
            vendor.textContent = data.category;

            const title = document.createElement('h3');
            title.textContent = data.name;

            const desc = document.createElement('p');
            desc.className = "food-desc-text";
            desc.textContent = data.description;

            const btn = document.createElement('button');
            btn.className = "publish-btn";
            btn.style.width = "100%";
            btn.style.marginTop = "10px";
            
            if (isOwner) {
                btn.textContent = "Edit Dish";
                btn.style.background = "#007bff";
                btn.onclick = () => window.location.href = `vendor.html?edit=${doc.id}`;
            } else {
                btn.textContent = "Add to Cart";
                btn.onclick = () => addToCart(doc.id, data.name, data.price);
            }

            content.append(vendor, title, desc, btn);
            card.append(imgBox, content);
            container.appendChild(card);
        });
    } catch (err) {
        console.error("Market Load Error:", err);
    }
}

function addToCart(id, name, price) {
    if (userRole !== "customer") {
        Swal.fire("Error", "Login as a customer to add items", "error");
        return;
    }
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ id, name, price });
    localStorage.setItem('cart', JSON.stringify(cart));
    
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = `(${cart.length})`;
    
    Swal.fire("Success", `${name} added to cart`, "success");
}

document.getElementById('logout-btn')?.addEventListener('click', () => {
    signOut(auth).then(() => location.reload());
});