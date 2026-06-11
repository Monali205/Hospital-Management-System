// Dashboard.js
let currentPatientId = null;

document.addEventListener('DOMContentLoaded', async function() {
    loadDashboardStats();
    setupEventListeners();
});

async function loadDashboardStats() {
    try {
        // Load total counts
        const patientsRes = await APIService.getAllPatients();
        const doctorsRes = await APIService.getAllDoctors();
        const medicinesRes = await APIService.getAllMedicines();
        const billingRes = await APIService.getAllBillings();

        document.getElementById('totalPatients').textContent = patientsRes.data?.length || 0;
        document.getElementById('totalDoctors').textContent = doctorsRes.data?.length || 0;
        document.getElementById('totalMedicines').textContent = medicinesRes.data?.length || 0;

        // Calculate total revenue
        const totalRevenue = billingRes.data?.reduce((sum, bill) => sum + (bill.paidAmount || 0), 0) || 0;
        document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);

        // Populate activity list
        populateActivityList(patientsRes.data || []);

    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

function populateActivityList(patients) {
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = '';

    if (patients.length === 0) {
        activityList.innerHTML = '<p class="no-data">No recent activities</p>';
        return;
    }

    patients.slice(0, 8).forEach(patient => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="fas fa-user"></i>
            </div>
            <div class="activity-content">
                <p><strong>New Patient:</strong> ${patient.firstName} ${patient.lastName}</p>
                <p>Blood Type: ${patient.bloodType}</p>
            </div>
            <div class="activity-time">${formatDate(patient.registrationDate)}</div>
        `;
        activityList.appendChild(activityItem);
    });
}

function setupEventListeners() {
    // Event listeners can be added here if needed
}
