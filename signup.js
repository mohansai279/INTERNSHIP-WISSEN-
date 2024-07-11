import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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
const database = getDatabase(app);
const auth = getAuth();

document.getElementById('signup').addEventListener('click', (e) => {
    const form = document.getElementById('signup-form');
    const role = document.getElementById('role');
    const employeeId = document.getElementById('employee-id');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    let isValid = true;

    // Custom validation messages
    if (!role.value) {
        isValid = false;
        role.setCustomValidity('Please select your role.');
    } else {
        role.setCustomValidity('');
    }

    if (!employeeId.value) {
        isValid = false;
        employeeId.setCustomValidity('Please fill out this field.');
    } else {
        employeeId.setCustomValidity('');
    }

    if (!email.value) {
        isValid = false;
        email.setCustomValidity('Please enter your email.');
    } else if (!validateEmail(email.value)) {
        isValid = false;
        email.setCustomValidity('Please enter a valid email address.');
    } else {
        email.setCustomValidity('');
    }

    if (!password.value) {
        isValid = false;
        password.setCustomValidity('Please enter your password.');
    } else if (password.value.length < 6) {
        isValid = false;
        password.setCustomValidity('Password must be at least 6 characters.');
    } else {
        password.setCustomValidity('');
    }

    if (!confirmPassword.value) {
        isValid = false;
        confirmPassword.setCustomValidity('Please confirm your password.');
    } else if (password.value !== confirmPassword.value) {
        isValid = false;
        confirmPassword.setCustomValidity('Passwords do not match.');
    } else {
        confirmPassword.setCustomValidity('');
    }

    if (!isValid) {
        // Trigger the browser's built-in form validation
        form.reportValidity();
        return;
    }

    createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
        const user = userCredential.user;
        const userRef = ref(database, 'users/' + user.uid);
        set(userRef, {
            role: role.value,
            employeeId: employeeId.value,
            email: email.value
        });
        showSuccessBox();
    })
    .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
    });
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function showSuccessBox() {
    const successBox = document.getElementById('success-box');
    successBox.style.display = 'block';
    setTimeout(() => {
        successBox.style.display = 'none';
        window.location.href = "index.html"; // Redirect to login page
    }, 2000); // Disappear after 2 seconds and then redirect
}