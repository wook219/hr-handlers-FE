import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getDepartmentAPI,
    updateDepartmentAPI,
    deleteDepartmentAPI,
    addDepartmentAPI,
} from "../../../api/employee/index";
import './AdminDepartmentPage.css';

const DepartmentManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newDepartmentName, setNewDepartmentName] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const navigate = useNavigate();

    // 부서 데이터를 가져오는 함수
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const data = await getDepartmentAPI();
                setDepartments(data);
            } catch (error) {
                console.error("부서 데이터를 가져오는 중 오류가 발생했습니다:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDepartments();
    }, []);

    // 부서 추가 처리
    const handleAddDepartment = async () => {
        try {
            if (!newDepartmentName.trim()) {
                alert("부서 이름을 입력해주세요!");
                return;
            }
            await addDepartmentAPI(newDepartmentName);
            const updatedDepartments = await getDepartmentAPI();
            setDepartments(updatedDepartments);
            setNewDepartmentName("");
            setShowAddModal(false);
            alert("새 부서가 추가되었습니다!");
        } catch (error) {
            console.error("부서 추가 중 오류가 발생했습니다:", error);
            alert("부서를 추가하는 중 문제가 발생했습니다.");
        }
    };

    // 부서 수정 처리
    const handleEditDepartment = async (departmentId) => {
        try {
            const newName = prompt("새 부서 이름을 입력하세요:");
            if (newName) {
                const updatedData = { deptName: newName }; // Query String으로 전달할 데이터
                await updateDepartmentAPI(departmentId, updatedData);
                const updatedDepartments = await getDepartmentAPI(); // 변경된 데이터 다시 가져오기
                setDepartments(updatedDepartments);
                alert("부서 이름이 수정되었습니다!");
            }
        } catch (error) {
            console.error("부서 수정 중 오류가 발생했습니다:", error);
            alert("부서를 수정하는 중 문제가 발생했습니다.");
        }
    };

    // 부서 삭제 처리
    const handleDeleteDepartment = async (departmentId) => {
        try {
            const confirmDelete = window.confirm("이 부서를 삭제하시겠습니까?");
            if (confirmDelete) {
                await deleteDepartmentAPI(departmentId);
                const updatedDepartments = await getDepartmentAPI();
                setDepartments(updatedDepartments);
                alert("부서가 삭제되었습니다!");
            }
        } catch (error) {
            console.error("부서 삭제 중 오류가 발생했습니다:", error);
            alert("부서를 삭제하는 중 문제가 발생했습니다.");
        }
    };

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>오류 발생: {error}</div>;

    return (
        <div className="dept-management-container">
            {/* 상단 메뉴 */}
            <div className="dept-management-top-bar">
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
                        style={{ cursor: "pointer", color: "black" }}
                        onClick={() => navigate('/admin/emp')}
                    >
                        구성원
                    </span>
                    <span
                        style={{ cursor: "pointer", color: "blue" }}
                        onClick={() => navigate('/admin/dept')}
                    >
                        부서
                    </span>
                </h4>

                <button
                    className="dept-add-department-button"
                    onClick={() => setShowAddModal(true)}
                >
                    + 부서 추가하기
                </button>
            </div>

            <table className="dept-department-table">
                <thead>
                    <tr>
                        <th>부서 번호</th>
                        <th>부서 이름</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {departments.map((department) => (
                        <tr key={department.id}>
                            <td>{department.id}</td>
                            <td>{department.deptName}</td>
                            <td>
                                <button
                                    className="dept-edit-button"
                                    onClick={() => handleEditDepartment(department.id)}
                                >
                                    수정
                                </button>
                                <button
                                    className="dept-delete-button"
                                    onClick={() => handleDeleteDepartment(department.id)}
                                >
                                    삭제
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showAddModal && (
                <div className="dept-modal-overlay">
                    <div className="dept-modal">
                        <h5 style={{marginBottom: "20px"}}>부서 등록</h5>
                        <div style={{ alignItems: "center" }}>
                        <input
                            style={{width: '100%', borderRadius: "5px", borderColor: "#bdbdbd" }}
                            type="text"
                            placeholder="새로운 부서 이름을 입력해주세요."
                            value={newDepartmentName}
                            onChange={(e) => setNewDepartmentName(e.target.value)}
                        />
                        <button className="dept-save-button" onClick={handleAddDepartment}>
                            저장
                        </button>
                        </div>
                        <button
                            className="dept-cancel-button"
                            onClick={() => setShowAddModal(false)}
                        >
                            X
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentManagement;
