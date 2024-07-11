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

    document.getElementById('home-link').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `dashboard.html?employeeId=${employeeId}`;
    });

    document.getElementById('assess-update-link').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `assess_my_score.html?employeeId=${employeeId}`;
    });

    document.getElementById('employee-update-link').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `employeedata.html?employeeId=${employeeId}`;
    });

    document.getElementById('logout-link').addEventListener('click', (e) => {
        e.preventDefault();
        logout(employeeId);
    });
});

async function fetchEmployeeData(employeeId) {
    const response = await fetch(`https://authentication-app-f6337-default-rtdb.firebaseio.com/users.json`);
    const users = await response.json();
    for (let id in users) {
        if (users[id].employeeId === employeeId) {
            return users[id];
        }
    }
    return null;
}

function updateForm(employeeData) {
    document.getElementById('employee-name').innerText = employeeData.name;
    document.getElementById('employee-role').innerText = `(${employeeData.role})`;
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

function logout(employeeId) {
    // Assuming a logout function that handles the logout process
    alert("Logged out");
    window.location.href = `index.html?employeeId=${employeeId}`;
}

function exportToExcel() {
    let table = document.getElementById('resource-table');
    let workbook = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
    XLSX.writeFile(workbook, 'resource_details.xlsx');
}

function updateTable() {
    const selectedYear = document.getElementById('select-year').value;
    const selectedQuarter = document.getElementById('select-quarter').value;
    const tbody = document.getElementById('resource-tbody');
    const rows = tbody.getElementsByTagName('tr');

    for (let row of rows) {
        const rowYear = row.getAttribute('data-year');
        const rowQuarter = row.getAttribute('data-quarter');
        if (rowYear === selectedYear && rowQuarter === selectedQuarter) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }
}
