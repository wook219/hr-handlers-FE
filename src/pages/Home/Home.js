import React, { useState, useEffect } from "react";
import AttendanceButton from "../../components/Home/AttendanceButton";
import NoticeBoard from "../../components/Home/NoticeBoard";
import TodayTodoList from "../../components/Home/TodayTodoList"
const Home = () => {

  return (
    <>
      <div className="home-container">
            <div className="main-content">
                <NoticeBoard />
                <AttendanceButton />
            </div>
            <TodayTodoList />
      </div>
    </>
  );
};

export default Home;