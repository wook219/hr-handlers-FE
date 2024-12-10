import React from "react";
import AttendanceButton from "../../components/Home/AttendanceButton";
import NoticeBoard from "../../components/Home/NoticeBoard";
import TodayTodoList from "../../components/Home/TodayTodoList"
import TeamMembers from "../../components/Home/TeamMembers";
const Home = () => {

  return (
    <>
      <div className="home-container">
            <div className="main-content">
              <div className="notice-board-container">
                <NoticeBoard />
              </div>

              <div className="team-member-container">
                <TeamMembers />
              </div>
              
              <div className="attendance-button-container">
                <AttendanceButton />
              </div>
            </div>
            <TodayTodoList />
      </div>
    </>
  );
};

export default Home;