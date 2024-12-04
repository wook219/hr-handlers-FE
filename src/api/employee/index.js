import instance from "../axios";

// 사원 관련 API 요청 처리

// 로그인 API
export const loginAPI = async (empNo, password) => {
    try {
        const response = await instance.post("/login", { empNo, password });

        // 헤더에서 토큰 추출
        const token = response.headers["access"];

        if (!token) {
            throw new Error("헤더에서 JWT 토큰을 가져올 수 없습니다.");
        }

        // 토큰 반환
        return token;
    } catch (error) {
        // 오류 처리
        console.error("로그인 API 오류:", error.response?.data || error.message);
        throw error;
    }
};

// 마이페이지 조회 API
export const getMyPageAPI = async () => {
    try {
        const response = await instance.get('/emp');
        return response.data;
    } catch (error) {
        console.error("마이페이지 데이터 가져오기 오류:", error.response?.data || error.message);
        throw error;
    }
};

// 마이페이지 수정 API
export const updateMyPageAPI = async (formData) => {
    const token = localStorage.getItem("access_token");

    const response = await instance.patch("/emp", formData, {
        headers: {
            access: token,
        },
    });
    return response.data;
};

// 관리자: 사원 등록 API
export const registerEmployeeAPI = async (empData) => {
    try {
        const token = localStorage.getItem("access_token");
        const response = await instance.post("/admin/emp", empData, {
            headers: {
                access: token,
            },
        });
        return response.data;
    } catch (error) {
        console.error("사원 등록 오류:", error.response?.data || error.message);
        throw error;
    }
};

// 관리자: 사원 전체 조회 API
export const getAllEmployeesAPI = async (searchParams) => {
    try {
        const token = localStorage.getItem("access_token");
        const response = await instance.get("/admin/emp", {
            params: searchParams,
            headers: {
                access: token,
            },
        });
        return response.data.data;
    } catch (error) {
        console.error("사원 조회 오류:", error.response?.data || error.message);
        throw error;
    }
};

// 관리자: 사원 수정 API
export const updateEmployeeAPI = async (empNo, updateData) => {
    try {
        const response = await instance.patch(`/admin/emp/${empNo}`, updateData, {
            headers: {
                access: `${localStorage.getItem("access_token")}`, // 토큰 추가
            },
        });
        return response.data;
    } catch (error) {
        console.error("사원 수정 오류:", error.response?.data || error.message);
        throw error;
    }
};

// 관리자: 사원 삭제 API
export const deleteEmployeeAPI = async (empNo) => {
    try {
        const response = await instance.delete(`/admin/emp/${empNo}`, {
            headers: {
                access: `${localStorage.getItem("access_token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("사원 삭제 오류:", error.response?.data || error.message);
        throw error;
    }
};

export const matchEmailAndEmpNoAPI = async (empNo, email) => {
    try {
        const response = await instance.post("/emp/check", { empNo, email }, {
            headers: {
                access: localStorage.getItem("access_token"),
            },
        });
        return response.data;
    } catch (error) {
        console.error("사원 번호와 이메일 일치 여부 확인 오류:", error.response?.data || error.message);
        throw error;
    }
};

export const sendResetPasswordAPI = async (empNo, email) => {
    try {
        const response = await instance.post("/emp/send/mail", { empNo, email }, {
            headers: {
                access: localStorage.getItem("access_token"),
            },
        });
        console.log("메일 전송 API 응답:", response.data); 
        return response.data;
    } catch (error) {
        console.error("임시 비밀번호 전송 오류:", error.response?.data || error.message);
        throw error;
    }
};


// 사용자 정보 API
export const fetchUserInfo = async () => {
    try {
        // 서버에서 사용자 정보 가져옴
        const response = await instance.get("/emp", {
            headers: {
                access: `${localStorage.getItem("access_token")}`, // 토큰 추가
            },
        });
        // API 응답 데이터 반환
        return response.data.data;
    } catch (error) {
        console.error("사용자 정보 가져오기 오류:", error.response?.data || error.message);
        throw error;
    }
};