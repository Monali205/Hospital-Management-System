// Pharmacy.js
let prescriptions = [];
let patients = [];
let medicines = [];
let doctors = [];
let currentEditingPrescriptionId = null;

document.addEventListener('DOMContentLoaded', async function() {
    await loadData();
    setupEventListeners();
});

async function loadData() {
    try {
        const [prescriptionsRes, patientsRes, doctorsRes, medicinesRes] = await Promise.all([
            APIService.getAllPrescriptions(),
            APIService.getAllPatients(),
            APIService.getAllDoctors(),
            APIService.getAllMedicines()
        ]);

        prescriptions = prescriptionsRes.data || [];
        patients = patientsRes.data || [];
        doctors = doctorsRes.data || [];
        medicines = medicinesRes.data || [];

        displayPrescriptions(prescriptions);
        populateSelects();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function displayPrescriptions(prescriptionsToDisplay) {
    const prescriptionsList = document.getElementById('prescriptionsList');
    prescriptionsList.innerHTML = '';

    if (prescriptionsToDisplay.length === 0) {
        prescriptionsList.innerHTML = '<tr><td colspan="6" class="text-center">No prescriptions found</td></tr>';
        return;
    }

    prescriptionsToDisplay.forEach(prescription => {
        const row = document.createElement('tr');
        const patientName = prescription.patientId ? 
            `${prescription.patientId.firstName} ${prescription.patientId.lastName}` : 'Unknown';
        const doctorName = prescription.doctorId ? 
            `${prescription.doctorId.firstName} ${prescription.doctorId.lastName}` : 'Unknown';

        row.innerHTML = `
            <td>${prescription.prescriptionNumber}</td>
            <td>${patientName}</td>
            <td>${doctorName}</td>
            <td>${formatDate(prescription.prescriptionDate)}</td>
            <td><span class="badge badge-${getStatusBadgeClass(prescription.status)}">${prescription.status}</span></td>
            <td><span title="${prescription.diagnosis}">${prescription.diagnosis?.substring(0, 30)}${prescription.diagnosis?.length > 30 ? '...' : ''}</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn-view" onclick="viewPrescription('${prescription._id}')">View</button>
                    <button class="btn-edit" onclick="editPrescription('${prescription._id}')">Edit</button>
                    <button class="btn-delete" onclick="deletePrescription('${prescription._id}')">Delete</button>
                </div>
            </td>
        `;
        prescriptionsList.appendChild(row);
    });
}

function setupEventListeners() {
    const addPrescriptionBtn = document.getElementById('addPrescriptionBtn');
    if (addPrescriptionBtn) {
        addPrescriptionBtn.addEventListener('click', openAddPrescriptionModal);
    }

    const closePrescriptionModal = document.getElementById('closePrescriptionModal');
    const cancelPrescriptionBtn = document.getElementById('cancelPrescriptionBtn');
    const closePrescriptionDetailModal = document.getElementById('closePrescriptionDetailModal');
    const closeDetailBtn = document.getElementById('closeDetailBtn');
    
    if (closePrescriptionModal) {
        closePrescriptionModal.addEventListener('click', () => closeModal('prescriptionModal'));
    }
    if (cancelPrescriptionBtn) {
        cancelPrescriptionBtn.addEventListener('click', () => closeModal('prescriptionModal'));
    }
    if (closePrescriptionDetailModal) {
        closePrescriptionDetailModal.addEventListener('click', () => closeModal('prescriptionDetailModal'));
    }
    if (closeDetailBtn) {
        closeDetailBtn.addEventListener('click', () => closeModal('prescriptionDetailModal'));
    }

    const prescriptionForm = document.getElementById('prescriptionForm');
    if (prescriptionForm) {
        prescriptionForm.addEventListener('submit', submitPrescriptionForm);
    }

    const addMedicineToRx = document.getElementById('addMedicineToRx');
    if (addMedicineToRx) {
        addMedicineToRx.addEventListener('click', addMedicineRow);
    }

    const searchPrescription = document.getElementById('searchPrescription');
    const statusFilter = document.getElementById('statusFilter');

    if (searchPrescription) {
        searchPrescription.addEventListener('input', filterPrescriptions);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', filterPrescriptions);
    }
}

function populateSelects() {
    const patientSelect = document.getElementById('patientId');
    const doctorSelect = document.getElementById('doctorId');
    const medicineSelects = document.querySelectorAll('.medicine-select');

    if (patientSelect) {
        patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient._id;
            option.textContent = `${patient.firstName} ${patient.lastName}`;
            patientSelect.appendChild(option);
        });
    }

    if (doctorSelect) {
        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor._id;
            option.textContent = `${doctor.firstName} ${doctor.lastName}`;
            doctorSelect.appendChild(option);
        });
    }

    medicineSelects.forEach(select => {
        medicines.forEach(medicine => {
            const option = document.createElement('option');
            option.value = medicine._id;
            option.textContent = `${medicine.name} - ${medicine.dosage}`;
            select.appendChild(option);
        });
    });
}

