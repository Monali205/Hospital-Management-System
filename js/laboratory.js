// Laboratory.js
let labTests = [];
let labReports = [];
let currentEditingTestId = null;

document.addEventListener('DOMContentLoaded', async function() {
    await loadLabData();
    setupEventListeners();
});

async function loadLabData() {
    try {
        const [testsRes, reportsRes] = await Promise.all([
            APIService.getAllLabTests(),
            APIService.getAllLabReports()
        ]);

        labTests = testsRes.data || [];
        labReports = reportsRes.data || [];

        displayLabTests(labTests);
        displayLabReports(labReports);
    } catch (error) {
        console.error('Error loading lab data:', error);
    }
}

function displayLabTests(testsToDisplay) {
    const testsList = document.getElementById('testsList');
    testsList.innerHTML = '';

    if (testsToDisplay.length === 0) {
        testsList.innerHTML = '<tr><td colspan="6" class="text-center">No lab tests found</td></tr>';
        return;
    }

    testsToDisplay.forEach(test => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${test.testName}</td>
            <td>${test.testCode}</td>
            <td>${test.category}</td>
            <td>${formatCurrency(test.cost)}</td>
            <td><span class="badge ${test.status === 'Active' ? 'badge-success' : 'badge-warning'}">${test.status}</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn-edit" onclick="editLabTest('${test._id}')">Edit</button>
                    <button class="btn-delete" onclick="deleteLabTest('${test._id}')">Delete</button>
                </div>
            </td>
        `;
        testsList.appendChild(row);
    });
}

function displayLabReports(reportsToDisplay) {
    const reportsList = document.getElementById('reportsList');
    reportsList.innerHTML = '';

    if (reportsToDisplay.length === 0) {
        reportsList.innerHTML = '<tr><td colspan="6" class="text-center">No lab reports found</td></tr>';
        return;
    }

    reportsToDisplay.forEach(report => {
        const row = document.createElement('tr');
        const patientName = report.patientId ? 
            `${report.patientId.firstName} ${report.patientId.lastName}` : 'Unknown';
        const testName = report.laboratoryTestId ? report.laboratoryTestId.testName : 'Unknown';

        row.innerHTML = `
            <td>${report.reportNumber}</td>
            <td>${patientName}</td>
            <td>${testName}</td>
            <td>${formatDate(report.reportDate)}</td>
            <td><span class="badge badge-${getStatusBadgeClass(report.status)}">${report.status}</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn-view" onclick="viewReport('${report._id}')">View</button>
                    <button class="btn-edit" onclick="editReport('${report._id}')">Edit</button>
                </div>
            </td>
        `;
        reportsList.appendChild(row);
    });
}

function setupEventListeners() {
    const addLabTestBtn = document.getElementById('addLabTestBtn');
    if (addLabTestBtn) {
        addLabTestBtn.addEventListener('click', openAddLabTestModal);
    }

    const closeLabTestModal = document.getElementById('closeLabTestModal');
    const cancelLabTestBtn = document.getElementById('cancelLabTestBtn');
    
    if (closeLabTestModal) {
        closeLabTestModal.addEventListener('click', () => closeModal('labTestModal'));
    }
    if (cancelLabTestBtn) {
        cancelLabTestBtn.addEventListener('click', () => closeModal('labTestModal'));
    }

    const labTestForm = document.getElementById('labTestForm');
    if (labTestForm) {
        labTestForm.addEventListener('submit', submitLabTestForm);
    }

    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', switchTab);
    });

    // Search and filter
    const searchLabTest = document.getElementById('searchLabTest');
    const categoryFilter = document.getElementById('categoryFilter');
    const searchLabReport = document.getElementById('searchLabReport');
    const reportStatusFilter = document.getElementById('reportStatusFilter');

    if (searchLabTest) searchLabTest.addEventListener('input', filterLabTests);
    if (categoryFilter) categoryFilter.addEventListener('change', filterLabTests);
    if (searchLabReport) searchLabReport.addEventListener('input', filterLabReports);
    if (reportStatusFilter) reportStatusFilter.addEventListener('change', filterLabReports);
}

function switchTab(e) {
    const tabBtn = e.target;
    const tabName = tabBtn.getAttribute('data-tab');

    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    tabBtn.classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

function openAddLabTestModal() {
    currentEditingTestId = null;
    clearLabTestForm();
    document.querySelector('#labTestModal .modal-header h2').textContent = 'Add Lab Test';
    openModal('labTestModal');
}

function clearLabTestForm() {
    document.getElementById('labTestForm').reset();
    currentEditingTestId = null;
}

async function editLabTest(id) {
    try {
        const response = await APIService.getLabTestById(id);
        const test = response.data;

        document.getElementById('testName').value = test.testName;
        document.getElementById('testCode').value = test.testCode;
        document.getElementById('category').value = test.category;
        document.getElementById('cost').value = test.cost;
        document.getElementById('description').value = test.description || '';

        currentEditingTestId = id;
        document.querySelector('#labTestModal .modal-header h2').textContent = 'Edit Lab Test';
        openModal('labTestModal');
    } catch (error) {
        showAlert('Error loading lab test', 'error');
    }
}

async function submitLabTestForm(e) {
    e.preventDefault();

    const testData = {
        testName: document.getElementById('testName').value,
        testCode: document.getElementById('testCode').value,
        category: document.getElementById('category').value,
        cost: document.getElementById('cost').value,
        description: document.getElementById('description').value
    };

    // Check for duplicate testCode (excluding current test if editing)
    const isDuplicate = labTests.some(test => 
        test.testCode === testData.testCode && test._id !== currentEditingTestId
    );

    if (isDuplicate) {
        showAlert(`Test code "${testData.testCode}" already exists. Please use a different code.`, 'error');
        return;
    }

    try {
        if (currentEditingTestId) {
            await APIService.updateLabTest(currentEditingTestId, testData);
            showAlert('Lab test updated successfully', 'success');
        } else {
            await APIService.createLabTest(testData);
            showAlert('Lab test created successfully', 'success');
        }

        closeModal('labTestModal');
        await loadLabData();
    } catch (error) {
        // Handle duplicate key error from backend
        if (error.response?.data?.message?.includes('E11000')) {
            showAlert('Test code already exists. Please use a different code.', 'error');
        } else {
            showAlert('Error saving lab test', 'error');
        }
    }
}

async function deleteLabTest(id) {
    if (confirm('Are you sure you want to delete this lab test?')) {
        try {
            await APIService.deleteLabTest(id);
            showAlert('Lab test deleted successfully', 'success');
            await loadLabData();
        } catch (error) {
            showAlert('Error deleting lab test', 'error');
        }
    }
}

async function viewReport(id) {
    try {
        const response = await APIService.updateLabReport(id, {});
        alert('Report viewed successfully');
    } catch (error) {
        showAlert('Error viewing report', 'error');
    }
}

async function editReport(id) {
    try {
        const response = await APIService.updateLabReport(id, {});
        showAlert('Report updated', 'success');
        await loadLabData();
    } catch (error) {
        showAlert('Error updating report', 'error');
    }
}

function filterLabTests() {
    const searchTerm = document.getElementById('searchLabTest').value.toLowerCase();
    const categoryTerm = document.getElementById('categoryFilter').value;

    const filtered = labTests.filter(test => {
        const matchesSearch = 
            test.testName.toLowerCase().includes(searchTerm) ||
            test.testCode.toLowerCase().includes(searchTerm);

        const matchesCategory = !categoryTerm || test.category === categoryTerm;

        return matchesSearch && matchesCategory;
    });

    displayLabTests(filtered);
}

function filterLabReports() {
    const searchTerm = document.getElementById('searchLabReport').value.toLowerCase();
    const statusTerm = document.getElementById('reportStatusFilter').value;

    const filtered = labReports.filter(report => {
        const patientName = report.patientId ? 
            `${report.patientId.firstName} ${report.patientId.lastName}`.toLowerCase() : '';
        
        const matchesSearch = 
            patientName.includes(searchTerm) ||
            report.reportNumber.toLowerCase().includes(searchTerm);

        const matchesStatus = !statusTerm || report.status === statusTerm;

        return matchesSearch && matchesStatus;
    });

    displayLabReports(filtered);
}

function getStatusBadgeClass(status) {
    const classes = {
        'Pending': 'warning',
        'Completed': 'success',
        'Approved': 'info',
        'Sent to Patient': 'success'
    };
    return classes[status] || 'secondary';
}
