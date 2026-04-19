document.addEventListener('DOMContentLoaded', () => {
    // State
    let currentEndpoint = 'colleges';
    let currentData = [];
    let isEditMode = false;
    let editId = null;

    // UI Elements
    const navButtons = document.querySelectorAll('.nav-btn');
    const tableTitle = document.getElementById('table-title');
    const tableHead = document.getElementById('table-head');
    const tableBody = document.getElementById('table-body');
    
    // Modal Elements
    const modal = document.getElementById('crud-modal');
    const modalTitle = document.getElementById('modal-title');
    const crudForm = document.getElementById('crud-form');

    // Mapping endpoints to UI names and Primary Keys
    const entityNames = {
        colleges: { title: 'Colleges', pk: 'college_id' },
        departments: { title: 'Departments', pk: 'dept_id' },
        courses: { title: 'Courses', pk: 'course_no' },
        faculties: { title: 'Faculty', pk: 'faculty_id' },
        students: { title: 'Students', pk: 'student_id' },
        reports: { title: 'Progress Reports', pk: 'report_id' }
    };

    // Navigation click handlers
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            navButtons.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            currentEndpoint = e.currentTarget.getAttribute('data-target');
            document.getElementById('table-title').textContent = `${entityNames[currentEndpoint].title} Information`;
            fetchData();
        });
    });

    window.fetchData = async () => {
        try {
            tableBody.innerHTML = `<tr><td colspan="10" class="loading-state">Loading data from backend...</td></tr>`;
            const response = await fetch(`/api/${currentEndpoint}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            currentData = data;
            renderTable(data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            tableBody.innerHTML = `<tr><td colspan="10" class="loading-state" style="color: red;">Error loading data. Make sure backend is running.</td></tr>`;
        }
    };

    function renderTable(data) {
        tableHead.innerHTML = '';
        tableBody.innerHTML = '';

        if (!data || data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="10" class="loading-state">No records found.</td></tr>`;
            return;
        }

        const keys = Object.keys(data[0]);
        const headerRow = document.createElement('tr');
        
        keys.forEach(key => {
            const th = document.createElement('th');
            th.textContent = key.replace(/_/g, ' ').toUpperCase();
            headerRow.appendChild(th);
        });
        
        // Add Actions Header
        const actionTh = document.createElement('th');
        actionTh.textContent = "ACTIONS";
        headerRow.appendChild(actionTh);
        tableHead.appendChild(headerRow);

        data.forEach((item, index) => {
            const row = document.createElement('tr');
            keys.forEach(key => {
                const td = document.createElement('td');
                td.textContent = item[key] !== null ? item[key] : 'N/A';
                row.appendChild(td);
            });
            
            // Add Actions Data
            const pkField = entityNames[currentEndpoint].pk;
            const itemId = item[pkField];
            
            const actionTd = document.createElement('td');
            actionTd.innerHTML = `
                <button class="btn-edit" onclick="openEditModal(${index})">Edit</button>
                <button class="btn-delete" onclick="deleteRecord(${itemId})">Delete</button>
            `;
            row.appendChild(actionTd);

            tableBody.appendChild(row);
        });
    }

    // ===== MODAL DYNAMIC GENERATOR ===== //

    window.openAddModal = () => {
        isEditMode = false;
        editId = null;
        modalTitle.textContent = `Add New ${entityNames[currentEndpoint].title}`;
        generateFormFields();
        modal.classList.remove('hidden');
    };

    window.openEditModal = (index) => {
        isEditMode = true;
        const item = currentData[index];
        const pkField = entityNames[currentEndpoint].pk;
        editId = item[pkField];
        
        modalTitle.textContent = `Edit ${entityNames[currentEndpoint].title}`;
        generateFormFields(item);
        modal.classList.remove('hidden');
    };

    window.closeModal = () => {
        modal.classList.add('hidden');
    };

    function generateFormFields(existingData = null) {
        crudForm.innerHTML = '';
        
        let keys = [];
        if (currentData.length > 0) {
            keys = Object.keys(currentData[0]);
        } else {
            // Dynamic failsafe if empty
            keys = ['name', 'address', 'details']; 
        }

        const pkField = entityNames[currentEndpoint].pk;

        keys.forEach(key => {
            // We shouldn't show inputs for Primary Keys or joined readable fields
            if (key === pkField || key === 'college_name' || key === 'department_name' || key === 'student_name' || key === 'pass_year') return;

            const group = document.createElement('div');
            group.className = 'form-group';
            
            group.innerHTML = `
                <label>${key.replace(/_/g, ' ').toUpperCase()}</label>
                <input type="${typeof (existingData ? existingData[key] : '') === 'number' ? 'number' : 'text'}" 
                       name="${key}" 
                       value="${existingData && existingData[key] ? existingData[key] : ''}" 
                       required>
            `;
            crudForm.appendChild(group);
        });
    }

    // ===== CRUD API OPERATIONS ===== //

    window.submitForm = async () => {
        const formData = new FormData(crudForm);
        const payload = Object.fromEntries(formData.entries());

        const url = isEditMode ? `/api/${currentEndpoint}/${editId}` : `/api/${currentEndpoint}`;
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to save record.');
            }
            
            closeModal();
            fetchData(); // Refresh UI dynamically 
        } catch (error) {
            alert(error.message);
        }
    };

    window.deleteRecord = async (id) => {
        if (!confirm('Are you certain you want to permanently delete this record?')) return;

        try {
            const response = await fetch(`/api/${currentEndpoint}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete record. It may be referenced elsewhere (Foreign Key constraint).');
            fetchData();
        } catch (error) {
            alert(error.message);
        }
    };

    // Initial load
    fetchData();
});
