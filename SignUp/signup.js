import { database, auth } from "../Config/config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const signupBtn = document.getElementById("signup-btn");

// Safety Check: Only run if the button is actually found
if (signupBtn) {
    signupBtn.addEventListener('click', async () => {
        const role = document.getElementById("userrole").value; 
        const email = document.getElementById("useremail").value;
        const pass = document.getElementById("userpassword").value;
        const name = document.getElementById("username").value;

        try {
            const res = await createUserWithEmailAndPassword(auth, email, pass);
            
            await setDoc(doc(database, "users", res.user.uid), {
                fullname: name,
                useremail: email,
                role: role,
                isVerified: (role === "customer"),
                timestamp: new Date().toLocaleString() // This fixes your "Date Unknown" issue
            });

            Swal.fire("Success", "Account created! Please login.", "success").then(() => {
                window.location.href = "../login/login.html";
            });
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    });
} else {
    // This will tell you exactly what's wrong in the console
    console.error("Critical Error: 'signup-btn' not found in HTML. Check your ID or Script position.");
}