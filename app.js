import { auth } from "./Config/config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            themeIcon.textContent = body.classList.contains('dark-mode') ? '☀️' : '🌙';
        });
    }
});

onAuthStateChanged(auth, (user) => {
    const authButtons = document.getElementById('auth-buttons');
    const mainExploreBtn = document.getElementById('main-explore-btn');

    if (user && authButtons) {
        authButtons.innerHTML = '';

        const themeBtn = document.createElement('button');
        themeBtn.id = 'theme-toggle';
        themeBtn.className = 'btn-theme';
        themeBtn.innerHTML = '<span id="theme-icon">🌙</span>';

        const marketLink = document.createElement('a');
        marketLink.href = 'market.html';
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

        if (mainExploreBtn) {
            mainExploreBtn.innerText = "Visit Market Now";
            mainExploreBtn.href = "market.html";
        }

        logoutBtn.addEventListener('click', () => {
            signOut(auth).then(() => {
                window.location.reload();
            });
        });
    }
});