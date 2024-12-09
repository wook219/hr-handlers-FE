import React, { useState, useEffect } from "react";
import AttendanceButton from "../../components/Home/AttendanceButton";
import NoticeBoard from "../../components/Home/NoticeBoard";

const Home = () => {

  return (
    <>
      <NoticeBoard />
      <AttendanceButton />
    </>
  );
};

export default Home;