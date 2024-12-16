import React, { useEffect, useState } from 'react';
import { registerEmployeeAPI, getAllEmployeesAPI, updateEmployeeAPI, deleteEmployeeAPI, getDepartmentAPI } from '../../../api/employee';
import './AdminEmployeePage.css';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const contractTypes = [
    { value: "PERMANENT", label: "정규직" },
    { value: "CONTRACT", label: "계약직" },
    { value: "PART_TIME", label: "시간제 정규직" },
    { value: "DISPATCH", label: "파견직" },
    { value: "INDEFINITE", label: "무기계약직" },
    { value: "INTERNSHIP", label: "인턴십" },
];

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [department, setDepartments] = useState([]);
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
        role: 'ROLE_EMPLOYEE',
    });
    const navigate = useNavigate();
    const { showToast } = useToast();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const role = decodedToken.role;

                if (role !== 'ROLE_ADMIN') {
                    showToast('접근 권한이 없습니다. 관리자만 접근 가능합니다.', 'error');
                    navigate('/');
                }
            } catch (error) {
                console.error("토큰을 해석하는 중 오류가 발생했습니다:", error);
                showToast('잘못된 토큰입니다. 다시 로그인해주세요.', 'error');
                navigate('/');
            }
        } else {
            showToast('로그인이 필요합니다.', 'warning');
            navigate('/login');
        }
    }, [navigate, showToast]);

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
                setEmployees(data);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error("사원 데이터를 가져오는 중 오류가 발생했습니다:", error);
                showToast('사원 데이터를 가져오는 중 오류가 발생했습니다.', 'error');
            }
        };
        fetchEmployees();
    }, [showToast, currentPage, pageSize, searchTerm]);

    // 부서 데이터 가져오기 
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await getDepartmentAPI(); // API 호출
                setDepartments(response);
            } catch (error) {
                console.error("부서 데이터를 가져오는 중 오류가 발생했습니다:", error);
                showToast('부서 데이터를 가져오는 중 오류가 발생했습니다.', 'error');
            }
        };
        fetchDepartments();
    }, [showToast]);

    // 삭제 
    const handleDelete = async (empNo) => {
        toast.info(
            <div>
                <p style={{ textAlign: "center" }}>해당 사원을 삭제하시겠습니까?</p>
                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                    <button
                        onClick={async () => {
                            try {
                                await deleteEmployeeAPI(empNo); // 사원 삭제 API 호출
                                // 삭제 후 데이터를 다시 가져오기
                                const response = await getAllEmployeesAPI({
                                    page: currentPage,
                                    size: pageSize,
                                    sortField: 'createdAt',
                                    sortDir: 'desc',
                                    keyword: searchTerm,
                                });
                                setEmployees(response.content); // 새로 가져온 데이터를 상태에 설정
                                setTotalPages(response.totalPages); // 총 페이지 수 업데이트
                                showToast('사원이 성공적으로 삭제되었습니다.', 'success');
                            } catch (error) {
                                console.error("사원 삭제 중 오류가 발생했습니다:", error);
                                showToast('사원을 삭제하는 중 문제가 발생했습니다.', 'error');
                            } finally {
                                toast.dismiss(); // 확인 창 닫기
                            }
                        }}
                        style={{
                            padding: "5px 10px",
                            backgroundColor: "#1a2b50",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        확인
                    </button>
                    <button
                        onClick={() => toast.dismiss()} // 취소 버튼 클릭 시 창 닫기
                        style={{
                            padding: "5px 10px",
                            backgroundColor: "#999999",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        취소
                    </button>
                </div>
            </div>,
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false,
            }
        );
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
        const employeeToSave = employees.find((employee) => employee.empNo === empNo);

        if (!employeeToSave.position || employeeToSave.position.trim() === "") {
            showToast('직급을 입력해야 합니다.', 'error');
            return;
        }

        const updatedDeptName =
            employeeToSave.deptName === "--부서 선택--" || !employeeToSave.deptName
                ? null
                : employeeToSave.deptName;

        const updateData = {
            position: employeeToSave.position,
            contractType: employeeToSave.contractType,
            leaveBalance: employeeToSave.leaveBalance,
            deptName: updatedDeptName,
        };

        try {

            // API 호출 및 응답 받기
            const response = await updateEmployeeAPI(empNo, updateData);

            // 업데이트 후 상태 반영
            setEmployees((prevEmployees) =>
                prevEmployees.map((employee) =>
                    employee.empNo === empNo
                        ? { ...employee, ...response, isEditing: false } // 응답 데이터를 상태에 반영
                        : employee
                )
            );

            showToast(`사원 번호 ${empNo}님의 정보가 성공적으로 수정되었습니다.`, 'success');
        } catch (error) {
            console.error("사원 수정 중 오류가 발생했습니다:", error);
            showToast('사원 정보를 수정하는 중 문제가 발생했습니다.', 'error');
        }
    };

    const handleAddEmployee = () => {
        setIsModalOpen(true);
    };

    const handleInputChange = (empNo, field, value) => {
        setEmployees((prevEmployees) =>
            prevEmployees.map((employee) =>
                employee.empNo === empNo
                    ? {
                        ...employee,
                        [field]: value === "부서 없음" || value.trim() === "" ? null : value, // null 처리 유지
                    }
                    : employee
            )
        );
    };

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await getDepartmentAPI();
                setDepartments(response.data || response);
            } catch (error) {
                console.error("부서 데이터를 가져오는 중 오류가 발생했습니다:", error);
            }
        };
        fetchDepartments();
    }, []);



    const fetchEmployees = async () => {
        try {
            const response = await getAllEmployeesAPI({
                page: currentPage,
                size: pageSize,
                sortField: 'createdAt',
                sortDir: 'desc',
                keyword: searchTerm,
            });
            setEmployees(response.content); // 전체 리스트 업데이트
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error("사원 데이터를 가져오는 중 오류 발생:", error);
        }
    };

    // 등록
    const handleSaveNewEmployee = async () => {
        try {
            if (!newEmployee.contractType) {
                showToast("계약 형태를 선택해주세요.", 'warning');
                return;
            }
            if (!newEmployee.joinDate || isNaN(new Date(newEmployee.joinDate))) {
                showToast("입사일을 올바르게 입력해주세요.", 'warning');
                return;
            }
            if (!newEmployee.birthDate || isNaN(new Date(newEmployee.birthDate))) {
                showToast("생년월일을 올바르게 입력해주세요.", 'warning');
                return;
            }

            // 날짜 형식 변환
            const formattedJoinDate = new Date(newEmployee.joinDate).toISOString().split('T')[0];
            const formattedBirthDate = new Date(newEmployee.birthDate).toISOString().split('T')[0];

            // 사원 등록 API 호출
            const response = await registerEmployeeAPI({
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

            // 서버에서 반환된 사원 데이터 확인
            await fetchEmployees(); // 최신 데이터 목록 가져오기
            setIsModalOpen(false);

            // 새로운 사원을 리스트의 맨 앞에 추가
            setEmployees((prevEmployees) => [response.data, ...prevEmployees]);

            // 입력 폼 초기화
            setNewEmployee({
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
                role: 'ROLE_EMPLOYEE',
            });

            // 모달 닫기
            setIsModalOpen(false);
            showToast('사원이 성공적으로 추가되었습니다.', 'success');
        } catch (error) {
            console.error("사원 등록 중 오류가 발생했습니다:", error);
            showToast('사원을 등록하는 중 문제가 발생했습니다.', 'error');
        }
    };


    return (
        <div className="admin-employee-management-container">
            <div className="admin-employee-top-bar">
                <h4
                    style={{
                        fontWeight: "bold",
                        display: "flex",
                        gap: "20px",
                        borderBottom: "2px solid #ddd", // 밑줄 추가
                        paddingBottom: "10px", // 라인과 텍스트 간격
                    }}
                >
                    <span
                        style={{ cursor: "pointer", color: "blue" }}
                        onClick={() => navigate('/admin/emp')}
                    >
                        구성원
                    </span>
                    <span
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate('/admin/dept')}
                    >
                        부서
                    </span>
                </h4>
                <button className="admin-employee-add-employee-button" onClick={handleAddEmployee}>+ 구성원 추가하기</button>
            </div>
            <div className="admin-employee-table-container">
                <div className="admin-employee-table-search">
                    <input
                        type="text"
                        placeholder="사원 이름 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="admin-employee-search-button">
                        <img src="/search.png" alt="검색" className="employee-search-button-icon" />
                    </button>
                </div>
                <table className="admin-employee-table">
                    <thead className="admin-employee-table-title">
                        <tr>
                            <th rowSpan="2">이름</th>
                            <th colSpan="2">기본 정보</th>
                            <th colSpan="3">인사 정보</th>
                            <th colSpan="3">개인 정보</th>
                            <th rowSpan="2"></th>
                        </tr>
                        <tr>
                            <th>사원 번호</th>
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
                                employee.name && employee.name.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((employee) => (
                                <tr key={employee.empNo}>
                                    <td>
                                        <img
                                            className="admin-employee-profile-img"
                                            src={employee.profileImageUrl || "/profile_image.png"} // 기본 프로필 이미지
                                            alt={employee.name}
                                        />
                                        <span className="admin-employee-name">{employee.name}</span>
                                    </td>
                                    <td className="admin-employee-info">{employee.empNo}</td>
                                    <td className="admin-employee-info">{employee.joinDate}</td>
                                    <td>
                                        <div className="admin-employee-edit-cell">
                                            {employee.isEditing ? (
                                                <select
                                                    value={employee.deptName || "--부서 선택--"} // 기본값 설정
                                                    onChange={(e) => {
                                                        const selectedValue = e.target.value;
                                                        handleInputChange(employee.empNo, "deptName", selectedValue === "--부서 선택--" ? null : selectedValue);
                                                    }}
                                                    style={{ width: "100px" }}
                                                >
                                                    <option value="--부서 선택--">--부서 선택--</option> {/* 기본 옵션 */}
                                                    {Array.isArray(department.content) &&
                                                        department.content.map((dept) => (
                                                            <option key={dept.id} value={dept.deptName}>
                                                                {dept.deptName}
                                                            </option>
                                                        ))}
                                                </select>
                                            ) : (
                                                employee.deptName || "부서 없음"// 부서 이름이 없으면 "부서 없음"으로 표시
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="admin-employee-edit-cell">
                                            {employee.isEditing ? (
                                                <input
                                                    type="text"
                                                    style={{ width: "70px" }}
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
                                                <select
                                                    value={contractTypes.find((type) => type.label === employee.contractType)?.value || ""}
                                                    onChange={(e) => {
                                                        const selectedValue = e.target.value; // 영어 값
                                                        if (selectedValue === "") return;
                                                        const selectedLabel = contractTypes.find((type) => type.value === selectedValue)?.label; // 한글 값
                                                        handleInputChange(employee.empNo, "contractType", selectedLabel); // label(한글)을 저장
                                                    }}
                                                    style={{ width: "100px" }}
                                                >
                                                    <option value="">-- 계약 형태 선택 --</option>
                                                    {contractTypes.map((type) => (
                                                        <option key={type.value} value={type.value}>
                                                            {type.label}
                                                        </option>
                                                    ))}
                                                </select>

                                            ) : (
                                                employee.contractType || "계약형태 없음"
                                            )}
                                        </div>
                                    </td>
                                    <td className="admin-employee-info">{employee.email}</td>
                                    <td className="admin-employee-info">{employee.phone}</td>
                                    <td className="admin-employee-info">{employee.birthDate}</td>
                                    <td>
                                        <div className="admin-employee-edit-cell"
                                            style={{ alignItems: "center", flex: "flex", justifyContent: "center" }}>
                                            {employee.isEditing ? (
                                                <button className="admin-employee-update-button" onClick={() => handleSave(employee.empNo)}
                                                    style={{ borderRadius: "5px" }}>완료</button>
                                            ) : (
                                                <button className="admin-employee-update-button" onClick={() => handleEdit(employee.empNo)}
                                                    style={{ borderRadius: "5px" }}>수정</button>
                                            )}
                                            <button className="admin-employee-delete-button" onClick={() => handleDelete(employee.empNo)}>삭제</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                <div className="admin-employee-pagination">
                    <ul className="pagination">
                        {/* 첫 페이지로 이동 */}
                        <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage(0)}
                                disabled={currentPage === 0}
                            >
                                «
                            </button>
                        </li>

                        {/* 이전 페이지로 이동 */}
                        <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                                disabled={currentPage === 0}
                            >
                                ‹
                            </button>
                        </li>

                        {/* 페이지 번호 표시 */}
                        {[...Array(5)].map((_, idx) => {
                            const pageIndex = Math.floor(currentPage / 5) * 5 + idx;
                            if (pageIndex >= totalPages) return null;
                            return (
                                <li
                                    key={pageIndex}
                                    className={`page-item ${currentPage === pageIndex ? "active" : ""}`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(pageIndex)}
                                    >
                                        {pageIndex + 1}
                                    </button>
                                </li>
                            );
                        })}

                        {/* 다음 페이지로 이동 */}
                        <li className={`page-item ${currentPage === totalPages - 1 ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                                disabled={currentPage === totalPages - 1}
                            >
                                ›
                            </button>
                        </li>

                        {/* 마지막 페이지로 이동 */}
                        <li className={`page-item ${currentPage === totalPages - 1 ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage(totalPages - 1)}
                                disabled={currentPage === totalPages - 1}
                            >
                                »
                            </button>
                        </li>
                    </ul>
                </div>

            </div>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="사원 등록"
                className="admin-employee-modal"
                overlayClassName="admin-employee-modal-overlay"
            >
                <h5 style={{ fontWeight: "bold", marginBottom: "30px", textAlign: "center" }}>사원 등록</h5>
                <div className="admin-employee-modal-content">
                    <label>이름</label>
                    <input
                        type="text"
                        placeholder='이름을 입력해 주세요.'
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    />
                    <label>사원 번호</label>
                    <input
                        type="text"
                        placeholder='중복되지 않는 사원 번호를 입력해주세요.'
                        value={newEmployee.employeeNumber}
                        onChange={(e) => setNewEmployee({ ...newEmployee, employeeNumber: e.target.value })}
                    />
                    <label>비밀번호</label>
                    <input
                        type="password"
                        placeholder='비밀번호는 8자 이상이어야 합니다.'
                        value={newEmployee.password}
                        onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                    />
                    <label>입사일</label>
                    <input
                        type="date"
                        placeholder='입사일을 입력해 주세요.'
                        value={newEmployee.joinDate || ''}
                        onChange={(e) => setNewEmployee({ ...newEmployee, joinDate: e.target.value })}
                    />
                    <label>부서</label>
                    <select
                        value={newEmployee.department || ''}
                        onChange={(e) =>
                            setNewEmployee({
                                ...newEmployee,
                                department: e.target.value === "부서 없음" ? null : e.target.value,
                            })
                        }
                    >
                        <option value="">-- 부서 선택 --</option>
                        {Array.isArray(department.content) && department.content.map((dept) => (
                            <option key={dept.id} value={dept.deptName}>
                                {dept.deptName}
                            </option>
                        ))}
                    </select>
                    <label>직급</label>
                    <input
                        type="text"
                        placeholder='직급을 입력해 주세요.'
                        value={newEmployee.position}
                        onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                    />
                    <label>계약 형태</label>
                    <select
                        value={newEmployee.contractType}
                        onChange={(e) => setNewEmployee({ ...newEmployee, contractType: e.target.value })}
                    >
                        <option value="">-- 계약 형태 선택 --</option>
                        {contractTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                    <label>이메일</label>
                    <input
                        type="email"
                        placeholder='업무용 이메일을 입력해 주세요.'
                        value={newEmployee.email}
                        onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    />
                    <label>연락처</label>
                    <input
                        type="text"
                        placeholder="연락처는 '-' 없이 11자리이어야 합니다."
                        value={newEmployee.phone}
                        onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    />
                    <label>생일</label>
                    <input
                        type="date"
                        placeholder='생일을 입력해 주세요.'
                        value={newEmployee.birthDate || ''}
                        onChange={(e) => setNewEmployee({ ...newEmployee, birthDate: e.target.value })}
                    />
                    <label>휴가 일수</label>
                    <input
                        type="number"
                        value={newEmployee.leaveBalance}
                        onChange={(e) => setNewEmployee({ ...newEmployee, leaveBalance: e.target.value })}
                    />
                    <label>역할</label>
                    <select
                        value={newEmployee.role}
                        onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                    >
                        <option value="">-- 역할 선택 --</option>
                        <option value="ROLE_EMPLOYEE">사원</option>
                        <option value="ROLE_ADMIN">관리자</option>
                    </select>
                </div>
                <div className="admin-employee-modal-buttons">
                    <button onClick={handleSaveNewEmployee}
                        style={{ borderRadius: "5px", backgroundColor: "#1a2b50", color: "white", border: "none" }}
                    >저장</button>
                    <button onClick={() => setIsModalOpen(false)}
                        style={{ borderRadius: "5px", backgroundColor: "#999999", color: "white", border: "none" }}
                    >취소</button>
                </div>
            </Modal>
        </div>
    );
};

export default EmployeeManagement;