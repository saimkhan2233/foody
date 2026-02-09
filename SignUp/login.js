import { auth, database } from "../Config/config.js";
import { 
    onAuthStateChanged, 
    signOut, 
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const handleLogin = async (email, password) => {
    try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(database, "users", res.user.uid));
        
        if (!userDoc.exists()) {
            Swal.fire("Error", "User record not found.", "error");
            return;
        }

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

const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const userRef = doc(database, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            await setDoc(userRef, {
                email: user.email,
                role: "customer",
                isVerified: true
            });
            window.location.href = "../index.html";
        } else {
            const userData = userDoc.data();
            window.location.href = userData.role === "admin" ? "../admin/admin.html" : "../index.html";
        }
    } catch (error) {
        Swal.fire("Google Login Failed", error.message, "error");
    }
};

onAuthStateChanged(auth, async (user) => {
    const authButtons = document.getElementById('auth-buttons');
    const mainExploreBtn = document.getElementById('main-explore-btn');

    if (user) {
        if (authButtons) {
            authButtons.innerHTML = '';
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
    const loginBtn = document.getElementById("login-btn");
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;
            if (email && password) handleLogin(email, password);
        });
    }

    const googleBtn = document.getElementById("google-login-btn");
    if (googleBtn) {
        googleBtn.addEventListener('click', handleGoogleLogin);
    }
});