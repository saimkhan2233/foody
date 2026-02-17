import { auth } from "./Config/config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const toggleTheme = () => {
    const body = document.body;
    const themeIcons = document.querySelectorAll('.theme-icon');
    
    body.classList.toggle('dark-mode');
    
    const isDarkMode = body.classList.contains('dark-mode');
    const iconSvg = isDarkMode ? 
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>' : 
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    
    themeIcons.forEach(icon => {
        icon.innerHTML = iconSvg;
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.querySelectorAll('.theme-icon').forEach(icon => {
            icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
        });
    }
    
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn-theme')) {
            toggleTheme();
            localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        }
    });
});

const renderAuthButtons = (user) => {
    const authButtons = document.getElementById('auth-buttons');
    if (!authButtons) return;
    
    authButtons.innerHTML = '';
    
    if (user) {
        const themeBtn = document.createElement('button');
        themeBtn.className = 'btn-theme';
        themeBtn.innerHTML = '<span class="theme-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></span>';
        
        const marketBtn = document.createElement('button');
        marketBtn.className = 'btn-signup';
        marketBtn.textContent = 'Go to Market';
        marketBtn.onclick = () => window.location.href = 'market.html';
        
        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'btn-login';
        logoutBtn.textContent = 'Log Out';
        logoutBtn.onclick = () => signOut(auth).then(() => location.reload());
        
        authButtons.append(themeBtn, marketBtn, logoutBtn);
    } else {
        const themeBtn = document.createElement('button');
        themeBtn.className = 'btn-theme';
        themeBtn.innerHTML = '<span class="theme-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></span>';
        
        const signupBtn = document.createElement('a');
        signupBtn.href = 'SignUp/signup.html';
        signupBtn.innerHTML = '<button class="btn-signup">SignUp</button>';
        
        const loginBtn = document.createElement('a');
        loginBtn.href = 'Login/login.html';
        loginBtn.innerHTML = '<button class="btn-login">LogIn</button>';
        
        authButtons.append(themeBtn, signupBtn, loginBtn);
    }
    
    if (document.body.classList.contains('dark-mode')) {
        document.querySelectorAll('.theme-icon').forEach(icon => {
            icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
        });
    }
};

const updateMainButton = (user) => {
    const mainExploreBtn = document.getElementById('main-explore-btn');
    if (!mainExploreBtn) return;
    
    if (user) {
        mainExploreBtn.innerText = "Visit Market Now";
        mainExploreBtn.href = "market.html";
    } else {
        mainExploreBtn.innerText = "Explore Vendor Market";
        mainExploreBtn.href = "SignUp/signup.html";
    }
};

onAuthStateChanged(auth, (user) => {
    renderAuthButtons(user);
    updateMainButton(user);
});
