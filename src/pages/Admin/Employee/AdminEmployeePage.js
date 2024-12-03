import React, { useEffect, useState } from 'react';
import { registerEmployeeAPI, getAllEmployeesAPI, updateEmployeeAPI, deleteEmployeeAPI } from '../../../api/employee';
import './AdminEmployeePage.css';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [newEmployee, setNewEmployee] = useState({
        name: '',
        employeeNumber: '',
        joinDate: '',
        department: '',
        position: '',
        contractType: '',
        email: '',
        phone: '',
        birthDate: '',
        password: '',
        leaveBalance: 20,
        role: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const role = decodedToken.role;

                if (role !== 'ROLE_ADMIN') {
                    alert('접근 권한이 없습니다. 관리자만 접근 가능합니다.');
                    navigate('/');
                }
            } catch (error) {
                console.error("토큰을 해석하는 중 오류가 발생했습니다:", error);
                alert('잘못된 토큰입니다. 다시 로그인해주세요.');
                navigate('/');
            }
        } else {
            alert('로그인이 필요합니다.');
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await getAllEmployeesAPI({
                    page: currentPage,
                    size: pageSize,
                    sortField: 'createdAt',
                    sortDir: 'desc',
                    keyword: searchTerm
                });
                const data = response.content.map(employee => ({
                    ...employee,
                    isEditing: false,
                }));
                console.log("API 응답 데이터:", data);
                setEmployees(data);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error("사원 데이터를 가져오는 중 오류가 발생했습니다:", error);
            }
        };
        fetchEmployees();
    }, [currentPage, pageSize, searchTerm]);

    // 삭제 
    const handleDelete = async (empNo) => {
        try {
            await deleteEmployeeAPI(empNo);
            setEmployees(employees.filter(employee => employee.empNo !== empNo));
            alert('사원이 삭제되었습니다.');
        } catch (error) {
            console.error("사원 삭제 중 오류가 발생했습니다:", error);
            alert('사원을 삭제하는 중 문제가 발생했습니다.');
        }
    };

    // 수정 
    const handleEdit = (empNo) => {
        setEmployees(employees.map(employee =>
            employee.empNo === empNo
                ? { ...employee, isEditing: true }
                : employee
        ));
    };

    const handleSave = async (empNo) => {
        const employeeToSave = employees.find(employee => employee.empNo === empNo);

        const updateData = {
            position: employeeToSave.position,
            contractType: employeeToSave.contractType,
            leaveBalance: employeeToSave.leaveBalance,
            deptName: employeeToSave.deptName,
        };

        try {
            await updateEmployeeAPI(empNo, updateData);
            alert(`사원 ID ${empNo} 정보가 수정되었습니다.`);
            setEmployees(employees.map(employee =>
                employee.empNo === empNo
                    ? { ...employee, isEditing: false }
                    : employee
            ));
        } catch (error) {
            console.error("사원 수정 중 오류가 발생했습니다:", error);
            alert('사원 정보를 수정하는 중 문제가 발생했습니다.');
        }
    };

    const handleAddEmployee = () => {
        setIsModalOpen(true);
    };

    const handleInputChange = (empNo, field, value) => {
        setEmployees(employees.map(employee =>
            employee.empNo === empNo
                ? { ...employee, [field]: value }
                : employee
        ));
    };

    // 등록
    const handleSaveNewEmployee = async () => {
        try {
            if (!newEmployee.joinDate || isNaN(new Date(newEmployee.joinDate))) {
                alert("입사일을 올바르게 입력해주세요.");
                return;
            }

            if (!newEmployee.birthDate || isNaN(new Date(newEmployee.birthDate))) {
                alert("생년월일을 올바르게 입력해주세요.");
                return;
            }
            // 날짜 형식 변환
            const formattedJoinDate = new Date(newEmployee.joinDate).toISOString().split('T')[0];
            const formattedBirthDate = new Date(newEmployee.birthDate).toISOString().split('T')[0];

            await registerEmployeeAPI({
                name: newEmployee.name,
                empNo: newEmployee.employeeNumber,
                joinDate: formattedJoinDate,
                deptName: newEmployee.department,
                position: newEmployee.position,
                contractType: newEmployee.contractType,
                email: newEmployee.email,
                phone: newEmployee.phone,
                birthDate: formattedBirthDate,
                password: newEmployee.password,
                leaveBalance: newEmployee.leaveBalance,
                role: newEmployee.role,
            });
            setEmployees([...employees, newEmployee]);
            setIsModalOpen(false);
            alert('사원이 추가되었습니다.');
        } catch (error) {
            console.error("사원 등록 중 오류가 발생했습니다:", error);
            alert('사원 등록 중 문제가 발생했습니다.');
        }
    };

    return (
        <div className="admin-employee-management-container">
            <div className="admin-employee-top-bar">
                <h3 style={{ fontWeight: "bold" }}>사원 관리</h3>
                <button className="admin-employee-add-employee-button" onClick={handleAddEmployee}>+ 구성원 추가하기</button>
            </div>
            <div className="admin-employee-table-container">
                <div className="admin-employee-table-search">
                    <input
                        type="text"
                        placeholder="검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="admin-employee-search-button">
                        <img src="/search.png" alt="검색" className="search-button-icon" />
                    </button>
                </div>
                <table className="admin-employee-table">
                    <thead>
                        <tr>
                            <th rowSpan="2">이름</th>
                            <th colSpan="2">기본 정보</th>
                            <th colSpan="3">인사 정보</th>
                            <th colSpan="3">개인 정보</th>
                            <th rowSpan="2"></th>
                        </tr>
                        <tr>
                            <th>사번</th>
                            <th>입사일</th>
                            <th>부서</th>
                            <th>직급</th>
                            <th>계약 형태</th>
                            <th>이메일</th>
                            <th>연락처</th>
                            <th>생일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees
                            .filter((employee) =>
                                employee.name.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((employee) => (
                                <tr key={employee.empNo}>
                                    <td>
                                        <img
                                            className="admin-employee-profile-img"
                                            src={employee.profileImageUrl || "https://www.pngarts.com/files/10/Default-Profile-Picture-Download-PNG-Image.png"}
                                            alt={employee.name}
                                        />
                                        {employee.name}
                                    </td>
                                    <td className="admin-employee-info">{employee.empNo}</td>
                                    <td className="admin-employee-info">{employee.joinDate}</td>
                                    <td>
                                        <div className="admin-employee-edit-cell">
                                            {employee.isEditing ? (
                                                <input
                                                    type="text"
                                                    value={employee.deptName}
                                                    onChange={(e) => handleInputChange(employee.empNo, "deptName", e.target.value)}
                                                />
                                            ) : (
                                                employee.deptName
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="admin-employee-edit-cell">
                                            {employee.isEditing ? (
                                                <input
                                                    type="text"
                                                    value={employee.position}
                                                    onChange={(e) => handleInputChange(employee.empNo, "position", e.target.value)}
                                                />
                                            ) : (
                                                employee.position
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="admin-employee-edit-cell">
                                            {employee.isEditing ? (
                                                <input
                                                    type="text"
                                                    value={employee.contractType}
                                                    onChange={(e) => handleInputChange(employee.empNo, "contractType", e.target.value)}
                                                />
                                            ) : (
                                                employee.contractType
                                            )}
                                        </div>
                                    </td>
                                    <td className="admin-employee-info">{employee.email}</td>
                                    <td className="admin-employee-info">{employee.phone}</td>
                                    <td className="admin-employee-info">{employee.birthDate}</td>
                                    <td>
                                        <div className="admin-employee-edit-cell">
                                            {employee.isEditing ? (
                                                <button onClick={() => handleSave(employee.empNo)}
                                                style={{borderRadius: "5px"}}>완료</button>
                                            ) : (
                                                <button onClick={() => handleEdit(employee.empNo)}
                                                style={{borderRadius: "5px"}}>수정</button>
                                            )}
                                            <button className="admin-employee-delete-button" onClick={() => handleDelete(employee.empNo)}>삭제</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                <div className="admin-employee-pagination">
                    <button
                        onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 0))}
                        disabled={currentPage === 0}
                    >
                        이전
                    </button>
                    <span>{`페이지 ${currentPage + 1} / ${totalPages}`}</span>
                    <button
                        onClick={() => setCurrentPage(prevPage => prevPage + 1)}
                        disabled={currentPage + 1 >= totalPages}
                    >
                        다음
                    </button>
                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="사원 추가"
                className="admin-employee-modal"
                overlayClassName="admin-employee-modal-overlay"
            >
                <h2>사원 추가</h2>
                <div className="admin-employee-modal-content">
                    <label>이름:</label>
                    <input
                        type="text"
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    />
                    <label>사번:</label>
                    <input
                        type="text"
                        value={newEmployee.employeeNumber}
                        onChange={(e) => setNewEmployee({ ...newEmployee, employeeNumber: e.target.value })}
                    />
                    <label>비밀번호:</label>
                    <input
                        type="password"
                        value={newEmployee.password}
                        onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                    />
                    <label>입사일:</label>
                    <input
                        type="date"
                        value={newEmployee.joinDate || ''}
                        onChange={(e) => setNewEmployee({ ...newEmployee, joinDate: e.target.value })}
                    />
                    <label>부서:</label>
                    <input
                        type="text"
                        value={newEmployee.department}
                        onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                    />
                    <label>직급:</label>
                    <input
                        type="text"
                        value={newEmployee.position}
                        onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                    />
                    <label>계약 형태:</label>
                    <input
                        type="text"
                        value={newEmployee.contractType}
                        onChange={(e) => setNewEmployee({ ...newEmployee, contractType: e.target.value })}
                    />
                    <label>이메일:</label>
                    <input
                        type="email"
                        value={newEmployee.email}
                        onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    />
                    <label>연락처:</label>
                    <input
                        type="text"
                        value={newEmployee.phone}
                        onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    />
                    <label>생일:</label>
                    <input
                        type="date"
                        value={newEmployee.birthDate || ''}
                        onChange={(e) => setNewEmployee({ ...newEmployee, birthDate: e.target.value })}
                    />
                    <label>휴가 잔여 일수:</label>
                    <input
                        type="number"
                        value={newEmployee.leaveBalance}
                        onChange={(e) => setNewEmployee({ ...newEmployee, leaveBalance: e.target.value })}
                    />
                    <label>역할:</label>
                    <select
                        value={newEmployee.role}
                        onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                    >
                        <option value="ROLE_USER">사용자</option>
                        <option value="ROLE_ADMIN">관리자</option>
                    </select>
                </div>
                <div className="admin-employee-modal-buttons">
                    <button onClick={handleSaveNewEmployee}>저장</button>
                    <button onClick={() => setIsModalOpen(false)}>취소</button>
                </div>
            </Modal>
        </div>
    );
};

export default EmployeeManagement;