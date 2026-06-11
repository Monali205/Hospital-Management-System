// Doctors.js
let doctors = [];
let currentEditingDoctorId = null;

document.addEventListener('DOMContentLoaded', async function() {
    await loadDoctors();
    setupEventListeners();
});

async function loadDoctors() {
    try {
        const response = await APIService.getAllDoctors();
        doctors = response.data || [];
        displayDoctors(doctors);
    } catch (error) {
        console.error('Error loading doctors:', error);
    }
}

function displayDoctors(doctorsToDisplay) {
    const doctorsList = document.getElementById('doctorsList');
    doctorsList.innerHTML = '';

    if (doctorsToDisplay.length === 0) {
        doctorsList.innerHTML = '<p class="no-data">No doctors found</p>';
        return;
    }

    doctorsToDisplay.forEach(doctor => {
        const doctorCard = document.createElement('div');
        doctorCard.className = 'doctor-card';
        doctorCard.innerHTML = `
            <div class="doctor-card-header"></div>
            <img src="https://via.placeholder.com/100?text=${doctor.firstName[0]}${doctor.lastName[0]}" 
                 class="doctor-card-photo" alt="Doctor Photo">
            <div class="doctor-card-body">
                <h3>${doctor.firstName} ${doctor.lastName}</h3>
                <p>${doctor.specialization}</p>
                <p style="font-size: 0.85rem; color: #6b7280;">License: ${doctor.licenseNumber}</p>
                <p style="font-size: 0.85rem; color: #6b7280;">Fee: $${doctor.consultationFee}</p>
            </div>
            <div class="doctor-card-footer">
                <button class="btn-edit btn btn-primary" onclick="editDoctor('${doctor._id}')">Edit</button>
                <button class="btn-delete btn btn-danger" onclick="deleteDoctor('${doctor._id}')">Delete</button>
            </div>
        `;
        doctorsList.appendChild(doctorCard);
    });
}

function setupEventListeners() {
    const addDoctorBtn = document.getElementById('addDoctorBtn');
    if (addDoctorBtn) {
        addDoctorBtn.addEventListener('click', openAddDoctorModal);
    }

    const closeDoctorModal = document.getElementById('closeDoctorModal');
    const cancelDoctorBtn = document.getElementById('cancelDoctorBtn');
    
    if (closeDoctorModal) {
        closeDoctorModal.addEventListener('click', () => closeModal('doctorModal'));
    }
    if (cancelDoctorBtn) {
        cancelDoctorBtn.addEventListener('click', () => closeModal('doctorModal'));
    }

    const doctorForm = document.getElementById('doctorForm');
    if (doctorForm) {
        doctorForm.addEventListener('submit', submitDoctorForm);
    }

    const searchDoctor = document.getElementById('searchDoctor');
    const specializationFilter = document.getElementById('specializationFilter');

    if (searchDoctor) {
        searchDoctor.addEventListener('input', filterDoctors);
    }
    if (specializationFilter) {
        specializationFilter.addEventListener('change', filterDoctors);
    }
}

function openAddDoctorModal() {
    currentEditingDoctorId = null;
    clearDoctorForm();
    document.getElementById('modalTitle').textContent = 'Add Doctor';
    openModal('doctorModal');
}

function clearDoctorForm() {
    document.getElementById('doctorForm').reset();
    currentEditingDoctorId = null;
}

async function editDoctor(id) {
    try {
        const response = await APIService.getDoctorById(id);
        const doctor = response.data;

        document.getElementById('doctorFirstName').value = doctor.firstName;
        document.getElementById('doctorLastName').value = doctor.lastName;
        document.getElementById('doctorEmail').value = doctor.email;
        document.getElementById('doctorPhone').value = doctor.phone;
        document.getElementById('specialization').value = doctor.specialization;
        document.getElementById('licenseNumber').value = doctor.licenseNumber;
        document.getElementById('experience').value = doctor.experience;
        document.getElementById('consultationFee').value = doctor.consultationFee;

        currentEditingDoctorId = id;
        document.getElementById('modalTitle').textContent = 'Edit Doctor';
        openModal('doctorModal');
    } catch (error) {
        showAlert('Error loading doctor data', 'error');
    }
}

async function submitDoctorForm(e) {
    e.preventDefault();

    const doctorData = {
        firstName: document.getElementById('doctorFirstName').value,
        lastName: document.getElementById('doctorLastName').value,
        email: document.getElementById('doctorEmail').value,
        phone: document.getElementById('doctorPhone').value,
        specialization: document.getElementById('specialization').value,
        licenseNumber: document.getElementById('licenseNumber').value,
        experience: document.getElementById('experience').value,
        consultationFee: document.getElementById('consultationFee').value
    };

    try {
        if (currentEditingDoctorId) {
            await APIService.updateDoctor(currentEditingDoctorId, doctorData);
            showAlert('Doctor updated successfully', 'success');
        } else {
            await APIService.createDoctor(doctorData);
            showAlert('Doctor created successfully', 'success');
        }

        closeModal('doctorModal');
        await loadDoctors();
    } catch (error) {
        showAlert('Error saving doctor', 'error');
    }
}

async function deleteDoctor(id) {
    if (confirm('Are you sure you want to delete this doctor?')) {
        try {
            await APIService.deleteDoctor(id);
            showAlert('Doctor deleted successfully', 'success');
            await loadDoctors();
        } catch (error) {
            showAlert('Error deleting doctor', 'error');
        }
    }
}

function filterDoctors() {
    const searchTerm = document.getElementById('searchDoctor').value.toLowerCase();
    const specializationTerm = document.getElementById('specializationFilter').value;

    const filtered = doctors.filter(doctor => {
        const matchesSearch = 
            doctor.firstName.toLowerCase().includes(searchTerm) ||
            doctor.lastName.toLowerCase().includes(searchTerm) ||
            doctor.email.toLowerCase().includes(searchTerm);

        const matchesSpecialization = !specializationTerm || doctor.specialization === specializationTerm;

        return matchesSearch && matchesSpecialization;
    });

    displayDoctors(filtered);
}
