/**
 * Student Class - Đối tượng sinh viên với các thuộc tính và phương thức
 */
class Student {
    constructor(id, fullName, dateOfBirth, studentClass, gpa) {
        this._id = id;
        this._fullName = fullName;
        this._dateOfBirth = dateOfBirth;
        this._studentClass = studentClass;
        this._gpa = parseFloat(gpa);
    }

    // Getters
    get id() {
        return this._id;
    }

    get fullName() {
        return this._fullName;
    }

    get dateOfBirth() {
        return this._dateOfBirth;
    }

    get studentClass() {
        return this._studentClass;
    }

    get gpa() {
        return this._gpa;
    }

    // Setters - Phương thức cập nhật thông tin
    set id(value) {
        this._id = value;
    }

    set fullName(value) {
        this._fullName = value;
    }

    set dateOfBirth(value) {
        this._dateOfBirth = value;
    }

    set studentClass(value) {
        this._studentClass = value;
    }

    set gpa(value) {
        this._gpa = parseFloat(value);
    }

    // Phương thức cập nhật toàn bộ thông tin
    updateInfo(id, fullName, dateOfBirth, studentClass, gpa) {
        this._id = id;
        this._fullName = fullName;
        this._dateOfBirth = dateOfBirth;
        this._studentClass = studentClass;
        this._gpa = parseFloat(gpa);
    }

    // Lấy tên viết tắt cho avatar
    getInitials() {
        const names = this._fullName.split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[names.length - 1][0]).toUpperCase();
        }
        return this._fullName.substring(0, 2).toUpperCase();
    }

    // Format ngày sinh
    getFormattedDOB() {
        const date = new Date(this._dateOfBirth);
        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    }

    // Chuyển đổi sang object để lưu trữ
    toJSON() {
        return {
            id: this._id,
            fullName: this._fullName,
            dateOfBirth: this._dateOfBirth,
            studentClass: this._studentClass,
            gpa: this._gpa
        };
    }

    // Tạo Student từ object
    static fromJSON(json) {
        return new Student(json.id, json.fullName, json.dateOfBirth, json.studentClass, json.gpa);
    }
}

/**
 * StudentManager Class - Quản lý danh sách sinh viên
 */
class StudentManager {
    constructor() {
        this.students = [];
        this.currentPage = 1;
        this.itemsPerPage = 5;
        this.searchQuery = '';
        this.sortField = 'id';
        this.sortDirection = 'asc';
        
        this.loadFromStorage();
        this.initializeEventListeners();
        this.render();
    }

    // Lưu vào localStorage
    saveToStorage() {
        const data = this.students.map(s => s.toJSON());
        localStorage.setItem('students', JSON.stringify(data));
    }

    // Tải từ localStorage
    loadFromStorage() {
        const data = localStorage.getItem('students');
        if (data) {
            const parsed = JSON.parse(data);
            this.students = parsed.map(s => Student.fromJSON(s));
        } else {
            // Dữ liệu mẫu ban đầu
            this.students = [
                new Student('2023045', 'Nguyễn Văn A', '2006-04-12', 'CT02', 3.5),
                new Student('2023012', 'Trần Thị B', '2006-09-05', 'CT03', 3.9),
                new Student('2023089', 'Lê Văn C', '2007-01-22', 'CT01', 3.2),
                new Student('2023092', 'Phạm Thị D', '2007-03-15', 'CT01', 3.7),
                new Student('2023101', 'Đặng Văn E', '2005-11-30', 'CT05', 2.8),
                new Student('2024001', 'Hoàng Văn F', '2008-05-20', 'CT01', 3.8),
                new Student('2024002', 'Vũ Thị G', '2007-08-15', 'CT02', 4.0),
                new Student('2024003', 'Bùi Văn H', '2008-02-10', 'CT01', 3.2),
                new Student('2024004', 'Dương Thị I', '2006-12-25', 'CT07', 3.9),
                new Student('2024005', 'Cao Văn K', '2007-07-08', 'CT03', 2.9)
            ];
            this.saveToStorage();
        }
    }

    // Thêm sinh viên mới
    addStudent(student) {
        // Kiểm tra trùng mã sinh viên
        if (this.students.some(s => s.id === student.id)) {
            this.showToast('Mã sinh viên đã tồn tại!', 'error');
            return false;
        }
        this.students.push(student);
        this.saveToStorage();
        this.render();
        this.showToast('Thêm sinh viên thành công!', 'success');
        return true;
    }

