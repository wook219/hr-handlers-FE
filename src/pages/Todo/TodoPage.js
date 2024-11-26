import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Todo.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showToast } from '../../utils/toast';
import TodoDetailModal from "../../components/Todo/TodoDetailModal";
import TodoEnrollModal from "../../components/Todo/TodoEnrollModal";
import { getAllTodosAPI, getTodoDetailAPI, enrollTodoAPI, modifyTodoAPI, deleteTodoAPI } from '../../api/todo'; // Todo API 가져오기

const TodoPage = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null); // 선택된 이벤트 상태
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // 일정 전체 조회
    const fetchTodos = async () => {
      try {
        const todos = await getAllTodosAPI();
        // FullCalendar 형식으로 데이터 변환
        const formattedEvents = todos.map((todo) => ({
          id: todo.id,
          title: todo.title,
          start: todo.startTime,
          end: todo.endTime,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Failed to load todos:', error);
      }
    };

    // 컴포넌트 마운트 시 데이터 가져오기
    useEffect(() => {
      fetchTodos(); // 컴포넌트 마운트 시 데이터 로드
    }, []);

    // 일정 상세 조회
    const handleEventClick = async (info) => {
      try {
          const todoDetail = await getTodoDetailAPI(info.event.id);
          console.log('todoDetail', todoDetail);
          setSelectedEvent(todoDetail);
          setIsDetailModalOpen(true);
      } catch (error) {
          console.error('Failed to fetch todo detail:', error);
      }
    };

    // 일정 등록
    const handleCreateSubmit = async (formData) => {
      try {
        await enrollTodoAPI(formData);
        fetchTodos(); // 일정 목록 새로고침
        setIsCreateModalOpen(false);
        showToast.success('새 일정이 등록되었습니다.');
      } catch (error) {
        console.error('Failed to create todo:', error);
        showToast.error('일정 등록에 실패했습니다.');
      }
    };

    // 일정 수정
    const handleModify = async (todoId, formData) => {
      try {
        await modifyTodoAPI(todoId, formData);
        await fetchTodos(); // 일정 목록 새로고침
        setIsDetailModalOpen(false);
        showToast.success('일정이 수정되었습니다.');
      } catch (error) {
        console.error('Failed to modify todo:', error);
        showToast.error('일정 수정에 실패했습니다.');
      }
    };

    // 일정 삭제
    const handleDelete = async (todoId) => {
      try{
        const isConfirmed = window.confirm('정말 이 일정을 삭제하시겠습니까?');
        if (!isConfirmed) return;

        await deleteTodoAPI(todoId);
        await fetchTodos();
        setIsDetailModalOpen(false);
        showToast.success('일정이 삭제되었습니다.');
      } catch (error) {
        console.error('Failed to delete todo:', error);
        showToast.error('일정 삭제에 실패했습니다.');
      }
    }
  
    return (
      <div className = "todo-calendar-container">
          {/* 달력 */}
          <FullCalendar
            plugins = {[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView = "dayGridMonth"
            height = "1000px"
            events = {events}
            eventClick = {handleEventClick}
            selectable = {true}
            editable = {true}
          />

          {/* 일정 상세 모달 */}
          <TodoDetailModal
            isOpen = {isDetailModalOpen}
            event = {selectedEvent}
            onClose = {() => setIsDetailModalOpen(false)}
            onDelete = {() => selectedEvent && handleDelete(selectedEvent.id)}
            onModify = {handleModify}
          />

          {/* 일정 등록 모달 */}
          <TodoEnrollModal
            isOpen = {isCreateModalOpen}
            onClose = {() => setIsCreateModalOpen(false)}
            onSubmit = {handleCreateSubmit}
          />

          {/* 우측 하단 일정 등록 위젯 버튼 */}
          <button 
            className = "todo-widget-btn" 
            onClick = {() => setIsCreateModalOpen(true)}
          >
            <i className = "bi bi-calendar-plus-fill"></i>
          </button>

          {/* Toast 컨테이너 */}
          <ToastContainer
            position = "top-center"
            autoClose = {3000}
            hideProgressBar = {false}
            newestOnTop = {false}
            closeOnClick
            rtl = {false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
      </div>
    );
};

export default TodoPage;