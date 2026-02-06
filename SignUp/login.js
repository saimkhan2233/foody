import { auth } from "../Config/config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 1. Target the button ID from your HTML
const loginBtn = document.getElementById("login-btn");

if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        // 2. Target the specific IDs for Email and Password
        const emailInput = document.getElementById("useremail");
        const passInput = document.getElementById("userpassword");

        // 3. Prevent the "null" error if IDs are missing in HTML
        if (!emailInput || !passInput) {
            console.error("Missing HTML IDs! Ensure email is 'useremail' and password is 'userpassword'.");
            return;
        }

        const email = emailInput.value.trim();
        const pass = passInput.value.trim();

        // 4. Basic validation before calling Firebase
        if (!email || !pass) {
            Swal.fire("Empty Fields", "Please enter both email and password.", "warning");
            return;
        }

        try {
            // 5. Attempt login with the password 'pakistan'
            const res = await signInWithEmailAndPassword(auth, email, pass);
            const user = res.user;

            // 6. ADMIN REDIRECT LOGIC
            // If the email matches your hardcoded admin, send to dashboard
            if (user.email === "admin@gmail.com") {
                Swal.fire({
                    title: "Welcome Admin",
                    text: "Accessing Spot Dashboard...",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    // Check if your folder name is 'admin' or 'Admin'
                    window.location.href = "../admin/admin.html"; 
                });
            } else {
                // 7. REGULAR USER REDIRECT
                window.location.href = "../index.html";
            }

        } catch (error) {
            // Handle specific Firebase errors from your screenshots
            console.error("Firebase Error Code:", error.code);
            
            if (error.code === 'auth/invalid-email') {
                Swal.fire("Error", "The email format is incorrect.", "error");
            } else if (error.code === 'auth/invalid-credential') {
                Swal.fire("Login Failed", "Incorrect email or password (pakistan).", "error");
            } else {
                Swal.fire("Error", error.message, "error");
            }
        }
    });
} else {
    console.error("The button with ID 'login-btn' was not found!");
}   