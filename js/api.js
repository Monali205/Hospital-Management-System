// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// API Service Class
class APIService {
    static async request(endpoint, method = 'GET', data = null) {
        const url = `${API_BASE_URL}${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request Error:', error);
            showAlert('Error: ' + error.message, 'error');
            throw error;
        }
    }

    // Patients
    static async createPatient(patientData) {
        return this.request('/patients/create', 'POST', patientData);
    }

    static async getAllPatients() {
        return this.request('/patients/all', 'GET');
    }

    static async getPatientById(id) {
        return this.request(`/patients/${id}`, 'GET');
    }

    static async updatePatient(id, patientData) {
        return this.request(`/patients/update/${id}`, 'PUT', patientData);
    }

    static async deletePatient(id) {
        return this.request(`/patients/delete/${id}`, 'DELETE');
    }

    static async searchPatients(query) {
        return this.request(`/patients/search?search=${query}`, 'GET');
    }

    // Doctors
    static async createDoctor(doctorData) {
        return this.request('/doctors/create', 'POST', doctorData);
    }

    static async getAllDoctors() {
        return this.request('/doctors/all', 'GET');
    }

    static async getDoctorById(id) {
        return this.request(`/doctors/${id}`, 'GET');
    }

    static async updateDoctor(id, doctorData) {
        return this.request(`/doctors/update/${id}`, 'PUT', doctorData);
    }

    static async deleteDoctor(id) {
        return this.request(`/doctors/delete/${id}`, 'DELETE');
    }

    static async getDoctorsBySpecialization(specialization) {
        return this.request(`/doctors/specialization/${specialization}`, 'GET');
    }

    // Medicines
    static async createMedicine(medicineData) {
        return this.request('/medicines/create', 'POST', medicineData);
    }

    static async getAllMedicines() {
        return this.request('/medicines/all', 'GET');
    }

    static async getMedicineById(id) {
        return this.request(`/medicines/${id}`, 'GET');
    }

    static async updateMedicine(id, medicineData) {
        return this.request(`/medicines/update/${id}`, 'PUT', medicineData);
    }

    static async deleteMedicine(id) {
        return this.request(`/medicines/delete/${id}`, 'DELETE');
    }

    static async searchMedicines(query) {
        return this.request(`/medicines/search?search=${query}`, 'GET');
    }

    static async getMedicinesByCategory(category) {
        return this.request(`/medicines/category/${category}`, 'GET');
    }

    static async updateMedicineStock(id, quantity) {
        return this.request(`/medicines/stock/${id}`, 'PUT', { quantity });
    }

    // Billing
    static async createBilling(billingData) {
        return this.request('/billing/create', 'POST', billingData);
    }

    static async getAllBillings() {
        return this.request('/billing/all', 'GET');
    }

    static async getBillingById(id) {
        return this.request(`/billing/${id}`, 'GET');
    }

    static async updateBilling(id, billingData) {
        return this.request(`/billing/update/${id}`, 'PUT', billingData);
    }

    static async deleteBilling(id) {
        return this.request(`/billing/delete/${id}`, 'DELETE');
    }

    static async updatePaymentStatus(id, paymentData) {
        return this.request(`/billing/payment/${id}`, 'PUT', paymentData);
    }

    static async getBillingsByPatient(patientId) {
        return this.request(`/billing/patient/${patientId}`, 'GET');
    }

    static async getBillingStats() {
        return this.request('/billing/stats', 'GET');
    }

    // Laboratory
    static async createLabTest(testData) {
        return this.request('/laboratory/test/create', 'POST', testData);
    }

    static async getAllLabTests() {
        return this.request('/laboratory/test/all', 'GET');
    }

    static async getLabTestById(id) {
        return this.request(`/laboratory/test/${id}`, 'GET');
    }

    static async updateLabTest(id, testData) {
        return this.request(`/laboratory/test/update/${id}`, 'PUT', testData);
    }

    static async deleteLabTest(id) {
        return this.request(`/laboratory/test/delete/${id}`, 'DELETE');
    }

    static async getLabTestsByCategory(category) {
        return this.request(`/laboratory/test/category/${category}`, 'GET');
    }

    static async createLabReport(reportData) {
        return this.request('/laboratory/report/create', 'POST', reportData);
    }

    static async getAllLabReports() {
        return this.request('/laboratory/report/all', 'GET');
    }

    static async getLabReportsByPatient(patientId) {
        return this.request(`/laboratory/report/patient/${patientId}`, 'GET');
    }

    static async updateLabReport(id, reportData) {
        return this.request(`/laboratory/report/update/${id}`, 'PUT', reportData);
    }

    // Pharmacy
    static async createPrescription(prescriptionData) {
        return this.request('/pharmacy/create', 'POST', prescriptionData);
    }

    static async getAllPrescriptions() {
        return this.request('/pharmacy/all', 'GET');
    }

    static async getPrescriptionById(id) {
        return this.request(`/pharmacy/${id}`, 'GET');
    }

    static async updatePrescription(id, prescriptionData) {
        return this.request(`/pharmacy/update/${id}`, 'PUT', prescriptionData);
    }

    static async deletePrescription(id) {
        return this.request(`/pharmacy/delete/${id}`, 'DELETE');
    }

    static async getPrescriptionsByPatient(patientId) {
        return this.request(`/pharmacy/patient/${patientId}`, 'GET');
    }

    static async dispensePrescription(id, dispensedBy) {
        return this.request(`/pharmacy/dispense/${id}`, 'PUT', { dispensedBy });
    }

    static async getPendingPrescriptions() {
        return this.request('/pharmacy/pending', 'GET');
    }
}

// Utility Functions
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.insertBefore(alertDiv, document.body.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

function navigateTo(page) {
    window.location.href = page;
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

// Sidebar Toggle
document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }

    // Close sidebar on mobile when clicking a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });

    // Set active nav link
    navLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('active');
        }
    });
});

// Modal Close Button Handlers (Generic)
document.addEventListener('DOMContentLoaded', function() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.close-btn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.classList.remove('active');
            });
        }

        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
});
