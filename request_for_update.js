import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

document.addEventListener('DOMContentLoaded', async (event) => {
    const urlParams = new URLSearchParams(window.location.search);
    const employeeId = urlParams.get('employeeId');

    if (employeeId) {
        try {
            const employeeData = await fetchEmployeeData(employeeId);
            if (employeeData) {
                updateForm(employeeData);
            } else {
                alert("Employee data not found");
            }
        } catch (error) {
            alert("Error fetching user data: " + error.message);
        }
    } else {
        alert("No employee ID found. Please log in.");
        window.location.href = "wissenloginpage.html";
    }

    const homeLink = document.getElementById('home-link');
    if (homeLink) {
        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `dashboard.html?employeeId=${employeeId}`;
        });
    }

    const requestUpdateLink = document.getElementById('request-update-link');
    if (requestUpdateLink) {
        requestUpdateLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `request_for_update.html?employeeId=${employeeId}`;
        });
    }

    const assessUpdateLink = document.getElementById('assess-update-link');
    if (assessUpdateLink) {
        assessUpdateLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `assess_my_score.html?employeeId=${employeeId}`;
        });
    }

    const employeeUpdateLink = document.getElementById('employee-update-link');
    if (employeeUpdateLink) {
        employeeUpdateLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `employeedata.html?employeeId=${employeeId}`;
        });
    }
});

async function fetchEmployeeData(employeeId) {
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
        const users = snapshot.val();
        for (let id in users) {
            if (users[id].employeeId === employeeId) {
                return users[id];
            }
        }
    }
    return null;
}

function updateForm(employeeData) {
    document.getElementById('employee-id').value = employeeData.employeeId;
    document.getElementById('employee-name-input').value = employeeData.name;
    document.getElementById('employee-email').value = employeeData.email;
    document.getElementById('employee-name').innerText = employeeData.name;
    document.getElementById('employee-role').innerText = `(${employeeData.role})`;
}

document.getElementById('update-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    alert("Form submission is currently disabled.");
    return;
    const form = e.target;
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const employeeId = document.getElementById('employee-id').value;
    const updatedData = {
        name: document.getElementById('employee-name-input').value,
        email: document.getElementById('employee-email').value,
    };
    try {
        await updateProfileData(employeeId, updatedData);
        document.getElementById('success-box').style.display = 'block';
    } catch (error) {
        alert("Error updating profile: " + error.message);
    }
});

async function updateProfileData(employeeId, updatedData) {
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
        const users = snapshot.val();
        let userKey = null;
        for (let id in users) {
            if (users[id].employeeId === employeeId) {
                userKey = id;
                break;
            }
        }
        if (userKey) {
            const userRef = ref(database, `users/${userKey}`);
            await update(userRef, updatedData);
            alert("Profile updated successfully");
        } else {
            alert("Employee data not found");
        }
    } else {
        alert("No users found in the database");
    }
}

document.getElementById('profile').addEventListener('click', () => {
    const dropdownMenu = document.getElementById('dropdown-menu');
    dropdownMenu.classList.toggle('show');
});

window.addEventListener('click', (event) => {
    if (!event.target.closest('.profile')) {
        document.getElementById('dropdown-menu').classList.remove('show');
    }
});
