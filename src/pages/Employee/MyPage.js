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
    const [selectedFile, setSelectedFile] = useState(null); // 업로드할 파일
    const [previewImage, setPreviewImage] = useState(null); // 이미지 미리보기 URL

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getMyPageAPI();
                const profileImage = data?.data?.profileImageUrl || "/profile_image.png"; // 기본값 설정
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
    const handleSave = async () => {
        try {

            const passwordToSend = formData.password !== "*********"
                ? formData.password // 새 비밀번호를 전송
                : undefined; // 사용자가 수정하지 않으면 undefined

            // 프로필 사진 업로드 처리
            let uploadedImageUrl = formData.profileImageUrl; // 기본 값으로 기존 URL 유지
            if (selectedFile) {
                const formDataToUpload = new FormData();
                formDataToUpload.append("profileImage", selectedFile);

                // 업로드 API 호출 (업로드 성공 시 URL 반환)
                uploadedImageUrl = await updateMyPageAPI(formDataToUpload);
            }

            // 업데이트할 데이터를 준비
            const updatedData = {
                ...formData,
                password: passwordToSend,
                profileImageUrl: uploadedImageUrl,
            };

            // API 호출로 데이터 업데이트
            await updateMyPageAPI(updatedData);
            setUserData((prev) => ({ ...prev, data: { ...prev.data, ...updatedData } }));
            setIsEditing(false);
            alert("프로필이 성공적으로 수정되었습니다!");
        } catch (error) {
            alert(`수정 중 오류가 발생했습니다: ${error.message}`);
        }
    };

    const handleCancel = () => {
        setIsEditing(false); // 수정 모드 종료
        setPreviewImage(userData?.data?.profileImageUrl || "/profile_image.png"); // 기본값 설정
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
                            src={previewImage || formData.profileImageUrl} // public 폴더 기준 경로
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
                                    placeholder="*********"
                                    value={formData.password || ""}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                        </>
                    )}
                </div>
                <div className="mypage-department-info">
                    <h5 style={{ fontWeight: "bold", marginTop: "40px" }}>부서</h5>
                    <div className="mypage-info-item">
                        <span style={{ marginTop: "10px", marginLeft: "20px" }}>{userData?.data.deptName || "등록된 부서 없음"}</span>
                    </div>
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