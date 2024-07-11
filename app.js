import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBzOav7li6R4ox7Vyhj8_5Po5tCdXZicV8",
    authDomain: "authentication-app-f6337.firebaseapp.com",
    databaseURL: "https://authentication-app-f6337-default-rtdb.firebaseio.com",
    projectId: "authentication-app-f6337",
    storageBucket: "authentication-app-f6337.appspot.com",
    messagingSenderId: "383999026663",
    appId: "1:383999026663:web:05bdbd58d573c458c50942"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);

document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const employeeId = document.getElementById("employee-id").value;
    const password = document.getElementById("password").value;

    try {
        const userRef = ref(database, 'users/');
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            const users = snapshot.val();
            let email = null;
            let employeeName = null;

            for (let id in users) {
                if (users[id].employeeId === employeeId) {
                    email = users[id].email;
                    employeeName = users[id].name;
                    break;
                }
            }

            if (email) {
                await signInWithEmailAndPassword(auth, email, password);
                window.location.href = `dashboard.html?employeeId=${employeeId}`;
            } else {
                alert("Employee ID not found");
            }
        } else {
            alert("No users found in the database");
        }
    } catch (error) {
        alert(error.message);
    }
});

function togglePassword() {
    const passwordField = document.getElementById("password");
    const eyeIcon = document.getElementById("eye-icon");
    if (passwordField.type === "password") {
        passwordField.type = "text";
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
    } else {
        passwordField.type = "password";
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
    }
}
