// Billing.js
let billings = [];
let patients = [];
let doctors = [];
let currentEditingBillingId = null;

document.addEventListener('DOMContentLoaded', async function() {
    await loadBillingData();
    setupEventListeners();
});

async function loadBillingData() {
    try {
        const [billingsRes, patientsRes, doctorsRes] = await Promise.all([
            APIService.getAllBillings(),
            APIService.getAllPatients(),
            APIService.getAllDoctors()
        ]);

        billings = billingsRes.data || [];
        patients = patientsRes.data || [];
        doctors = doctorsRes.data || [];

        displayBillings(billings);
        populateBillingSelects();
    } catch (error) {
        console.error('Error loading billing data:', error);
    }
}

function displayBillings(billingsToDisplay) {
    const billsList = document.getElementById('billsList');
    billsList.innerHTML = '';

    if (billingsToDisplay.length === 0) {
        billsList.innerHTML = '<tr><td colspan="7" class="text-center">No bills found</td></tr>';
        return;
    }

    billingsToDisplay.forEach(bill => {
        const row = document.createElement('tr');
        const patientName = bill.patientId ? 
            `${bill.patientId.firstName} ${bill.patientId.lastName}` : 'Unknown';

        row.innerHTML = `
            <td>${bill.billNumber}</td>
            <td>${patientName}</td>
            <td>${formatCurrency(bill.totalAmount)}</td>
            <td>${formatCurrency(bill.paidAmount)}</td>
            <td><span class="badge badge-${getPaymentStatusBadgeClass(bill.paymentStatus)}">${bill.paymentStatus}</span></td>
            <td>${formatDate(bill.billDate)}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-view" onclick="viewBill('${bill._id}')">View</button>
                    <button class="btn-edit" onclick="editBill('${bill._id}')">Edit</button>
                </div>
            </td>
        `;
        billsList.appendChild(row);
    });
}

function setupEventListeners() {
    const createBillBtn = document.getElementById('createBillBtn');
    if (createBillBtn) {
        createBillBtn.addEventListener('click', openCreateBillModal);
    }

    const closeBillModal = document.getElementById('closeBillModal');
    const cancelBillBtn = document.getElementById('cancelBillBtn');
    
    if (closeBillModal) {
        closeBillModal.addEventListener('click', () => closeModal('billModal'));
    }
    if (cancelBillBtn) {
        cancelBillBtn.addEventListener('click', () => closeModal('billModal'));
    }

    const billForm = document.getElementById('billForm');
    if (billForm) {
        billForm.addEventListener('submit', submitBillForm);
    }

    const addBillItem = document.getElementById('addBillItem');
    if (addBillItem) {
        addBillItem.addEventListener('click', addBillItemRow);
    }

    const taxInput = document.getElementById('tax');
    const discountInput = document.getElementById('discount');
    if (taxInput) taxInput.addEventListener('change', updateBillTotal);
    if (discountInput) discountInput.addEventListener('change', updateBillTotal);

    const searchBill = document.getElementById('searchBill');
    const paymentStatusFilter = document.getElementById('paymentStatusFilter');

    if (searchBill) searchBill.addEventListener('input', filterBillings);
    if (paymentStatusFilter) paymentStatusFilter.addEventListener('change', filterBillings);
}

function populateBillingSelects() {
    const patientSelect = document.getElementById('billPatientId');
    const doctorSelect = document.getElementById('billDoctorId');

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
}

function openCreateBillModal() {
    currentEditingBillingId = null;
    clearBillForm();
    openModal('billModal');
}

function clearBillForm() {
    document.getElementById('billForm').reset();
    currentEditingBillingId = null;
    
    // Auto-generate bill number
    const billNum = 'BILL-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    document.getElementById('billNumber').value = billNum;
    
    const billItemsContainer = document.getElementById('billItemsContainer');
    billItemsContainer.innerHTML = `
        <div class="bill-item">
            <input type="text" placeholder="Description" class="item-description" required>
            <input type="number" placeholder="Amount" class="item-amount" step="0.01" required>
            <button type="button" class="btn-remove-item">Remove</button>
        </div>
    `;
    updateBillTotal();
}

function addBillItemRow() {
    const billItemsContainer = document.getElementById('billItemsContainer');
    const billItem = document.createElement('div');
    billItem.className = 'bill-item';
    billItem.innerHTML = `
        <input type="text" placeholder="Description" class="item-description" required>
        <input type="number" placeholder="Amount" class="item-amount" step="0.01" required>
        <button type="button" class="btn-remove-item">Remove</button>
    `;

    billItem.querySelector('.btn-remove-item').addEventListener('click', function() {
        billItem.remove();
        updateBillTotal();
    });

    billItem.querySelector('.item-amount').addEventListener('change', updateBillTotal);

    billItemsContainer.appendChild(billItem);
}

