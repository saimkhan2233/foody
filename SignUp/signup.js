import { database, auth } from "../Config/config.js";
import { 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const signupBtn = document.getElementById("signup-btn");
const googleSignupBtn = document.getElementById("google-login-btn");

if (signupBtn) {
    signupBtn.addEventListener('click', async () => {
        const role = document.getElementById("userrole").value; 
        const email = document.getElementById("useremail").value;
        const pass = document.getElementById("userpassword").value;
        const name = document.getElementById("username").value;

        if (!role || !email || !pass || !name) {
            Swal.fire("Error", "Please fill all fields", "error");
            return;
        }

        try {
            const res = await createUserWithEmailAndPassword(auth, email, pass);
            await setDoc(doc(database, "users", res.user.uid), {
                fullname: name,
                useremail: email,
                role: role,
                isVerified: (role === "customer"),
                timestamp: new Date().toLocaleString()
            });

            Swal.fire("Success", "Account created! Please login.", "success").then(() => {
                window.location.href = "../login/login.html";
            });
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    });
}

if (googleSignupBtn) {
    googleSignupBtn.addEventListener('click', async () => {
        const role = document.getElementById("userrole").value;
        
        if (!role) {
            Swal.fire("Role Required", "Please select a role before signing up with Google.", "info");
            return;
        }

        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const userRef = doc(database, "users", user.uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                await setDoc(userRef, {
                    fullname: user.displayName,
                    useremail: user.email,
                    role: role,
                    isVerified: (role === "customer"),
                    timestamp: new Date().toLocaleString()
                });
            }

            Swal.fire("Success", "Signed up with Google!", "success").then(() => {
                window.location.href = "../index.html";
            });
        } catch (error) {
            Swal.fire("Google Error", error.message, "error");
        }
    });
}