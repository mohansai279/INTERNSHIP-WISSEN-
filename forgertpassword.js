import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
        import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
    
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

        document.getElementById('reset-password-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;

            sendPasswordResetEmail(auth, email)
                .then(() => {
                    alert('Password reset email sent!');
                })
                .catch((error) => {
                    alert(error.message);
                });
        });