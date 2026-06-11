// Patients.js
let patients = [];
let currentEditingPatientId = null;

document.addEventListener('DOMContentLoaded', async function() {
    await loadPatients();
    setupEventListeners();
});

async function loadPatients() {
    try {
        const response = await APIService.getAllPatients();
        patients = response.data || [];
        displayPatients(patients);
    } catch (error) {
        console.error('Error loading patients:', error);
    }
}

function displayPatients(patientsToDisplay) {
    const patientsList = document.getElementById('patientsList');
    patientsList.innerHTML = '';

    if (patientsToDisplay.length === 0) {
        patientsList.innerHTML = '<tr><td colspan="6" class="text-center">No patients found</td></tr>';
        return;
    }

    patientsToDisplay.forEach(patient => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.firstName} ${patient.lastName}</td>
            <td>${patient.email}</td>
            <td>${patient.phone}</td>
            <td><span class="badge badge-info">${patient.bloodType}</span></td>
            <td><span class="badge badge-${getStatusBadgeClass(patient.status)}">${patient.status}</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn-edit" onclick="editPatient('${patient._id}')">Edit</button>
                    <button class="btn-delete" onclick="deletePatient('${patient._id}')">Delete</button>
                </div>
            </td>
        `;
        patientsList.appendChild(row);
    });
}

function setupEventListeners() {
    // Add Patient Button
    const addPatientBtn = document.getElementById('addPatientBtn');
    if (addPatientBtn) {
        addPatientBtn.addEventListener('click', openAddPatientModal);
    }

    // Close Modal Buttons
    const closePatientModal = document.getElementById('closePatientModal');
    const cancelPatientBtn = document.getElementById('cancelPatientBtn');
    
    if (closePatientModal) {
        closePatientModal.addEventListener('click', () => closeModal('patientModal'));
    }
    if (cancelPatientBtn) {
        cancelPatientBtn.addEventListener('click', () => closeModal('patientModal'));
    }

    // Form Submission
    const patientForm = document.getElementById('patientForm');
    if (patientForm) {
        patientForm.addEventListener('submit', submitPatientForm);
    }

    // Search and Filter
    const searchPatient = document.getElementById('searchPatient');
    const statusFilter = document.getElementById('statusFilter');

    if (searchPatient) {
        searchPatient.addEventListener('input', filterPatients);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', filterPatients);
    }
}

function openAddPatientModal() {
    currentEditingPatientId = null;
    clearPatientForm();
    document.getElementById('modalTitle').textContent = 'Add Patient';
    openModal('patientModal');
}

function clearPatientForm() {
    document.getElementById('patientForm').reset();
    currentEditingPatientId = null;
}

async function editPatient(id) {
    try {
        const response = await APIService.getPatientById(id);
        const patient = response.data;

        document.getElementById('firstName').value = patient.firstName;
        document.getElementById('lastName').value = patient.lastName;
        document.getElementById('email').value = patient.email;
        document.getElementById('phone').value = patient.phone;
        document.getElementById('dob').value = patient.dateOfBirth?.split('T')[0] || '';
        document.getElementById('gender').value = patient.gender;
        document.getElementById('bloodType').value = patient.bloodType;
        document.getElementById('address').value = patient.address?.street || '';

        currentEditingPatientId = id;
        document.getElementById('modalTitle').textContent = 'Edit Patient';
        openModal('patientModal');
    } catch (error) {
        showAlert('Error loading patient data', 'error');
    }
}

async function submitPatientForm(e) {
    e.preventDefault();

    const patientData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        dateOfBirth: document.getElementById('dob').value,
        gender: document.getElementById('gender').value,
        bloodType: document.getElementById('bloodType').value,
        address: {
            street: document.getElementById('address').value
        }
    };

    try {
        if (currentEditingPatientId) {
            await APIService.updatePatient(currentEditingPatientId, patientData);
            showAlert('Patient updated successfully', 'success');
        } else {
            await APIService.createPatient(patientData);
            showAlert('Patient created successfully', 'success');
        }

        closeModal('patientModal');
        await loadPatients();
    } catch (error) {
        showAlert('Error saving patient', 'error');
    }
}

async function deletePatient(id) {
    if (confirm('Are you sure you want to delete this patient?')) {
        try {
            await APIService.deletePatient(id);
            showAlert('Patient deleted successfully', 'success');
            await loadPatients();
        } catch (error) {
            showAlert('Error deleting patient', 'error');
        }
    }
}

function filterPatients() {
    const searchTerm = document.getElementById('searchPatient').value.toLowerCase();
    const statusTerm = document.getElementById('statusFilter').value;

    const filtered = patients.filter(patient => {
        const matchesSearch = 
            patient.firstName.toLowerCase().includes(searchTerm) ||
            patient.lastName.toLowerCase().includes(searchTerm) ||
            patient.email.toLowerCase().includes(searchTerm) ||
            patient.phone.includes(searchTerm);

        const matchesStatus = !statusTerm || patient.status === statusTerm;

        return matchesSearch && matchesStatus;
    });

    displayPatients(filtered);
}

function getStatusBadgeClass(status) {
    const classes = {
        'Active': 'success',
        'Inactive': 'warning',
        'Discharged': 'danger'
    };
    return classes[status] || 'info';
}
