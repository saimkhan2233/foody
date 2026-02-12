import { database } from "../Config/config.js";
import { collection, onSnapshot, doc, deleteDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const container = document.getElementById("food-list-container");
const countDisplay = document.getElementById("queue-count");
const foodQuery = query(collection(database, "pending_food"), orderBy("timestamp", "desc"));

onSnapshot(foodQuery, (snapshot) => {
    if (!container) return;
    
    container.innerHTML = "";
    countDisplay.textContent = snapshot.size;

    if (snapshot.empty) {
        container.innerHTML = `<h2 class="loading-msg">All items verified! 🎉</h2>`;
        return;
    }

    snapshot.forEach((item) => {
        const dish = item.data();
        const card = document.createElement("div");
        card.className = "user-card";

        card.innerHTML = `
            <div class="food-img-frame" style="height: 180px; overflow: hidden; border-radius: 16px; margin-bottom: 20px;">
                <img src="${dish.image}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <span class="reg-time">🕒 ${dish.timestamp ? dish.timestamp.split('T')[0] : 'Today'}</span>
            <h2 class="vendor-name">${dish.name}</h2>
            <p class="vendor-email">$${dish.price} | ${dish.category}</p>
            <p class="vendor-email" style="font-size: 0.8rem; opacity: 0.6;">By: ${dish.vendorEmail}</p>
            
            <div class="action-box" style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="btn-verify approve-btn" data-id="${item.id}">Approve</button>
                <button class="btn-unverify reject-btn" data-id="${item.id}">Reject</button>
            </div>
        `;
        container.appendChild(card);
    });
});

const processItem = async (id, status) => {
    try {
        await deleteDoc(doc(database, "pending_food", id));
        Swal.fire({
            title: status === "approved" ? "Item Approved" : "Item Rejected",
            icon: status === "approved" ? "success" : "error",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000
        });
    } catch (err) {
        console.error("Action failed", err);
    }
};

container?.addEventListener('click', (e) => {
    const id = e.target.getAttribute('data-id');
    if (!id) return;

    if (e.target.classList.contains('approve-btn')) processItem(id, "approved");
    if (e.target.classList.contains('reject-btn')) processItem(id, "rejected");
});

document.getElementById('theme-toggle')?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});