function openAddPrescriptionModal() {
    currentEditingPrescriptionId = null;
    clearPrescriptionForm();
    document.getElementById('modalTitle').textContent = 'New Prescription';
    openModal('prescriptionModal');
}

function clearPrescriptionForm() {
    document.getElementById('prescriptionForm').reset();
    currentEditingPrescriptionId = null;
    
    // Generate prescription number if it's a new prescription
    const prescNumber = 'RX-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    document.getElementById('prescriptionNumber').value = prescNumber;
    
    const medicinesContainer = document.getElementById('medicinesContainer');
    medicinesContainer.innerHTML = `
        <div class="medicine-item">
            <select class="medicine-select" required>
                <option value="">Select Medicine</option>
            </select>
            <input type="text" placeholder="Dosage" class="medicine-dosage" required>
            <select class="medicine-frequency" required>
                <option value="">Frequency</option>
                <option value="Once daily">Once daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Thrice daily">Thrice daily</option>
            </select>
            <input type="text" placeholder="Duration" class="medicine-duration" required>
            <button type="button" class="btn-remove-medicine">Remove</button>
        </div>
    `;
    updateMedicineSelect();
}

function addMedicineRow() {
    const medicinesContainer = document.getElementById('medicinesContainer');
    const medicineItem = document.createElement('div');
    medicineItem.className = 'medicine-item';
    medicineItem.innerHTML = `
        <select class="medicine-select" required>
            <option value="">Select Medicine</option>
        </select>
        <input type="text" placeholder="Dosage" class="medicine-dosage" required>
        <select class="medicine-frequency" required>
            <option value="">Frequency</option>
            <option value="Once daily">Once daily</option>
            <option value="Twice daily">Twice daily</option>
            <option value="Thrice daily">Thrice daily</option>
        </select>
        <input type="text" placeholder="Duration" class="medicine-duration" required>
        <button type="button" class="btn-remove-medicine">Remove</button>
    `;

    medicineItem.querySelector('.btn-remove-medicine').addEventListener('click', function() {
        medicineItem.remove();
    });

    medicinesContainer.appendChild(medicineItem);
    updateMedicineSelect();
}

function updateMedicineSelect() {
    const medicineSelects = document.querySelectorAll('.medicine-select');
    medicineSelects.forEach(select => {
        select.innerHTML = '<option value="">Select Medicine</option>';
        medicines.forEach(medicine => {
            const option = document.createElement('option');
            option.value = medicine._id;
            option.textContent = `${medicine.name} - ${medicine.dosage}`;
            select.appendChild(option);
        });
    });
}

async function submitPrescriptionForm(e) {
    e.preventDefault();

    const medicineItems = document.querySelectorAll('.medicine-item');
    const medicines_list = [];

    medicineItems.forEach(item => {
        medicines_list.push({
            medicineId: item.querySelector('.medicine-select').value,
            dosage: item.querySelector('.medicine-dosage').value,
            frequency: item.querySelector('.medicine-frequency').value,
            duration: item.querySelector('.medicine-duration').value
        });
    });

    const prescriptionData = {
        prescriptionNumber: document.getElementById('prescriptionNumber').value,
        patientId: document.getElementById('patientId').value,
        doctorId: document.getElementById('doctorId').value,
        diagnosis: document.getElementById('diagnosis').value,
        medicines: medicines_list
    };

    try {
        if (currentEditingPrescriptionId) {
            await APIService.updatePrescription(currentEditingPrescriptionId, prescriptionData);
            showAlert('Prescription updated successfully', 'success');
        } else {
            await APIService.createPrescription(prescriptionData);
            showAlert('Prescription created successfully', 'success');
        }

        closeModal('prescriptionModal');
        await loadData();
    } catch (error) {
        showAlert('Error saving prescription', 'error');
    }
}

