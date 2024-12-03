import React, { useEffect, useState } from "react";
import { getMyPageAPI, updateMyPageAPI } from "../../api/employee/index";
import "./MyPage.css";

const MyPage = () => {
    const [userData, setUserData] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("intro"); 
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({}); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getMyPageAPI();
                setUserData(data);
                setFormData(data?.data || {}); 
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 수정
    const handleSave = async () => {
        try {
            await updateMyPageAPI(formData); 
            setUserData((prev) => ({ ...prev, data: { ...prev.data, ...formData } }));
            setIsEditing(false); 
            alert("프로필이 성공적으로 수정되었습니다!");
        } catch (error) {
            alert(`수정 중 오류가 발생했습니다: ${error.message}`);
        }
    };

    if (loading) return <div className="mypage-loading">로딩 중...</div>;
    if (error) return <div className="mypage-error">오류: {error}</div>;

    return (
        <div className="mypage-container">
            <div className="mypage-left">
                <div className="mypage-profile-section">
                    <img
                        className="mypage-profile-img"
                        src={formData?.profileImageUrl || "https://via.placeholder.com/150"}
                        alt={formData?.name || "프로필 사진"}
                    />
                    <button
                        className="mypage-profile-edit-button"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        프로필 수정 
                    </button>
                </div>
                <div className="mypage-profile-info">
                    <h2 className="mypage-profile-name">
                        {formData.name} / {formData.position}
                    </h2>
                </div>

                <div className="mypage-basic-info">
                    <h5 style={{marginTop: "60px", marginBottom: "30px", fontWeight: "bold"}}>기본 정보</h5>
                    {isEditing ? (
                        <>
                            <div className="mypage-info-item">
                                <label>이메일:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mypage-info-item">
                                <label>비밀번호:</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mypage-info-item">
                                <label>연락처:</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mypage-info-item">
                                <label>생일:</label>
                                <input
                                    type="date"
                                    name="birthDate"
                                    value={formData.birthDate || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mypage-info-item">
                                <span>이메일:</span>
                                <span>{userData?.data.email}</span>
                            </div>
                            <div className="mypage-info-item">
                                <span>비밀번호:</span>
                                <span>***********</span>
                            </div>
                            <div className="mypage-info-item">
                                <span>연락처:</span>
                                <span>{userData?.data.phone}</span>
                            </div>
                            <div className="mypage-info-item">
                                <span>생일:</span>
                                <span>{userData?.data.birthDate}</span>
                            </div>
                            <div className="mypage-info-item">
                                <span>부서:</span>
                                <span>{userData?.data.deptName}</span>
                            </div>
                        </>
                    )}
                </div>
                {isEditing && (
                    <div className="mypage-edit-buttons">
                        <button className="mypage-save-button" onClick={handleSave}>
                            저장
                        </button>
                        <button
                            className="mypage-cancel-button"
                            onClick={() => setIsEditing(false)}
                        >
                            취소
                        </button>
                    </div>
                )}
            </div>
            <div className="mypage-right">
                <div className="mypage-tabs">
                    <button
                        className={`mypage-tab-button ${activeTab === "intro" ? "active" : ""}`}
                        onClick={() => setActiveTab("intro")}
                    >
                        자기 소개
                    </button>
                    <button
                        className={`mypage-tab-button ${activeTab === "hr" ? "active" : ""}`}
                        onClick={() => setActiveTab("hr")}
                    >
                        인사 정보
                    </button>
                </div>

                {activeTab === "intro" && (
                    <div className="mypage-intro">
                        <h5 style={{fontWeight: "bold", marginLeft: "10px", marginBottom: "20px"}}>자기 소개</h5>
                        {isEditing ? (
                            <textarea
                                name="introduction"
                                value={formData.introduction || ""}
                                onChange={handleInputChange}
                            />
                        ) : (
                            <p className="mypage-introduction">{userData?.data.introduction || "등록된 정보가 없습니다."}</p>
                        )}
                    </div>
                )}

                {activeTab === "hr" && (
                    <div className="mypage-hr">
                        <div className="mypage-job-info">
                            <h5 className="mypage-info-title">근무 기본정보</h5>
                            <div className="mypage-info-item">
                                <span>계약 형태:</span>
                                <span>{userData?.data.contractType || "계약 형태 없음"}</span>
                            </div>
                            <div className="mypage-info-item">
                                <span>일하는 날:</span>
                                <span>월요일, 화요일, 수요일, 목요일, 금요일</span>
                            </div>
                            <div className="mypage-info-item">
                                <span>근무 시간:</span>
                                <span>09:00 ~ 18:00</span>
                            </div>
                            <h5 className="mypage-info-title">인사발령 정보</h5>
                            <div className="mypage-info-item">
                                <span>{userData?.data.joinDate || "인사발령 정보 없음"}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPage;