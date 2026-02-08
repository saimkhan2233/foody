import { auth, database } from "../Config/config.js";
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const handleLogin = async (email, password) => {
    try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(database, "users", res.user.uid));
        const userData = userDoc.data();

        if (userData.role === "vendor" && !userData.isVerified) {
            await signOut(auth);
            Swal.fire("Access Pending", "Please wait for Admin approval.", "warning");
            return;
        }

        window.location.href = userData.role === "admin" ? "../admin/admin.html" : "../index.html";
    } catch (error) {
        Swal.fire("Login Failed", error.message, "error");
    }
};

onAuthStateChanged(auth, async (user) => {
    const authButtons = document.getElementById('auth-buttons');
    const mainExploreBtn = document.getElementById('main-explore-btn');

    if (user) {
        if (authButtons) {
            authButtons.innerHTML = '';

            const themeBtn = document.createElement('button');
            themeBtn.id = 'theme-toggle';
            themeBtn.className = 'btn-theme';
            themeBtn.innerHTML = '<span id="theme-icon">🌙</span>';

            const marketLink = document.createElement('a');
            marketLink.href = '../market.html';
            const marketBtn = document.createElement('button');
            marketBtn.className = 'btn-signup';
            marketBtn.textContent = 'Go to Market';
            marketLink.appendChild(marketBtn);

            const logoutBtn = document.createElement('button');
            logoutBtn.id = 'nav-logout';
            logoutBtn.className = 'btn-login';
            logoutBtn.textContent = 'Log Out';

            authButtons.appendChild(themeBtn);
            authButtons.appendChild(marketLink);
            authButtons.appendChild(logoutBtn);

            logoutBtn.addEventListener('click', () => {
                signOut(auth).then(() => window.location.reload());
            });
        }

        if (mainExploreBtn) {
            mainExploreBtn.innerText = "Visit Market Now";
            mainExploreBtn.href = "../market.html";
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const icon = document.getElementById('theme-icon');
            if (icon) icon.textContent = body.classList.contains('dark-mode') ? '☀️' : '🌙';
        });
    }

    const loginBtn = document.getElementById("login-btn");
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;
            handleLogin(email, password);
        });
    }
});