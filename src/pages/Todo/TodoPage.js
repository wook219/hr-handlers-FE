import React, { useState, useRef, useCallback, useEffect  } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Todo.css';
import { useToast } from '../../context/ToastContext';
import 'react-toastify/dist/ReactToastify.css';
import TodoDetailModal from "../../components/Todo/TodoDetailModal";
import TodoEnrollModal from "../../components/Todo/TodoEnrollModal";
import { getAllTodosAPI, getTodoDetailAPI, enrollTodoAPI, modifyTodoAPI, deleteTodoAPI, getHolidaysAPI } from '../../api/todo'; // Todo API 가져오기

const TodoPage = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null); // 선택된 이벤트 상태
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const calendarRef = useRef(null);
    const { showToast } = useToast();

    // 일정 전체 조회
    const searchAllTodos = useCallback(async (fetchInfo, successCallback, failureCallback) => {
      try {
        const startDate = fetchInfo.startStr.split('T')[0];
        const endDate = fetchInfo.endStr.split('T')[0];

        if (!calendarRef.current) {
          const todos = await getAllTodosAPI(startDate, endDate);
          const formattedEvents = todos.map(todo => ({
            id: todo.id,
            title: todo.title,
            start: todo.startTime,
            end: todo.endTime,
            backgroundColor: '#4a90e2',
            classNames: ['todo-event']
          }));
          successCallback(formattedEvents);
          return;
        }

        // 시작 날짜가 속한 월의 연도와 월 추출 (YYYY-MM-DD 형식에서)
        const calendarApi = calendarRef.current.getApi();
        const currentDate = calendarApi.getDate();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // JavaScript의 월은 0부터 시작하므로 1을 더함

        const holidayPromises = [];

        // 이전 달
        if (month === 1) {
          holidayPromises.push(getHolidaysAPI(year - 1, 12));
        } else {
            holidayPromises.push(getHolidaysAPI(year, month - 1));
        }
        
        // 현재 달
        holidayPromises.push(getHolidaysAPI(year, month));
        
        // 다음 달
        if (month === 12) {
            holidayPromises.push(getHolidaysAPI(year + 1, 1));
        } else {
            holidayPromises.push(getHolidaysAPI(year, month + 1));
        }
        
        // 일정과 공휴일 동시 조회
        const [todos, ...holidaysArrays] = await Promise.all([
          getAllTodosAPI(startDate, endDate),
          ...holidayPromises
        ]);

        // 모든 공휴일 배열 합치기
        const holidays = holidaysArrays.flat();

          // 이벤트 포맷팅
          const formattedEvents = [
              ...todos.map(todo => ({
                  id: todo.id,
                  title: todo.title,
                  start: todo.startTime,
                  end: todo.endTime,
                  backgroundColor: '#4a90e2',
                  classNames: ['todo-event']
              })),
              ...holidays.map(holiday => {
                const date = String(holiday.locdate);
                const year = date.slice(0, 4);
                const month = date.slice(4, 6);
                const day = date.slice(6, 8);
                
                // UTC 기준으로 날짜 생성
                const holidayDate = new Date(Date.UTC(year, month - 1, day));
                const formattedDate = holidayDate.toISOString().split('T')[0];
                
                return {
                    title: holiday.dateName,
                    start: formattedDate,
                    allDay: true,
                    display: 'list-item',
                    classNames: ['holiday-event'],
                    color: '#ff0000',
                    textColor: '#ff0000',
                    editable: false,
                };
            })
            ];

          setEvents(formattedEvents);
          successCallback(formattedEvents);
      } catch (error) {
          console.error('Failed to load events:', error);
          failureCallback(error);
      }
    }, [calendarRef, getHolidaysAPI, getAllTodosAPI]);

    useEffect(() => {
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.refetchEvents();
      }
    }, [calendarRef.current]);

    // 일정 추가, 수정, 삭제 후 새로고침
    const refreshTodos = () => {
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.refetchEvents();
      }
    };

    // 요일별 색상 설정
    const handleDayCellDidMount = useCallback((arg) => {
      const day = arg.date.getDay();
      // UTC 기준으로 날짜 문자열 생성
      const dateStr = new Date(Date.UTC(
          arg.date.getFullYear(),
          arg.date.getMonth(),
          arg.date.getDate()
      )).toISOString().split('T')[0];
      
      const dayNumber = arg.el.querySelector('.fc-daygrid-day-number');
      
      // 공휴일 체크
      const isHoliday = events.some(event => {
          if (!event.start) return false;
          const eventDate = event.start.split('T')[0];
          return eventDate === dateStr && event.classNames?.includes('holiday-event');
      });
  
      if (dayNumber) {
          if (isHoliday || day === 0) {
              dayNumber.style.color = '#ff0000';
          } else if (day === 6) {
              dayNumber.style.color = '#0000ff';
          } else {
              dayNumber.style.color = '#000000';
          }
      }
  
      if (day === 0) {
          arg.el.style.backgroundColor = '#fff5f5';
      } else if (day === 6) {
          arg.el.style.backgroundColor = '#f8f9ff';
      }
  }, [events]);

    // 일정 상세 조회
    const searchTodoDetail = async (info) => {
      try {
          const todoDetail = await getTodoDetailAPI(info.event.id);
          setSelectedEvent(todoDetail);
          setIsDetailModalOpen(true);
      } catch (error) {
          console.error('Failed to fetch todo detail:', error);
      }
    };

    // 일정 등록
    const createTodo = async (formData) => {
      try {
        await enrollTodoAPI(formData);
        showToast('새 일정이 등록되었습니다.', 'success');
        setIsCreateModalOpen(false);
        refreshTodos();
      } catch (error) {
        console.error('Failed to create todo:', error);
        showToast('일정 등록에 실패했습니다.','error')
      }
    };

    // 일정 수정
    const modifyTodo = async (todoId, formData) => {
      try {
        await modifyTodoAPI(todoId, formData);
        setIsDetailModalOpen(false);
        showToast('일정이 수정되었습니다.', 'success');
        refreshTodos();
      } catch (error) {
        console.error('Failed to modify todo:', error);
        showToast('일정 수정에 실패했습니다.', 'error')
      }
    };
    

    // 일정 삭제
    const deleteTodo = async (todoId) => {
      try{
        const isConfirmed = window.confirm('정말 이 일정을 삭제하시겠습니까?');
        if (!isConfirmed) return;
    
        await deleteTodoAPI(todoId);
        setIsDetailModalOpen(false);
        showToast('일정이 삭제되었습니다.', 'success');
        refreshTodos();
      } catch (error) {
        console.error('Failed to delete todo:', error);
        showToast('일정 삭제에 실패했습니다.', 'error');
      }
    }
  
    return (
      <div className = "todo-calendar-container">
          {/* 달력 */}
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="1000px"
            events={searchAllTodos}
            datesSet={(arg) => {
              if (calendarRef.current) {
                const calendarApi = calendarRef.current.getApi();
                calendarApi.refetchEvents();
              }
            }}
            eventClick={searchTodoDetail}
            selectable={true}
            editable={true}
            dayCellDidMount={handleDayCellDidMount}
            headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            dayMaxEvents={true}
          />

          {/* 일정 상세 모달 */}
          <TodoDetailModal
            isOpen = {isDetailModalOpen}
            event = {selectedEvent}
            onClose = {() => setIsDetailModalOpen(false)}
            onDelete = {() => selectedEvent && deleteTodo(selectedEvent.id)}
            onModify = {modifyTodo}
          />

          {/* 일정 등록 모달 */}
          <TodoEnrollModal
            isOpen = {isCreateModalOpen}
            onClose = {() => setIsCreateModalOpen(false)}
            onSubmit = {createTodo}
          />

          {/* 우측 하단 일정 등록 위젯 버튼 */}
          <button 
            className = "todo-widget-btn" 
            onClick = {() => setIsCreateModalOpen(true)}
          >
            <i className = "bi bi-calendar-plus-fill"></i>
          </button>

      </div>
    );
};

export default TodoPage;