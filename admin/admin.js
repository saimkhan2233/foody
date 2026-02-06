import { database, auth } from "../Config/config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    collection, 
    getDocs, 
    updateDoc, 
    doc, 
    query, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
    // 1. Security Check
    if (!user || user.email !== "admin@gmail.com") {
        window.location.href = "../login/login.html";
        return;
    }

    const list = document.getElementById("users");
    if (!list) return;

    list.innerHTML = `<h2 class="loading-msg">Welcome Admin, Fetching Requests...</h2>`;

    try {
        // 2. Fetch Users
        const q = query(collection(database, "users"), orderBy("timestamp", "desc"));
        const snap = await getDocs(q);
        list.innerHTML = ""; 

        if (snap.empty) {
            list.innerHTML = `<h2 class="loading-msg">No user requests found.</h2>`;
            return;
        }

        snap.forEach((u) => {
            const data = u.data();
            if (data.useremail === "admin@gmail.com") return;

            // 3. Create the Square Card
            const div = document.createElement("div");
            div.classList.add("user-card"); 

            const displayTime = data.timestamp ? data.timestamp : "New Member";

            // Using the exact classes from your CSS
            div.innerHTML = `
                <div class="top-section">
                    <span class="reg-time">🕒 ${displayTime}</span>
                    <h3 class="vendor-name">${data.fullname}</h3>
                    <p class="vendor-email"><span>Email: &nbsp</span>${data.useremail}</p>
                    <span class="status-label ${data.isVerified ? 'verified-text' : 'pending-text'}">
                        ${data.isVerified ? "VERIFIED" : "PENDING"}
                    </span>
                </div>
            `;

            // 4. Create Action Button with your CSS classes
            const toggle = document.createElement("button");
            // Important: These match your .btn-verify and .btn-unverify
            toggle.classList.add(data.isVerified ? "btn-unverify" : "btn-verify");
            toggle.textContent = data.isVerified ? "Remove Access" : "Grant Access";

            toggle.onclick = async () => {
                try {
                    await updateDoc(doc(database, "users", u.id), { isVerified: !data.isVerified });
                    location.reload(); 
                } catch (err) {
                    console.error("Update failed:", err);
                }
            };

            div.appendChild(toggle);
            list.appendChild(div);
        });
    } catch (error) {
        console.error("Firestore Error:", error);
        list.innerHTML = `<h2 class="loading-msg">Error: Enable Indexing in F12 Console.</h2>`;
    }
});

// Logout Listener
const logoutBtn = document.getElementById("admin-logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            window.location.href = "../login/login.html";
        });
    });
}