    // Cập nhật sinh viên
    updateStudent(index, id, fullName, dateOfBirth, studentClass, gpa) {
        // Kiểm tra trùng mã sinh viên (ngoại trừ sinh viên đang cập nhật)
        const existingIndex = this.students.findIndex(s => s.id === id);
        if (existingIndex !== -1 && existingIndex !== index) {
            this.showToast('Mã sinh viên đã tồn tại!', 'error');
            return false;
        }
        this.students[index].updateInfo(id, fullName, dateOfBirth, studentClass, gpa);
        this.saveToStorage();
        this.render();
        this.showToast('Cập nhật sinh viên thành công!', 'success');
        return true;
    }

    // Xóa sinh viên
    deleteStudent(index) {
        if (confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
            this.students.splice(index, 1);
            this.saveToStorage();
            this.render();
            this.showToast('Xóa sinh viên thành công!', 'success');
        }
    }

    // Lọc và sắp xếp sinh viên
    getFilteredStudents() {
        let filtered = [...this.students];

        // Tìm kiếm
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(s =>
                s.id.toLowerCase().includes(query) ||
                s.fullName.toLowerCase().includes(query) ||
                s.studentClass.toLowerCase().includes(query)
            );
        }

        // Sắp xếp
        filtered.sort((a, b) => {
            let valueA, valueB;
            
            switch (this.sortField) {
                case 'id':
                    valueA = a.id;
                    valueB = b.id;
                    break;
                case 'name':
                    valueA = a.fullName.toLowerCase();
                    valueB = b.fullName.toLowerCase();
                    break;
                case 'class':
                    valueA = a.studentClass;
                    valueB = b.studentClass;
                    break;
                case 'gpa':
                    valueA = a.gpa;
                    valueB = b.gpa;
                    break;
                default:
                    valueA = a.id;
                    valueB = b.id;
            }

            if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
            if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }

    // Lấy sinh viên cho trang hiện tại
    getPagedStudents() {
        const filtered = this.getFilteredStudents();
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return filtered.slice(start, end);
    }

    // Tính tổng số trang
    getTotalPages() {
        return Math.ceil(this.getFilteredStudents().length / this.itemsPerPage);
    }

    // Tính GPA trung bình
    getAverageGPA() {
        if (this.students.length === 0) return 0;
        const sum = this.students.reduce((acc, s) => acc + s.gpa, 0);
        return (sum / this.students.length).toFixed(1);
    }

    // Render bảng sinh viên
    renderTable() {
        const tbody = document.getElementById('studentTableBody');
        const students = this.getPagedStudents();

        if (students.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6">
                        <div class="empty-state">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                            <h3>Không tìm thấy sinh viên</h3>
                            <p>Thêm một sinh viên mới hoặc điều chỉnh tiêu chí tìm kiếm.</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        const avatarColors = 8;
        
        tbody.innerHTML = students.map((student, pageIndex) => {
            const actualIndex = this.students.findIndex(s => s.id === student.id);
            const colorClass = `avatar-${(actualIndex % avatarColors) + 1}`;
            
            return `
                <tr>
                    <td><strong>${student.id}</strong></td>
                    <td>
                        <div class="student-name">
                            <div class="avatar ${colorClass}">${student.getInitials()}</div>
                            <span>${student.fullName}</span>
                        </div>
                    </td>
                    <td>${student.getFormattedDOB()}</td>
                    <td><span class="class-badge">${student.studentClass}</span></td>
                    <td><strong>${student.gpa.toFixed(1)}</strong></td>
                    <td>
                        <div class="action-btns">
                            <button class="action-btn edit" onclick="studentManager.openEditModal(${actualIndex})" title="Sửa">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                            </button>
                            <button class="action-btn delete" onclick="studentManager.deleteStudent(${actualIndex})" title="Xóa">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                    <line x1="10" y1="11" x2="10" y2="17"/>
                                    <line x1="14" y1="11" x2="14" y2="17"/>
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Render phân trang
    renderPagination() {
        const pagination = document.getElementById('pagination');
        const totalPages = this.getTotalPages();
        const filtered = this.getFilteredStudents();

        // Cập nhật thông tin hiển thị
        const start = filtered.length === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
        const end = Math.min(this.currentPage * this.itemsPerPage, filtered.length);
        
        document.getElementById('showingStart').textContent = start;
        document.getElementById('showingEnd').textContent = end;
        document.getElementById('showingTotal').textContent = filtered.length;

        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let html = `
            <button class="page-btn" onclick="studentManager.goToPage(${this.currentPage - 1})" ${this.currentPage === 1 ? 'disabled' : ''}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"/>
                </svg>
            </button>
        `;

        // Logic hiển thị số trang
        const maxVisible = 3;
        let startPage = Math.max(1, this.currentPage - 1);
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        if (startPage > 1) {
            html += `<button class="page-btn" onclick="studentManager.goToPage(1)">1</button>`;
            if (startPage > 2) {
                html += `<span class="page-btn" style="border: none;">...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            html += `<button class="page-btn ${i === this.currentPage ? 'active' : ''}" onclick="studentManager.goToPage(${i})">${i}</button>`;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                html += `<span class="page-btn" style="border: none;">...</span>`;
            }
            html += `<button class="page-btn" onclick="studentManager.goToPage(${totalPages})">${totalPages}</button>`;
        }

        html += `
            <button class="page-btn" onclick="studentManager.goToPage(${this.currentPage + 1})" ${this.currentPage === totalPages ? 'disabled' : ''}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"/>
                </svg>
            </button>
        `;

        pagination.innerHTML = html;
    }

    // Render thống kê
    renderStats() {
        document.getElementById('totalStudents').textContent = this.students.length;
        document.getElementById('avgGpa').textContent = this.getAverageGPA();
    }

    // Render toàn bộ
    render() {
        this.renderTable();
        this.renderPagination();
        this.renderStats();
    }

    // Chuyển trang
    goToPage(page) {
        const totalPages = this.getTotalPages();
        if (page < 1 || page > totalPages) return;
        this.currentPage = page;
        this.render();
    }

    // Sắp xếp
    sort(field) {
        if (this.sortField === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortField = field;
            this.sortDirection = 'asc';
        }
        this.currentPage = 1;
        this.render();
    }

    // Mở modal chỉnh sửa
    openEditModal(index) {
        const student = this.students[index];
        document.getElementById('editIndex').value = index;
        document.getElementById('editStudentId').value = student.id;
        document.getElementById('editFullName').value = student.fullName;
        document.getElementById('editDateOfBirth').value = student.dateOfBirth;
        document.getElementById('editStudentClass').value = student.studentClass;
        document.getElementById('editGpa').value = student.gpa;
        
        document.getElementById('editModal').classList.add('active');
    }

    // Đóng modal
    closeEditModal() {
        document.getElementById('editModal').classList.remove('active');
    }

    // Hiển thị thông báo
    showToast(message, type = 'success') {
        // Xóa toast cũ nếu có
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Khởi tạo event listeners
    initializeEventListeners() {
        // Form thêm sinh viên
        document.getElementById('studentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const student = new Student(
                document.getElementById('studentId').value.trim(),
                document.getElementById('fullName').value.trim(),
                document.getElementById('dateOfBirth').value,
                document.getElementById('studentClass').value,
                document.getElementById('gpa').value
            );
            
            if (this.addStudent(student)) {
                e.target.reset();
            }
        });

        // Nút Clear
        document.getElementById('clearBtn').addEventListener('click', () => {
            document.getElementById('studentForm').reset();
        });

        // Tìm kiếm
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.currentPage = 1;
            this.render();
        });

