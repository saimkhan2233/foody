import { auth } from "./Config/config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


const toggleTheme = () => {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    
    body.classList.toggle('dark-mode');
    if (themeIcon) {
        themeIcon.textContent = body.classList.contains('dark-mode') ? '☀️' : '🌙';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
});


onAuthStateChanged(auth, (user) => {
    const authButtons = document.getElementById('auth-buttons');
    const mainExploreBtn = document.getElementById('main-explore-btn');

    if (user && authButtons) {
        authButtons.innerHTML = '';

        
        const themeBtn = document.createElement('button');
        themeBtn.className = 'btn-theme';
        themeBtn.innerHTML = '<span id="theme-icon">🌙</span>';
        themeBtn.onclick = toggleTheme;

        
        const marketBtn = document.createElement('button');
        marketBtn.className = 'btn-signup';
        marketBtn.textContent = 'Go to Market';
        marketBtn.onclick = () => window.location.href = 'market.html';

        
        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'btn-login';
        logoutBtn.textContent = 'Log Out';
        logoutBtn.onclick = () => signOut(auth).then(() => location.reload());

        authButtons.append(themeBtn, marketBtn, logoutBtn);
    }

    if (user && mainExploreBtn) {
        mainExploreBtn.innerText = "Visit Market Now";
        mainExploreBtn.href = "market.html";
    }
});