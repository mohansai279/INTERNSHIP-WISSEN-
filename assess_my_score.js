import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
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
        window.location.href = "index.html";
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
    document.getElementById('employee-name').innerText = employeeData.name;
    document.getElementById('employee-role').innerText = `(${employeeData.role})`;

    const assessUpdateLink = document.getElementById('assess-update-link');
    if (assessUpdateLink) {
        assessUpdateLink.href = `assess_my_score.html?employeeId=${employeeData.employeeId}`;
    }

    const employeeUpdateLink = document.getElementById('employee-update-link');
    if (employeeUpdateLink) {
        employeeUpdateLink.href = `employeedata.html?employeeId=${employeeData.employeeId}`;
    }

    const requestUpdateLink = document.getElementById('request-update-link');
    if (requestUpdateLink) {
        requestUpdateLink.href = `request_for_update.html?employeeId=${employeeData.employeeId}`;
    }

    const homeLink = document.getElementById('home-link');
    if (homeLink) {
        homeLink.href = `dashboard.html?employeeId=${employeeData.employeeId}`;
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

let managerSelected = false;
let projectSelected = false;
let towerSelected = false;
let skillSelected = false;

document.getElementById('manager-name').addEventListener('change', function() {
    const projectGroup = document.getElementById('project-group');
    if (this.value) {
        projectGroup.style.display = 'block';
        shuffleData(this.value);
        managerSelected = true;
    } else {
        projectGroup.style.display = 'none';
        hideAllBelow('project-group');
        managerSelected = false;
    }
    checkSelections();
});

document.getElementById('project-name').addEventListener('change', function() {
    const towerGroup = document.getElementById('tower-group');
    if (this.value) {
        towerGroup.style.display = 'block';
        projectSelected = true;
    } else {
        towerGroup.style.display = 'none';
        hideAllBelow('tower-group');
        projectSelected = false;
    }
    checkSelections();
});

document.getElementById('tower-name').addEventListener('change', function() {
    const skillGroup = document.getElementById('skill-group');
    if (this.value) {
        skillGroup.style.display = 'block';
        towerSelected = true;
    } else {
        skillGroup.style.display = 'none';
        hideAllBelow('skill-group');
        towerSelected = false;
    }
    checkSelections();
});

document.getElementById('select-skill').addEventListener('change', function() {
    const saveDraft = document.getElementById('save-draft');
    const submit = document.getElementById('submit');
    const quarterScores = document.getElementById('quarter-scores');
    if (this.value) {
        saveDraft.style.display = 'block';
        submit.style.display = 'block';
        quarterScores.style.display = 'block';
        skillSelected = true;
        showAssessmentTable();
    } else {
        saveDraft.style.display = 'none';
        submit.style.display = 'none';
        quarterScores.style.display = 'none';
        skillSelected = false;
    }
    checkSelections();
});

function hideAllBelow(id) {
    const sections = ['project-group', 'tower-group', 'skill-group', 'save-draft', 'submit', 'quarter-scores', 'assessment-table'];
    const startHiding = sections.indexOf(id) + 1;
    for (let i = startHiding; i < sections.length; i++) {
        document.getElementById(sections[i]).style.display = 'none';
    }
}

function checkSelections() {
    const quarterScoresBtn = document.getElementById('quarter-scores');
    if (managerSelected && projectSelected && towerSelected && skillSelected) {
        document.getElementById('assessment-table').style.display = 'block';
        quarterScoresBtn.style.display = 'block';
    } else {
        document.getElementById('assessment-table').style.display = 'none';
        quarterScoresBtn.style.display = 'none';
    }
}

const data = [
    {service: 'Monitoring', technology: 'Solarwinds/Nagios/Splunk/Etc', activity: 'Availability & Performance Monitoring', skill: 'L1'},
    {service: 'Monitoring', technology: 'All Infra Technologies', activity: 'SOP based monitoring', skill: 'L1'},
    {service: 'Monitoring', technology: 'All Infra Technologies', activity: 'Monitoring Backup / Batch Jobs completion', skill: 'L1'},
    {service: 'Monitoring', technology: 'All Infra Technologies', activity: 'Alerts Handling & Ticket Creation', skill: 'L1'},
    {service: 'Monitoring', technology: 'All Infra Technologies', activity: 'Custom Monitoring e.g. All-Hands, Conferences, Major Prod Release, Major Outages etc', skill: 'L1'},
    {service: 'Administration', technology: 'Windows / Linux', activity: 'User & Access Management', skill: 'L1'},
    {service: 'Administration', technology: 'Windows / Linux', activity: 'Jobs scheduling / Re-runs', skill: 'L1'},
    {service: 'Administration', technology: 'Windows / Linux', activity: 'Installation of tools/utilities', skill: 'L1'},
    {service: 'Development', technology: 'JavaScript/React', activity: 'Frontend Development', skill: 'L2'},
    {service: 'Development', technology: 'Java/Node.js', activity: 'Backend Development', skill: 'L2'},
    {service: 'Development', technology: 'Python/Django', activity: 'Web Development', skill: 'L2'},
    {service: 'Development', technology: 'Ruby on Rails', activity: 'Web Application Development', skill: 'L2'},
    {service: 'Development', technology: 'PHP/Laravel', activity: 'Web Development', skill: 'L2'},
    {service: 'Development', technology: 'Java/Spring', activity: 'Enterprise Application Development', skill: 'L2'},
    {service: 'Development', technology: 'C#/ASP.NET', activity: 'Web Application Development', skill: 'L2'},
    {service: 'Development', technology: 'Go', activity: 'Backend Development', skill: 'L2'},
    {service: 'Development', technology: 'Kotlin', activity: 'Mobile Development', skill: 'L2'},
    {service: 'Development', technology: 'Swift', activity: 'iOS Development', skill: 'L2'},
    {service: 'Development', technology: 'React Native', activity: 'Cross-Platform Mobile Development', skill: 'L2'},
    {service: 'Testing', technology: 'Selenium', activity: 'Automated Testing', skill: 'L3'},
    {service: 'Testing', technology: 'JUnit', activity: 'Unit Testing', skill: 'L3'},
    {service: 'Testing', technology: 'JMeter', activity: 'Performance Testing', skill: 'L3'},
    {service: 'Testing', technology: 'TestNG', activity: 'Test Automation', skill: 'L3'},
    {service: 'Testing', technology: 'Cucumber', activity: 'Behavior Driven Development', skill: 'L3'},
    {service: 'Testing', technology: 'Appium', activity: 'Mobile Testing', skill: 'L3'},
    {service: 'Testing', technology: 'Postman', activity: 'API Testing', skill: 'L3'},
    {service: 'Testing', technology: 'LoadRunner', activity: 'Load Testing', skill: 'L3'},
    {service: 'Testing', technology: 'QTP/UFT', activity: 'Functional Testing', skill: 'L3'},
    {service: 'Testing', technology: 'SoapUI', activity: 'Web Services Testing', skill: 'L3'}
];

let currentPage = 1;
let rowsPerPage = 10;
let currentData = [];

function shuffleData(manager) {
    const shuffledData = [...data];
    switch (manager) {
        case 'mohan_sai':
            currentData = shuffledData;
            break;
        case 'tharak':
            currentData = shuffledData.slice().reverse();
            break;
        case 'badhri':
            currentData = shuffledData.slice().sort(() => Math.random() - 0.5);
            break;
        case 'bhuvan':
            currentData = shuffledData.slice(10).concat(shuffledData.slice(0, 10));
            break;
        case 'surendra':
            currentData = shuffledData.slice(20).concat(shuffledData.slice(0, 20));
            break;
        case 'varshith':
            currentData = shuffledData.slice(5).concat(shuffledData.slice(0, 5));
            break;
        case 'deekshitha':
            currentData = shuffledData.slice(15).concat(shuffledData.slice(0, 15));
            break;
        case 'keerthi':
            currentData = shuffledData.slice(25).concat(shuffledData.slice(0, 25));
            break;
        case 'nanditha':
            currentData = shuffledData.slice(8).concat(shuffledData.slice(0, 8));
            break;
        case 'likitha':
            currentData = shuffledData.slice(12).concat(shuffledData.slice(0, 12));
            break;
        default:
            currentData = shuffledData;
    }
    showAssessmentTable();
}

document.getElementById('rows-per-page').addEventListener('change', function() {
    rowsPerPage = parseInt(this.value);
    currentPage = 1;
    showAssessmentTable();
});

document.getElementById('prev-page').addEventListener('click', function() {
    if (currentPage > 1) {
        currentPage--;
        showAssessmentTable();
    }
});

document.getElementById('next-page').addEventListener('click', function() {
    if (currentPage * rowsPerPage < currentData.length) {
        currentPage++;
        showAssessmentTable();
    }
});

function showAssessmentTable() {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Clear previous rows

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = currentData.slice(start, end);

    pageData.forEach(item => {
        const row = document.createElement('tr');

        const serviceCell = document.createElement('td');
        serviceCell.textContent = item.service;
        row.appendChild(serviceCell);

        const technologyCell = document.createElement('td');
        technologyCell.textContent = item.technology;
        row.appendChild(technologyCell);

        const activityCell = document.createElement('td');
        activityCell.textContent = item.activity;
        row.appendChild(activityCell);

        const skillCell = document.createElement('td');
        skillCell.textContent = item.skill;
        row.appendChild(skillCell);

        const scoreCell = document.createElement('td');
        const scoreSelect = document.createElement('select');
        ['Select', '0 - No Knowledge', '1 - Knowledgeable', '2 - Experienced', '3 - Expertise'].forEach(optionText => {
            const option = document.createElement('option');
            option.textContent = optionText;
            scoreSelect.appendChild(option);
        });
        scoreCell.appendChild(scoreSelect);
        row.appendChild(scoreCell);

        tableBody.appendChild(row);
    });

    document.getElementById('page-info').textContent = `Page ${currentPage} of ${Math.ceil(currentData.length / rowsPerPage)}`;
}

// Modal popup functionality
const modal = document.getElementById("myModal");
const btn = document.getElementById("quarter-scores");
const span = document.getElementsByClassName("close")[0];
const backBtn = document.getElementById("back-button");

btn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

backBtn.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