        // Sắp xếp
        document.querySelectorAll('.sortable').forEach(th => {
            th.addEventListener('click', () => {
                this.sort(th.dataset.sort);
            });
        });

        // Form chỉnh sửa
        document.getElementById('editForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const index = parseInt(document.getElementById('editIndex').value);
            const success = this.updateStudent(
                index,
                document.getElementById('editStudentId').value.trim(),
                document.getElementById('editFullName').value.trim(),
                document.getElementById('editDateOfBirth').value,
                document.getElementById('editStudentClass').value,
                document.getElementById('editGpa').value
            );
            
            if (success) {
                this.closeEditModal();
            }
        });

        // Đóng modal
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeEditModal();
        });

        document.getElementById('cancelEdit').addEventListener('click', () => {
            this.closeEditModal();
        });

        // Click outside modal để đóng
        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target.id === 'editModal') {
                this.closeEditModal();
            }
        });

        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportToCSV();
        });
    }

    // Xuất CSV
    exportToCSV() {
        const headers = ['ID', 'Full Name', 'Date of Birth', 'Class', 'GPA'];
        const rows = this.students.map(s => [
            s.id,
            s.fullName,
            s.dateOfBirth,
            s.studentClass,
            s.gpa
        ]);

        let csv = headers.join(',') + '\n';
        rows.forEach(row => {
            csv += row.map(cell => `"${cell}"`).join(',') + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'students.csv';
        link.click();
        
        this.showToast('Xuất CSV thành công!', 'success');
    }
}

// Khởi tạo StudentManager
let studentManager;
document.addEventListener('DOMContentLoaded', () => {
    studentManager = new StudentManager();
});
