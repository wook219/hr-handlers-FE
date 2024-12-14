import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getDepartmentAPI,
    updateDepartmentAPI,
    deleteDepartmentAPI,
    addDepartmentAPI,
} from "../../../api/employee/index";
import { useToast } from '../../../context/ToastContext';
import { toast } from "react-toastify";
import './AdminDepartmentPage.css';

const DepartmentManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editDepartmentId, setEditDepartmentId] = useState(null);
    const [newDepartmentName, setNewDepartmentName] = useState("");
    const [editDepartmentName, setEditDepartmentName] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();
    const { showToast } = useToast();

    // 부서 데이터를 가져오는 함수
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await getDepartmentAPI({
                    page: currentPage,
                    size: pageSize,
                    keyword: searchTerm,
                });
                setDepartments(response.content || []);
                setTotalPages(response.totalPages || 0);
            } catch (error) {
                console.error("부서 데이터를 가져오는 중 오류가 발생했습니다:", error);
                showToast("부서 데이터를 가져오는 중 오류가 발생했습니다.", "error");
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDepartments();
    }, [currentPage, pageSize, searchTerm, showToast]);

    // 검색 처리
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(0); // 검색 시 첫 페이지로 초기화
    };

    // 부서 삭제 확인 메시지
    const confirmDelete = (callback) => {
        toast.info(
            <div>
                <p style={{ textAlign: "center" }}>이 부서를 삭제하시겠습니까?</p>
                <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginRight: "25px" }}>
                    <button
                        onClick={() => {
                            callback(true);
                            toast.dismiss();
                        }}
                        style={{ padding: "5px 10px", backgroundColor: "#1a2b50", color: "white", border: "none", borderRadius: "5px" }}
                    >
                        확인
                    </button>
                    <button
                        onClick={() => {
                            callback(false);
                            toast.dismiss();
                        }}
                        style={{ padding: "5px 10px", backgroundColor: "#999999", color: "white", border: "none", borderRadius: "5px" }}
                    >
                        취소
                    </button>
                </div>
            </div>,
            {
                position: "top-center",
                autoClose: false, // 사용자가 버튼을 누르기 전까지 닫히지 않음
                closeOnClick: false,
                draggable: false,
                closeButton: false, // 닫기 버튼 비활성화
            }
        );
    };

    // 부서 추가 처리
    const handleAddDepartment = async () => {
        try {
            if (!newDepartmentName.trim()) {
                showToast("부서 이름을 입력해주세요.", "warning");
                return;
            }
            await addDepartmentAPI(newDepartmentName);

            const response = await getDepartmentAPI({
                page: currentPage,
                size: pageSize,
                keyword: searchTerm,
            });
            setDepartments(response.content || []); // 배열로 설정
            setTotalPages(response.totalPages || 0);

            setNewDepartmentName("");
            setShowAddModal(false);
            showToast("새 부서가 성공적으로 추가되었습니다!", "success");
        } catch (error) {
            console.error("부서 추가 중 오류가 발생했습니다:", error);
            showToast("부서가 이미 존재합니다.", "error");
        }
    };

    // 부서 수정 처리
    const handleEditDepartment = (departmentId, currentName) => {
        setEditDepartmentId(departmentId); // 수정할 부서 ID 저장
        setNewDepartmentName(currentName); // 현재 부서 이름을 입력 필드에 초기화
        setShowEditModal(true); // 수정 모달 열기
    };

    const saveEditDepartment = async () => {
        try {
            if (!editDepartmentName || !editDepartmentName.trim()) {
                showToast("부서 이름을 입력해주세요!", "warning");
                return;
            }
            const updatedData = { deptName: editDepartmentName.trim() };
            await updateDepartmentAPI(editDepartmentId, updatedData);

            const response = await getDepartmentAPI({
                page: currentPage,
                size: pageSize,
                keyword: searchTerm,
            });

            setDepartments(response.content || []);
            setTotalPages(response.totalPages || 0);

            setShowEditModal(false); // 수정 모달 닫기
            setNewDepartmentName(""); // 입력 필드 초기화
            showToast("부서 이름이 성공적으로 수정되었습니다!", "success");
        } catch (error) {
            console.error("부서 수정 중 오류가 발생했습니다:", error);
            showToast("부서를 수정하는 중 문제가 발생했습니다.", "error");
        }
    };

    // 부서 삭제 처리
    const handleDeleteDepartment = async (departmentId) => {
        confirmDelete(async (confirmed) => {
            if (confirmed) {
                try {
                    await deleteDepartmentAPI(departmentId);

                    const response = await getDepartmentAPI({
                        page: currentPage,
                        size: pageSize,
                        keyword: searchTerm,
                    });
                    setDepartments(response.content || []); // 새로 가져온 데이터로 설정
                    setTotalPages(response.totalPages || 0);

                    showToast("부서가 성공적으로 삭제되었습니다!", "success");
                } catch (error) {
                    console.error("부서 삭제 중 오류가 발생했습니다:", error);
                    showToast("부서를 삭제하는 중 문제가 발생했습니다.", "error");
                }
            } else {
                showToast("부서 삭제가 취소되었습니다.", "info");
            }
        });
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

            <div className="dept-management-search">
                <input
                    type="text"
                    placeholder="부서 이름 검색..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <button className="admin-dept-search-button">
                    <img src="/search.png" alt="검색" className="dept-search-button-icon" />
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
                    {Array.isArray(departments) && departments.map((department) => (
                        <tr key={department.id}>
                            <td>{department.id}</td>
                            <td>{department.deptName}</td>
                            <td>
                                <button
                                    className="dept-edit-button"
                                    onClick={() => handleEditDepartment(department.id, department.deptName)}
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
            <div className="dept-pagination-container">
                <ul className="pagination">
                    <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                        <button
                            className="page-link"
                            onClick={() => setCurrentPage(0)}
                            disabled={currentPage === 0}
                        >
                            «
                        </button>
                    </li>
                    <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                        <button
                            className="page-link"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                            disabled={currentPage === 0}
                        >
                            ‹
                        </button>
                    </li>
                    {[...Array(totalPages)].map((_, idx) => (
                        <li
                            key={idx}
                            className={`page-item ${currentPage === idx ? "active" : ""}`}
                        >
                            <button className="page-link" onClick={() => setCurrentPage(idx)}>
                                {idx + 1}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages - 1 ? "disabled" : ""}`}>
                        <button
                            className="page-link"
                            onClick={() =>
                                setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
                            }
                            disabled={currentPage === totalPages - 1}
                        >
                            ›
                        </button>
                    </li>
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

            {showAddModal && (
                <div className="dept-modal-overlay">
                    <div className="dept-modal">
                        <h5 style={{ marginBottom: "20px" }}>부서 등록</h5>
                        <div style={{ alignItems: "center" }}>
                            <input
                                style={{ width: '80%', borderRadius: "5px", border: "1px solid #e0e0e0", borderColor: "#bdbdbd" }}
                                type="text"
                                placeholder="등록할 부서 이름을 입력해주세요."
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
                            x
                        </button>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="dept-modal-overlay">
                    <div className="dept-modal">
                        <h5 style={{ marginBottom: "20px" }}>부서 수정</h5>
                        <div>
                            <input
                                type="text"
                                placeholder="새 부서 이름을 입력해주세요."
                                value={editDepartmentName}
                                onChange={(e) => setEditDepartmentName(e.target.value)}
                                style={{
                                    width: "80%",
                                    padding: "5px",
                                    borderRadius: "5px",
                                    border: "1px solid #ddd",
                                }}
                            />
                            <button
                                onClick={saveEditDepartment}
                                className="dept-save-button"
                            >
                                저장
                            </button>
                        </div>
                        <button
                            onClick={() => {
                                setShowEditModal(false);
                                setEditDepartmentName("");
                            }}
                            className="dept-cancel-button"
                        >
                            x
                        </button>
                    </div>
                </div>
            )}
        </div >
    );
};

export default DepartmentManagement;
