import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import './Todo.css';
// import '@fullcalendar/daygrid/main.css';
// import '@fullcalendar/timegrid/main.css';
// import '@fullcalendar/common/main.css';


const TodoPage = () => {
    const [events, setEvents] = useState([
        { title: "회의", start: "2024-11-25T10:00:00", end: "2024-11-25T12:00:00" },
        { title: "휴가", start: "2024-11-28", allDay: true },
      ]);
    
      const handleDateClick = (info) => {
        alert(`날짜 클릭: ${info.dateStr}`);
      };
    
      const handleEventClick = (info) => {
        alert(`이벤트 클릭: ${info.event.title}`);
      };
    
      const handleDateSelect = (selectInfo) => {
        const title = prompt("새로운 이벤트 제목:");
        if (title) {
          setEvents([
            ...events,
            { title, start: selectInfo.startStr, end: selectInfo.endStr },
          ]);
        }
      };
    
      return (
        <div className="calendar-container">
            <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height = "1000px"
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            selectable={true}
            select={handleDateSelect}
            editable={true}
            />
        </div>
      );
};

export default TodoPage;