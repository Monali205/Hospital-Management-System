// Medicines.js
let medicines = [];
let currentEditingMedicineId = null;

document.addEventListener('DOMContentLoaded', async function() {
    await loadMedicines();
    setupEventListeners();
});

async function loadMedicines() {
    try {
        const response = await APIService.getAllMedicines();
        medicines = response.data || [];
        displayMedicines(medicines);
    } catch (error) {
        console.error('Error loading medicines:', error);
    }
}

function displayMedicines(medicinesToDisplay) {
    const medicinesList = document.getElementById('medicinesList');
    medicinesList.innerHTML = '';

    if (medicinesToDisplay.length === 0) {
        medicinesList.innerHTML = '<tr><td colspan="7" class="text-center">No medicines found</td></tr>';
        return;
    }

    medicinesToDisplay.forEach(medicine => {
        const expiryDate = new Date(medicine.expiryDate);
        const isExpired = expiryDate < new Date();
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${medicine.name}</td>
            <td>${medicine.generic_name}</td>
            <td>${medicine.category}</td>
            <td>${formatCurrency(medicine.price)}</td>
            <td><span class="badge ${medicine.quantity < 10 ? 'badge-warning' : 'badge-success'}">${medicine.quantity}</span></td>
            <td>${formatDate(medicine.expiryDate)} ${isExpired ? '<span class="badge badge-danger">Expired</span>' : ''}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-edit" onclick="editMedicine('${medicine._id}')">Edit</button>
                    <button class="btn-delete" onclick="deleteMedicine('${medicine._id}')">Delete</button>
                </div>
            </td>
        `;
        medicinesList.appendChild(row);
    });
}

function setupEventListeners() {
    const addMedicineBtn = document.getElementById('addMedicineBtn');
    if (addMedicineBtn) {
        addMedicineBtn.addEventListener('click', openAddMedicineModal);
    }

    const closeMedicineModal = document.getElementById('closeMedicineModal');
    const cancelMedicineBtn = document.getElementById('cancelMedicineBtn');
    
    if (closeMedicineModal) {
        closeMedicineModal.addEventListener('click', () => closeModal('medicineModal'));
    }
    if (cancelMedicineBtn) {
        cancelMedicineBtn.addEventListener('click', () => closeModal('medicineModal'));
    }

    const medicineForm = document.getElementById('medicineForm');
    if (medicineForm) {
        medicineForm.addEventListener('submit', submitMedicineForm);
    }

    const searchMedicine = document.getElementById('searchMedicine');
    const categoryFilter = document.getElementById('categoryFilter');

    if (searchMedicine) {
        searchMedicine.addEventListener('input', filterMedicines);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterMedicines);
    }
}

function openAddMedicineModal() {
    currentEditingMedicineId = null;
    clearMedicineForm();
    document.getElementById('modalTitle').textContent = 'Add Medicine';
    openModal('medicineModal');
}

function clearMedicineForm() {
    document.getElementById('medicineForm').reset();
    currentEditingMedicineId = null;
}

async function editMedicine(id) {
    try {
        const response = await APIService.getMedicineById(id);
        const medicine = response.data;

        document.getElementById('medicineName').value = medicine.name;
        document.getElementById('genericName').value = medicine.generic_name;
        document.getElementById('manufacturer').value = medicine.manufacturer;
        document.getElementById('category').value = medicine.category;
        document.getElementById('dosage').value = medicine.dosage;
        document.getElementById('batchNumber').value = medicine.batchNumber || '';
        document.getElementById('price').value = medicine.price;
        document.getElementById('quantity').value = medicine.quantity;
        document.getElementById('expiryDate').value = medicine.expiryDate?.split('T')[0] || '';

        currentEditingMedicineId = id;
        document.getElementById('modalTitle').textContent = 'Edit Medicine';
        openModal('medicineModal');
    } catch (error) {
        showAlert('Error loading medicine data', 'error');
    }
}

async function submitMedicineForm(e) {
    e.preventDefault();

    const medicineData = {
        name: document.getElementById('medicineName').value,
        generic_name: document.getElementById('genericName').value,
        manufacturer: document.getElementById('manufacturer').value,
        category: document.getElementById('category').value,
        dosage: document.getElementById('dosage').value,
        batchNumber: document.getElementById('batchNumber').value,
        price: document.getElementById('price').value,
        quantity: document.getElementById('quantity').value,
        expiryDate: document.getElementById('expiryDate').value
    };

    try {
        if (currentEditingMedicineId) {
            await APIService.updateMedicine(currentEditingMedicineId, medicineData);
            showAlert('Medicine updated successfully', 'success');
        } else {
            await APIService.createMedicine(medicineData);
            showAlert('Medicine created successfully', 'success');
        }

        closeModal('medicineModal');
        await loadMedicines();
    } catch (error) {
        showAlert('Error saving medicine', 'error');
    }
}

async function deleteMedicine(id) {
    if (confirm('Are you sure you want to delete this medicine?')) {
        try {
            await APIService.deleteMedicine(id);
            showAlert('Medicine deleted successfully', 'success');
            await loadMedicines();
        } catch (error) {
            showAlert('Error deleting medicine', 'error');
        }
    }
}

function filterMedicines() {
    const searchTerm = document.getElementById('searchMedicine').value.toLowerCase();
    const categoryTerm = document.getElementById('categoryFilter').value;

    const filtered = medicines.filter(medicine => {
        const matchesSearch = 
            medicine.name.toLowerCase().includes(searchTerm) ||
            medicine.generic_name.toLowerCase().includes(searchTerm) ||
            medicine.manufacturer.toLowerCase().includes(searchTerm);

        const matchesCategory = !categoryTerm || medicine.category === categoryTerm;

        return matchesSearch && matchesCategory;
    });

    displayMedicines(filtered);
}
