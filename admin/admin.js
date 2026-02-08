import { database, auth } from "../Config/config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    collection, onSnapshot, updateDoc, doc, query, orderBy 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- UI Elements ---
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const queueBtn = document.getElementById('view-queue-btn');
const list = document.getElementById("users");
const totalCount = document.getElementById('total-count');
const pendingCount = document.getElementById('pending-count');
const verifiedCount = document.getElementById('verified-count');

let showOnlyPending = false;

// --- Theme Management ---
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeIcon.textContent = isDark ? '🌙' : '☀️';
});

// --- Queue Toggle Logic ---
queueBtn.addEventListener('click', () => {
    showOnlyPending = !showOnlyPending;
    queueBtn.innerText = showOnlyPending ? "👁️ Show All Users" : "🛡️ Verification Queue";
    // The view will update automatically because of onSnapshot
});

// --- Admin Dashboard Logic ---
onAuthStateChanged(auth, (user) => {
    if (!user || user.email !== "admin@gmail.com") {
        window.location.href = "../login/login.html";
        return;
    }

    list.innerHTML = `<h2 class="loading-msg">Loading Requests...</h2>`;

    // Real-time listener: No more location.reload() needed!
    const q = query(collection(database, "users"), orderBy("timestamp", "desc"));
    
    onSnapshot(q, (snap) => {
        list.innerHTML = ""; 
        let total = 0, pending = 0, verified = 0;

        snap.forEach((u) => {
            const data = u.data();
            if (data.useremail === "admin@gmail.com") return;

            total++;
            data.isVerified ? verified++ : pending++;

            // FILTER: If showOnlyPending is true, skip verified users
            if (showOnlyPending && data.isVerified) return;

            const div = document.createElement("div");
            div.classList.add("user-card"); 

            div.innerHTML = `
                <span class="reg-time">🕒 ${data.timestamp || 'New Member'}</span>
                <h3 class="vendor-name">${data.fullname}</h3>
                <p class="vendor-email">Email: ${data.useremail}</p>
                <span class="status-label ${data.isVerified ? 'verified-text' : 'pending-text'}">
                    ${data.isVerified ? "VERIFIED" : "PENDING"}
                </span>
            `;

            const toggle = document.createElement("button");
            toggle.classList.add(data.isVerified ? "btn-unverify" : "btn-verify");
            toggle.textContent = data.isVerified ? "Remove Access" : "Grant Access";

            toggle.onclick = async () => {
                try {
                    await updateDoc(doc(database, "users", u.id), { 
                        isVerified: !data.isVerified 
                    });
                    // SweetAlert for feedback
                    Swal.fire({
                        title: data.isVerified ? 'Access Revoked' : 'Access Granted',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 2000
                    });
                } catch (err) {
                    Swal.fire("Error", "Update failed", "error");
                }
            };

            div.appendChild(toggle);
            list.appendChild(div);
        });

        // If filtering and no pending found
        if (showOnlyPending && pending === 0) {
            list.innerHTML = `<h2 class="loading-msg">No pending requests! 🎉</h2>`;
        }

        // Update Stats UI
        totalCount.textContent = total;
        pendingCount.textContent = pending;
        verifiedCount.textContent = verified;

    }, (error) => {
        list.innerHTML = `<h2 class="loading-msg">Error loading data.</h2>`;
    });
});

// --- Logout ---
document.getElementById("admin-logout-btn").addEventListener('click', () => {
    signOut(auth).then(() => window.location.href = "../login/login.html");
});