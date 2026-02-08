import { database } from "../Config/config.js";
import { 
    collection, onSnapshot, doc, deleteDoc, query, orderBy 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const container = document.getElementById("food-list-container");
const countDisplay = document.getElementById("queue-count");

// --- Real-time Food Queue Listener ---
const q = query(collection(database, "pending_food"), orderBy("timestamp", "desc"));

onSnapshot(q, (snapshot) => {
    container.innerHTML = "";
    countDisplay.textContent = snapshot.size;

    if (snapshot.empty) {
        container.innerHTML = `<h2 class="loading-msg">All items verified! 🎉</h2>`;
        return;
    }

    // Setting up the grid style via a class already in your admin.css
    container.style.display = "grid";
    container.style.gridTemplateColumns = "repeat(auto-fill, minmax(320px, 1fr))";
    container.style.gap = "25px";
    container.style.padding = "20px 5%";

    snapshot.forEach((item) => {
        const dish = item.data();
        const id = item.id;

        // Create Card Element
        const card = document.createElement("div");
        card.className = "user-card"; // Using your existing CSS class

        // Building structure manually to keep CSS separate
        card.innerHTML = `
            <div class="food-img-frame" style="height: 180px; overflow: hidden; border-radius: 16px; margin-bottom: 20px;">
                <img src="${dish.image}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <span class="reg-time">🕒 Submitted: ${dish.timestamp ? dish.timestamp.split('T')[0] : 'Today'}</span>
            <h2 class="vendor-name">${dish.name}</h2>
            <p class="vendor-email">Price: $${dish.price} | ${dish.category}</p>
            <p class="vendor-email" style="font-size: 0.8rem; opacity: 0.6;">By: ${dish.vendorEmail}</p>
            
            <div class="action-box" style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="btn-verify approve-btn" data-id="${id}">Approve</button>
                <button class="btn-unverify reject-btn" data-id="${id}">Reject</button>
            </div>
        `;

        container.appendChild(card);
    });
});

// --- Button Click Handling (Event Delegation) ---
container.addEventListener('click', async (e) => {
    const id = e.target.getAttribute('data-id');
    if (!id) return;

    if (e.target.classList.contains('approve-btn')) {
        await handleApprove(id);
    } else if (e.target.classList.contains('reject-btn')) {
        await handleReject(id);
    }
});

async function handleApprove(id) {
    // Here you would normally move the doc to 'live_food'
    await deleteDoc(doc(database, "pending_food", id));
    Swal.fire({
        title: "Item Approved",
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000
    });
}

async function handleReject(id) {
    await deleteDoc(doc(database, "pending_food", id));
    Swal.fire({
        title: "Item Rejected",
        icon: "error",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000
    });
}

// --- Theme Toggle ---
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});