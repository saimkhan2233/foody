import { database, auth } from "../Config/config.js";
import { 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const signupBtn = document.getElementById("signup-btn");
const googleSignupBtn = document.getElementById("google-login-btn");

const saveUser = async (user, name, email, role) => {
    await setDoc(doc(database, "users", user.uid), {
        fullname: name,
        useremail: email,
        role: role,
        isVerified: (role === "customer"),
        timestamp: new Date().toLocaleString()
    });
};

signupBtn?.addEventListener('click', async () => {
    const role = document.getElementById("userrole").value; 
    const email = document.getElementById("useremail").value;
    const pass = document.getElementById("userpassword").value;
    const name = document.getElementById("username").value;

    if (!role || !email || !pass || !name) {
        return Swal.fire("Error", "Please fill all fields", "error");
    }

    try {
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        await saveUser(res.user, name, email, role);

        Swal.fire("Success", "Account created! Please login.", "success").then(() => {
            window.location.href = "../login/login.html";
        });
    } catch (error) {
        Swal.fire("Error", error.message, "error");
    }
});

googleSignupBtn?.addEventListener('click', async () => {
    const role = document.getElementById("userrole").value;
    if (!role) {
        return Swal.fire("Role Required", "Please select a role first.", "info");
    }

    try {
        const result = await signInWithPopup(auth, new GoogleAuthProvider());
        const userRef = doc(database, "users", result.user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            await saveUser(result.user, result.user.displayName, result.user.email, role);
        }

        Swal.fire("Success", "Signed up with Google!", "success").then(() => {
            window.location.href = "../index.html";
        });
    } catch (error) {
        Swal.fire("Google Error", error.message, "error");
    }
});