async function editPrescription(id) {
    try {
        const response = await APIService.getPrescriptionById(id);
        const prescription = response.data;

        document.getElementById('prescriptionNumber').value = prescription.prescriptionNumber;
        document.getElementById('patientId').value = prescription.patientId._id;
        document.getElementById('doctorId').value = prescription.doctorId._id;
        document.getElementById('diagnosis').value = prescription.diagnosis;

        currentEditingPrescriptionId = id;
        document.getElementById('modalTitle').textContent = 'Edit Prescription';
        openModal('prescriptionModal');
    } catch (error) {
        showAlert('Error loading prescription', 'error');
    }
}

async function viewPrescription(id) {
    try {
        const response = await APIService.getPrescriptionById(id);
        const prescription = response.data;

        // Populate detail modal
        const patientName = prescription.patientId ? 
            `${prescription.patientId.firstName} ${prescription.patientId.lastName}` : 'Unknown';
        const doctorName = prescription.doctorId ? 
            `${prescription.doctorId.firstName} ${prescription.doctorId.lastName}` : 'Unknown';

        document.getElementById('detailPatientName').textContent = patientName;
        document.getElementById('detailDoctorName').textContent = doctorName;
        document.getElementById('detailDiagnosis').textContent = prescription.diagnosis || '-';
        document.getElementById('detailStatus').textContent = prescription.status || '-';
        document.getElementById('detailDate').textContent = formatDate(prescription.prescriptionDate) || '-';

        // Display medicines
        const medicinesList = document.getElementById('medicinesDetailList');
        medicinesList.innerHTML = '';

        if (prescription.medicines && prescription.medicines.length > 0) {
            prescription.medicines.forEach(med => {
                const div = document.createElement('div');
                div.className = 'medicine-detail-item';
                div.innerHTML = `
                    <h4>${med.medicineId?.name || 'Unknown Medicine'}</h4>
                    <p><strong>Dosage:</strong> ${med.dosage}</p>
                    <p><strong>Frequency:</strong> ${med.frequency}</p>
                    <p><strong>Duration:</strong> ${med.duration}</p>
                `;
                medicinesList.appendChild(div);
            });
        } else {
            medicinesList.innerHTML = '<p class="no-data">No medicines in this prescription</p>';
        }

        // Setup edit button
        document.getElementById('editPrescriptionBtn').onclick = () => {
            editPrescription(id);
            closeModal('prescriptionDetailModal');
        };

        openModal('prescriptionDetailModal');
    } catch (error) {
        showAlert('Error loading prescription details', 'error');
    }
}

async function deletePrescription(id) {
    if (confirm('Are you sure you want to delete this prescription?')) {
        try {
            await APIService.deletePrescription(id);
            showAlert('Prescription deleted successfully', 'success');
            await loadData();
        } catch (error) {
            showAlert('Error deleting prescription', 'error');
        }
    }
}

function filterPrescriptions() {
    const searchTerm = document.getElementById('searchPrescription').value.toLowerCase();
    const statusTerm = document.getElementById('statusFilter').value;

    const filtered = prescriptions.filter(prescription => {
        const patientName = prescription.patientId ? 
            `${prescription.patientId.firstName} ${prescription.patientId.lastName}`.toLowerCase() : '';
        
        const matchesSearch = 
            patientName.includes(searchTerm) ||
            prescription.prescriptionNumber.toLowerCase().includes(searchTerm);

        const matchesStatus = !statusTerm || prescription.status === statusTerm;

        return matchesSearch && matchesStatus;
    });

    displayPrescriptions(filtered);
}

function getStatusBadgeClass(status) {
    const classes = {
        'Pending': 'warning',
        'Dispensed': 'success',
        'Partial': 'info',
        'Cancelled': 'danger'
    };
    return classes[status] || 'secondary';
}
