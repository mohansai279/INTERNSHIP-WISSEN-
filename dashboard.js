import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
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
const auth = getAuth();
const database = getDatabase(app);

function toggleDropdown() {
    const dropdownMenu = document.getElementById('dropdown-menu');
    dropdownMenu.style.display = dropdownMenu.style.display === 'none' || dropdownMenu.style.display === '' ? 'block' : 'none';
    console.log('Dropdown toggled');
}

document.getElementById('profile').addEventListener('click', toggleDropdown);

window.onclick = function(event) {
    if (!event.target.matches('.profile') && !event.target.matches('.profile *')) {
        const dropdowns = document.getElementsByClassName('dropdown-menu');
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.style.display === 'block') {
                openDropdown.style.display = 'none';
            }
        }
    }
}

async function updateDashboard(employeeData) {
    document.getElementById('employee-name').innerText = employeeData.name;
    document.getElementById('employee-role').innerText = `(${employeeData.role})`;
    document.getElementById('employee-table-name').innerText = employeeData.name;
    document.getElementById('employee-table-id').innerText = employeeData.employeeId;
    document.getElementById('current-role').value = employeeData.role;
    document.getElementById('exp-current-role').value = employeeData.expCurrentRole || '';
    document.getElementById('total-it-exp').value = employeeData.totalItExp || '';
    document.getElementById('certification').value = employeeData.certification || '';
    document.getElementById('primary-skill').value = employeeData.primarySkill || '';
    document.getElementById('secondary-skill').value = employeeData.secondarySkill || '';
}

document.addEventListener('DOMContentLoaded', async (event) => {
    const urlParams = new URLSearchParams(window.location.search);
    const employeeId = urlParams.get('employeeId');

    if (employeeId) {
        try {
            const employeeData = await fetchEmployeeData(employeeId);
            if (employeeData) {
                updateDashboard(employeeData);
                console.log('Employee data fetched and dashboard updated');
            } else {
                alert("Employee data not found");
                console.log('Employee data not found');
            }
        } catch (error) {
            alert("Error fetching user data: " + error.message);
            console.error('Error fetching user data:', error.message);
        }
    } else {
        alert("No employee ID found. Please log in.");
        console.log('No employee ID found');
        window.location.href = "index.html";
    }

    document.getElementById('home-link').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `dashboard.html?employeeId=${employeeId}`;
        console.log('Home link clicked, redirecting to dashboard');
    });
    document.getElementById('request-update-link').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `request_for_update.html?employeeId=${employeeId}`;
        console.log('Request update link clicked');
    });
    document.getElementById('assess-update-link').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `assess_my_score.html?employeeId=${employeeId}`;
        console.log('Assess update link clicked');
    });
    document.getElementById('employee-update-link').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `employeedata.html?employeeId=${employeeId}`;
        console.log('Employee update link clicked');
    });
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
            console.log('Profile updated successfully');
        } else {
            alert("Employee data not found");
            console.log('Employee data not found');
        }
    } else {
        alert("No users found in the database");
        console.log('No users found in the database');
    }
}

function logout() {
    signOut(auth).then(() => {
        alert("Logged out");
        console.log('Logged out');
        window.location.href = "index.html";
    }).catch((error) => {
        alert("Error logging out: " + error.message);
        console.error('Error logging out:', error.message);
    });
}

document.getElementById('submitData').addEventListener('click', async (e) => {
    const form = document.getElementById('update-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const employeeId = urlParams.get('employeeId');
    if (employeeId) {
        const updatedData = {
            name: document.getElementById('employee-name').innerText,
            role: document.getElementById('current-role').value,
            expCurrentRole: document.getElementById('exp-current-role').value,
            totalItExp: document.getElementById('total-it-exp').value,
            certification: document.getElementById('certification').value,
            primarySkill: document.getElementById('primary-skill').value,
            secondarySkill: document.getElementById('secondary-skill').value,
        };
        try {
            await updateProfileData(employeeId, updatedData);
            console.log('Profile data updated');
        } catch (error) {
            alert("Error updating profile: " + error.message);
            console.error('Error updating profile:', error.message);
        }
    } else {
        alert("No employee ID found. Please log in.");
        console.log('No employee ID found for profile update');
        window.location.href = "index.html";
    }
});
