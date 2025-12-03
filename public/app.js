const API_URL = window.location.origin;

// Load statistics
async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/api/stats`);
        const data = await response.json();
        document.getElementById('totalSchools').textContent = data.schools || 0;
        document.getElementById('totalStudents').textContent = data.students || 0;
        document.getElementById('activeStudents').textContent = data.active_students || 0;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Tab switching
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(`${tabName}-section`).classList.add('active');
    event.target.classList.add('active');

    // Load appropriate data
    if (tabName === 'schools') {
        loadSchools();
    } else if (tabName === 'students') {
        loadStudents();
        loadSchoolsForDropdown();
    }
}

// ===========================
// SCHOOLS MANAGEMENT
// ===========================

async function loadSchools() {
    try {
        const response = await fetch(`${API_URL}/api/schools`);
        const data = await response.json();
        displaySchools(data.schools || []);
    } catch (error) {
        console.error('Error loading schools:', error);
    }
}

function displaySchools(schools) {
    const container = document.getElementById('schoolsList');
    if (schools.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No schools found. Add your first school!</p>';
        return;
    }

    container.innerHTML = schools.map(school => `
        <div class="card">
            <div class="card-header">
                <div class="card-title">${escapeHtml(school.name)}</div>
                <div class="card-actions">
                    <button class="btn btn-edit" onclick="editSchool(${school.id})">Edit</button>
                    <button class="btn btn-delete" onclick="deleteSchool(${school.id})">Delete</button>
                </div>
            </div>
            <div class="card-body">
                ${school.address ? `<p><strong>Address:</strong> ${escapeHtml(school.address)}</p>` : ''}
                ${school.phone ? `<p><strong>Phone:</strong> ${escapeHtml(school.phone)}</p>` : ''}
                ${school.email ? `<p><strong>Email:</strong> ${escapeHtml(school.email)}</p>` : ''}
                ${school.principal ? `<p><strong>Principal:</strong> ${escapeHtml(school.principal)}</p>` : ''}
            </div>
        </div>
    `).join('');
}

function showSchoolForm() {
    document.getElementById('schoolFormTitle').textContent = 'Add New School';
    document.getElementById('schoolForm').style.display = 'block';
    document.getElementById('schoolId').value = '';
    document.getElementById('schoolName').value = '';
    document.getElementById('schoolAddress').value = '';
    document.getElementById('schoolPhone').value = '';
    document.getElementById('schoolEmail').value = '';
    document.getElementById('schoolPrincipal').value = '';
}

function cancelSchoolForm() {
    document.getElementById('schoolForm').style.display = 'none';
}

async function editSchool(id) {
    try {
        const response = await fetch(`${API_URL}/api/schools/${id}`);
        const data = await response.json();
        const school = data.school;

        document.getElementById('schoolFormTitle').textContent = 'Edit School';
        document.getElementById('schoolForm').style.display = 'block';
        document.getElementById('schoolId').value = school.id;
        document.getElementById('schoolName').value = school.name || '';
        document.getElementById('schoolAddress').value = school.address || '';
        document.getElementById('schoolPhone').value = school.phone || '';
        document.getElementById('schoolEmail').value = school.email || '';
        document.getElementById('schoolPrincipal').value = school.principal || '';
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error('Error loading school:', error);
        alert('Error loading school details');
    }
}

async function saveSchool(event) {
    event.preventDefault();

    const id = document.getElementById('schoolId').value;
    const school = {
        name: document.getElementById('schoolName').value,
        address: document.getElementById('schoolAddress').value,
        phone: document.getElementById('schoolPhone').value,
        email: document.getElementById('schoolEmail').value,
        principal: document.getElementById('schoolPrincipal').value
    };

    try {
        const url = id ? `${API_URL}/api/schools/${id}` : `${API_URL}/api/schools`;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(school)
        });

        if (response.ok) {
            cancelSchoolForm();
            loadSchools();
            loadStats();
            alert(id ? 'School updated successfully!' : 'School added successfully!');
        } else {
            const error = await response.json();
            alert('Error: ' + error.error);
        }
    } catch (error) {
        console.error('Error saving school:', error);
        alert('Error saving school');
    }
}

async function deleteSchool(id) {
    if (!confirm('Are you sure you want to delete this school? This action cannot be undone.')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/schools/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadSchools();
            loadStats();
            alert('School deleted successfully!');
        } else {
            const error = await response.json();
            alert('Error: ' + error.error);
        }
    } catch (error) {
        console.error('Error deleting school:', error);
        alert('Error deleting school');
    }
}

// ===========================
// STUDENTS MANAGEMENT
// ===========================

async function loadStudents() {
    const schoolId = document.getElementById('schoolFilter').value;
    const url = schoolId ? `${API_URL}/api/students?school_id=${schoolId}` : `${API_URL}/api/students`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayStudents(data.students || []);
    } catch (error) {
        console.error('Error loading students:', error);
    }
}

function displayStudents(students) {
    const container = document.getElementById('studentsList');
    if (students.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No students found. Add your first student!</p>';
        return;
    }

    container.innerHTML = students.map(student => `
        <div class="card">
            <div class="card-header">
                <div class="card-title">${escapeHtml(student.first_name)} ${escapeHtml(student.last_name)}</div>
                <div class="card-actions">
                    <button class="btn btn-edit" onclick="editStudent(${student.id})">Edit</button>
                    <button class="btn btn-delete" onclick="deleteStudent(${student.id})">Delete</button>
                </div>
            </div>
            <div class="card-body">
                ${student.school_name ? `<p><strong>School:</strong> ${escapeHtml(student.school_name)}</p>` : ''}
                ${student.grade ? `<p><strong>Grade:</strong> ${escapeHtml(student.grade)}</p>` : ''}
                ${student.date_of_birth ? `<p><strong>Date of Birth:</strong> ${student.date_of_birth}</p>` : ''}
                ${student.email ? `<p><strong>Email:</strong> ${escapeHtml(student.email)}</p>` : ''}
                ${student.phone ? `<p><strong>Phone:</strong> ${escapeHtml(student.phone)}</p>` : ''}
                ${student.parent_name ? `<p><strong>Parent:</strong> ${escapeHtml(student.parent_name)}</p>` : ''}
                ${student.parent_phone ? `<p><strong>Parent Phone:</strong> ${escapeHtml(student.parent_phone)}</p>` : ''}
                <p><strong>Status:</strong> <span class="status-badge status-${student.status}">${student.status}</span></p>
            </div>
        </div>
    `).join('');
}

async function loadSchoolsForDropdown() {
    try {
        const response = await fetch(`${API_URL}/api/schools`);
        const data = await response.json();
        const schools = data.schools || [];

        const studentSchoolSelect = document.getElementById('studentSchool');
        const schoolFilter = document.getElementById('schoolFilter');

        const options = schools.map(school => 
            `<option value="${school.id}">${escapeHtml(school.name)}</option>`
        ).join('');

        studentSchoolSelect.innerHTML = '<option value="">Select School</option>' + options;
        schoolFilter.innerHTML = '<option value="">All Schools</option>' + options;
    } catch (error) {
        console.error('Error loading schools:', error);
    }
}

function showStudentForm() {
    document.getElementById('studentFormTitle').textContent = 'Add New Student';
    document.getElementById('studentForm').style.display = 'block';
    clearStudentForm();
}

function cancelStudentForm() {
    document.getElementById('studentForm').style.display = 'none';
}

function clearStudentForm() {
    document.getElementById('studentId').value = '';
    document.getElementById('studentFirstName').value = '';
    document.getElementById('studentLastName').value = '';
    document.getElementById('studentDOB').value = '';
    document.getElementById('studentGrade').value = '';
    document.getElementById('studentSchool').value = '';
    document.getElementById('studentEnrollmentDate').value = '';
    document.getElementById('studentEmail').value = '';
    document.getElementById('studentPhone').value = '';
    document.getElementById('studentAddress').value = '';
    document.getElementById('studentParentName').value = '';
    document.getElementById('studentParentPhone').value = '';
    document.getElementById('studentParentEmail').value = '';
    document.getElementById('studentStatus').value = 'active';
}

async function editStudent(id) {
    try {
        const response = await fetch(`${API_URL}/api/students/${id}`);
        const data = await response.json();
        const student = data.student;

        document.getElementById('studentFormTitle').textContent = 'Edit Student';
        document.getElementById('studentForm').style.display = 'block';
        document.getElementById('studentId').value = student.id;
        document.getElementById('studentFirstName').value = student.first_name || '';
        document.getElementById('studentLastName').value = student.last_name || '';
        document.getElementById('studentDOB').value = student.date_of_birth || '';
        document.getElementById('studentGrade').value = student.grade || '';
        document.getElementById('studentSchool').value = student.school_id || '';
        document.getElementById('studentEnrollmentDate').value = student.enrollment_date || '';
        document.getElementById('studentEmail').value = student.email || '';
        document.getElementById('studentPhone').value = student.phone || '';
        document.getElementById('studentAddress').value = student.address || '';
        document.getElementById('studentParentName').value = student.parent_name || '';
        document.getElementById('studentParentPhone').value = student.parent_phone || '';
        document.getElementById('studentParentEmail').value = student.parent_email || '';
        document.getElementById('studentStatus').value = student.status || 'active';
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error('Error loading student:', error);
        alert('Error loading student details');
    }
}

async function saveStudent(event) {
    event.preventDefault();

    const id = document.getElementById('studentId').value;
    const student = {
        school_id: document.getElementById('studentSchool').value || null,
        first_name: document.getElementById('studentFirstName').value,
        last_name: document.getElementById('studentLastName').value,
        date_of_birth: document.getElementById('studentDOB').value || null,
        grade: document.getElementById('studentGrade').value || null,
        enrollment_date: document.getElementById('studentEnrollmentDate').value || null,
        email: document.getElementById('studentEmail').value || null,
        phone: document.getElementById('studentPhone').value || null,
        address: document.getElementById('studentAddress').value || null,
        parent_name: document.getElementById('studentParentName').value || null,
        parent_phone: document.getElementById('studentParentPhone').value || null,
        parent_email: document.getElementById('studentParentEmail').value || null,
        status: document.getElementById('studentStatus').value
    };

    try {
        const url = id ? `${API_URL}/api/students/${id}` : `${API_URL}/api/students`;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(student)
        });

        if (response.ok) {
            cancelStudentForm();
            loadStudents();
            loadStats();
            alert(id ? 'Student updated successfully!' : 'Student added successfully!');
        } else {
            const error = await response.json();
            alert('Error: ' + error.error);
        }
    } catch (error) {
        console.error('Error saving student:', error);
        alert('Error saving student');
    }
}

async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/students/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadStudents();
            loadStats();
            alert('Student deleted successfully!');
        } else {
            const error = await response.json();
            alert('Error: ' + error.error);
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        alert('Error deleting student');
    }
}

// Utility function to escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadSchools();
});
