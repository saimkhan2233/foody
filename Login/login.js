import { auth, database } from "../Config/config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const loginBtn = document.getElementById("login-btn");

loginBtn.addEventListener('click', async () => {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(database, "users", res.user.uid));
        const userData = userDoc.data();

        // Check if Vendor is verified
        if (userData.role === "vendor" && !userData.isVerified) {
            Swal.fire("Access Pending", "Please wait for Admin approval.", "warning");
            return; 
        }

        // If verified (or customer), proceed to dashboard
        window.location.href = userData.role === "admin" ? "../admin/admin.html" : "../dashboard/index.html";
        
    } catch (error) {
        Swal.fire("Login Failed", error.message, "error");
    }
});