function updateBillTotal() {
    const billItems = document.querySelectorAll('.bill-item');
    let subtotal = 0;

    billItems.forEach(item => {
        const amount = parseFloat(item.querySelector('.item-amount').value) || 0;
        subtotal += amount;
    });

    const tax = (parseFloat(document.getElementById('tax').value) || 0) / 100;
    const discount = (parseFloat(document.getElementById('discount').value) || 0) / 100;

    const taxAmount = subtotal * tax;
    const discountAmount = subtotal * discount;
    const total = subtotal + taxAmount - discountAmount;

    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('totalAmount').textContent = formatCurrency(total);
}

async function submitBillForm(e) {
    e.preventDefault();

    const billItems = document.querySelectorAll('.bill-item');
    const services = [];

    billItems.forEach(item => {
        services.push({
            description: item.querySelector('.item-description').value,
            amount: parseFloat(item.querySelector('.item-amount').value)
        });
    });

    const subtotal = services.reduce((sum, item) => sum + item.amount, 0);
    const tax = (parseFloat(document.getElementById('tax').value) || 0) / 100 * subtotal;
    const discount = (parseFloat(document.getElementById('discount').value) || 0) / 100 * subtotal;
    const totalAmount = subtotal + tax - discount;

    const billData = {
        billNumber: document.getElementById('billNumber').value,
        patientId: document.getElementById('billPatientId').value,
        doctorId: document.getElementById('billDoctorId').value,
        services,
        tax,
        discount,
        totalAmount
    };

    try {
        if (currentEditingBillingId) {
            await APIService.updateBilling(currentEditingBillingId, billData);
            showAlert('Bill updated successfully', 'success');
        } else {
            await APIService.createBilling(billData);
            showAlert('Bill created successfully', 'success');
        }

        closeModal('billModal');
        await loadBillingData();
    } catch (error) {
        showAlert('Error saving bill', 'error');
    }
}

async function viewBill(id) {
    try {
        const response = await APIService.getBillingById(id);
        const bill = response.data;
        alert(`Bill: ${bill.billNumber}\nTotal: ${formatCurrency(bill.totalAmount)}\nPaid: ${formatCurrency(bill.paidAmount)}\nStatus: ${bill.paymentStatus}`);
    } catch (error) {
        showAlert('Error loading bill details', 'error');
    }
}

async function editBill(id) {
    try {
        const response = await APIService.getBillingById(id);
        const bill = response.data;

        document.getElementById('billNumber').value = bill.billNumber;
        document.getElementById('billPatientId').value = bill.patientId._id;
        document.getElementById('billDoctorId').value = bill.doctorId._id;

        const billItemsContainer = document.getElementById('billItemsContainer');
        billItemsContainer.innerHTML = '';

        bill.services.forEach(service => {
            const billItem = document.createElement('div');
            billItem.className = 'bill-item';
            billItem.innerHTML = `
                <input type="text" placeholder="Description" class="item-description" value="${service.description}" required>
                <input type="number" placeholder="Amount" class="item-amount" step="0.01" value="${service.amount}" required>
                <button type="button" class="btn-remove-item">Remove</button>
            `;

            billItem.querySelector('.btn-remove-item').addEventListener('click', function() {
                billItem.remove();
                updateBillTotal();
            });

            billItem.querySelector('.item-amount').addEventListener('change', updateBillTotal);
            billItemsContainer.appendChild(billItem);
        });

        currentEditingBillingId = id;
        updateBillTotal();
        openModal('billModal');
    } catch (error) {
        showAlert('Error loading bill', 'error');
    }
}

function filterBillings() {
    const searchTerm = document.getElementById('searchBill').value.toLowerCase();
    const paymentStatusTerm = document.getElementById('paymentStatusFilter').value;

    const filtered = billings.filter(bill => {
        const patientName = bill.patientId ? 
            `${bill.patientId.firstName} ${bill.patientId.lastName}`.toLowerCase() : '';
        
        const matchesSearch = 
            patientName.includes(searchTerm) ||
            bill.billNumber.toLowerCase().includes(searchTerm);

        const matchesStatus = !paymentStatusTerm || bill.paymentStatus === paymentStatusTerm;

        return matchesSearch && matchesStatus;
    });

    displayBillings(filtered);
}

function getPaymentStatusBadgeClass(status) {
    const classes = {
        'Pending': 'warning',
        'Partial': 'info',
        'Paid': 'success',
        'Cancelled': 'danger'
    };
    return classes[status] || 'secondary';
}
