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
            return Swal.fire("Error", "User record not found.", "error");
        }

        const userData = userDoc.data();

        if (userData.role === "vendor" && !userData.isVerified) {
            await signOut(auth);
            return Swal.fire("Access Pending", "Please wait for Admin approval.", "warning");
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
        const userRef = doc(database, "users", result.user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            await setDoc(userRef, {
                email: result.user.email,
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

    if (user && authButtons) {
        authButtons.innerHTML = '';

        const marketLink = document.createElement('a');
        marketLink.href = '../market.html';
        
        const marketBtn = document.createElement('button');
        marketBtn.className = 'btn-signup';
        marketBtn.textContent = 'Go to Market';
        marketLink.appendChild(marketBtn);

        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'btn-login';
        logoutBtn.textContent = 'Log Out';
        logoutBtn.onclick = () => signOut(auth).then(() => window.location.reload());

        authButtons.append(marketLink, logoutBtn);
    }

    if (user && mainExploreBtn) {
        mainExploreBtn.innerText = "Visit Market Now";
        mainExploreBtn.href = "../market.html";
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("login-btn")?.addEventListener('click', () => {
        const email = document.getElementById("login-email").value;
        const pass = document.getElementById("login-password").value;
        if (email && pass) handleLogin(email, pass);
    });

    document.getElementById("google-login-btn")?.addEventListener('click', handleGoogleLogin);
});