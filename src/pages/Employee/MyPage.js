import React, { useEffect, useState } from "react";
import { getMyPageAPI, updateMyPageAPI } from "../../api/employee/index";
import "./MyPage.css";
import axios from 'axios';

const MyPage = () => {
    const [userData, setUserData] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("intro");
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [selectedFile, setSelectedFile] = useState(null); // 업로드할 파일
    const [previewImage, setPreviewImage] = useState(null); // 이미지 미리보기 URL
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getMyPageAPI();
                console.log('API Response:', data); // 여기서 실제 데이터 확인
                const profileImage = data.data.profileImage || "/profile_image.png"; // 기본값 설정
                setFormData({
                    email: data.data.email || "",
                    password: "*********", // 기본값으로 더미 비밀번호 설정
                    phone: data.data.phone || "",
                    birthDate: data.data.birthDate || "",
                    name: data.data.name || "",
                    position: data.data.position || "",
                    profileImage,
                });
                setUserData(data);
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file); // 선택한 파일 저장
            setPreviewImage(URL.createObjectURL(file)); // 미리보기 설정
        }
    };


    // 수정
    /*
    const handleSave = async () => {
        try {
            const passwordToSend = formData.password !== "*********"
                ? formData.password 
                : undefined;
    
            const updateRequest = {
                email: formData.email,
                password: passwordToSend,
                phone: formData.phone,
                introduction: formData.introduction
            };
    
            const formDataToSend = new FormData();
            // updateRequest를 JSON 문자열로 변환하여 추가
            formDataToSend.append('updateRequest', new Blob([JSON.stringify(updateRequest)], { 
                type: 'application/json' 
            }));
            
            // 새 이미지가 선택된 경우에만 추가
            if (selectedFile) {
                formDataToSend.append('profileImage', selectedFile);
            }
    
            const response = await updateMyPageAPI(formDataToSend);
            setUserData((prev) => ({ ...prev, data: { ...prev.data, ...updateRequest } }));
            setIsEditing(false);
            alert("프로필이 성공적으로 수정되었습니다!");
        } catch (error) {
            alert(`수정 중 오류가 발생했습니다: ${error.message}`);
        }
    };*/


    const handleSave = async () => {
        try {
            const passwordToSend = formData.password !== "*********"
                ? formData.password 
                : undefined;
    
            const updateRequest = {
                email: formData.email,
                password: passwordToSend,
                phone: formData.phone,
                introduction: formData.introduction
            };
    
            const formDataToSend = new FormData();
            // updateRequest를 JSON 문자열로 변환하여 추가
            formDataToSend.append('updateRequest', new Blob([JSON.stringify(updateRequest)], { 
                type: 'application/json' 
            }));
            
            // 새 이미지가 선택된 경우에만 추가
            if (selectedFile) {
                formDataToSend.append('profileImage', selectedFile);
            }
    
            // API 호출로 데이터 업데이트
            await updateMyPageAPI(formDataToSend);
            
            // 서버에서 업데이트된 데이터 다시 가져오기
            const updatedData = await getMyPageAPI();
            setUserData(updatedData);
            
            // 상태 초기화
            setPreviewImage(null);
            setSelectedFile(null);
            setFormData(prev => ({
                ...prev,
                profileImageUrl: updatedData.data.profileImage
            }));
            
            setIsEditing(false);
            alert("프로필이 성공적으로 수정되었습니다!");
        } catch (error) {
            alert(`수정 중 오류가 발생했습니다: ${error.message}`);
        }
    };


    const handleCancel = () => {
        setIsEditing(false); // 수정 모드 종료
        setPreviewImage(userData?.data?.profileImage || "/profile_image.png"); // 기본값 설정
        setSelectedFile(null); // 선택된 파일 초기화
        setFormData(userData?.data || {}); // 원래 데이터로 복원
    };



    if (loading) return <div className="mypage-loading">로딩 중...</div>;
    if (error) return <div className="mypage-error">오류: {error}</div>;

    return (
        <div className="mypage-container">
            <div className="mypage-left">
                <div className="mypage-profile-section">
                    <label htmlFor="profileImageInput">
                        <img
                            className="mypage-profile-img"
                            src={previewImage || formData.profileImage || "/profile_image.png"} // public 폴더 기준 경로
                            alt={formData?.name || "프로필 사진"}
                        />
                    </label>
                    {isEditing && (
                        <input
                            id="profileImageInput"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                    )}
                    <button
                        className="mypage-profile-edit-button"
                        onClick={() => {
                            if (!isEditing) {
                                setIsEditing(true);
                            }
                        }}
                        disabled={isEditing}
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
                    <h5 style={{ marginTop: "60px", marginBottom: "30px", fontWeight: "bold" }}>기본 정보</h5>
                    {isEditing ? (
                        <>
                            <div className="mypage-info-item">
                                <label>이메일</label>
                                <input
                                    type="email"
                                    name="email"
                                    style={{ width: "200px" }}
                                    value={formData.email || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mypage-info-item">
                                <label>비밀번호</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className="mypage-password-input"
                                    placeholder="*********"
                                    value={formData.password || ""}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <div className="mypage-password-toggle">
                                    <input
                                        type="checkbox"
                                        id="showPassword"
                                        className="mypage-password-checkbox"
                                        checked={showPassword}
                                        onChange={() => setShowPassword((prev) => !prev)}
                                    />
                                    <label htmlFor="showPassword" className="mypage-password-label">
                                        비밀번호 보기
                                    </label>
                                </div>
                            </div>

                            <div className="mypage-info-item">
                                <label>연락처</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mypage-info-item">
                                <label>생일</label>
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
                                <span>이메일</span>
                                <span>{userData?.data.email}</span>
                            </div>
                            <div className="mypage-info-item">
                                <span>비밀번호</span>
                                <span>***********</span>
                            </div>
                            <div className="mypage-info-item">
                                <span>연락처</span>
                                <span>{userData?.data.phone}</span>
                            </div>
                            <div className="mypage-info-item">
                                <span>생일</span>
                                <span>{userData?.data.birthDate}</span>
                            </div>
                        </>
                    )}
                </div>
                <div className="mypage-department-info">
                    <h5 style={{ fontWeight: "bold", marginTop: "40px" }}>부서</h5>
                        <span style={{ marginTop: "10px", marginLeft: "50px" }}>{userData?.data.deptName || "등록된 부서 없음"}</span>
                </div>
                {isEditing && (
                    <div className="mypage-edit-buttons">
                        <button className="mypage-save-button" onClick={handleSave}>
                            저장
                        </button>
                        <button className="mypage-cancel-button" onClick={handleCancel}>
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
                        <h6 style={{ fontWeight: "bold", marginLeft: "10px", marginBottom: "20px" }}>자기 소개</h6>
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
                            <h6 className="mypage-info-title">근무 기본정보</h6>
                            <div className="mypage-info-item-tab">
                                <span>계약 형태:</span>
                                <span>{userData?.data.contractType || "계약 형태 없음"}</span>
                            </div>
                            <div className="mypage-info-item-tab">
                                <span>일하는 날:</span>
                                <span>월요일, 화요일, 수요일, 목요일, 금요일</span>
                            </div>
                            <div className="mypage-info-item-tab">
                                <span>근무 시간:</span>
                                <span>09:00 ~ 18:00</span>
                            </div>
                            <h6 className="mypage-info-title">인사발령정보</h6>
                            <div className="mypage-info-item-tab">
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