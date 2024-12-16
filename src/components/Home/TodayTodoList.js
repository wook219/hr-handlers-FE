// TodayTodoList.js
import React, { useState, useEffect } from 'react';
import { getTodayTodosAPI } from '../../api/home/index';
import './TodayTodoList.css';

const TodayTodoList = () => {
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        fetchTodayTodos();
    }, []);

    const fetchTodayTodos = async () => {
        try {
            const response = await getTodayTodosAPI();
            setTodos(response);
        } catch (error) {
            console.error('Failed to fetch today todos:', error);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${month}.${day}`;
    };
 
    const getTimeDisplay = (todo) => {
        const today = new Date().setHours(0, 0, 0, 0);
        const startDate = new Date(todo.startTime).setHours(0, 0, 0, 0);
        const endDate = new Date(todo.endTime).setHours(0, 0, 0, 0);
 
        if (startDate === endDate) {
            // 당일 일정
            return `${formatTime(todo.startTime)} ~ ${formatTime(todo.endTime)}`;
        } else if (today === startDate) {
            // 오늘이 시작일
            return `${formatTime(todo.startTime)} ~ ${formatDate(todo.endTime)}까지`;
        } else if (today === endDate) {
            // 오늘이 종료일
            return `${formatDate(todo.startTime)}부터 ~ ${formatTime(todo.endTime)}`;
        } else {
            // 오늘이 중간 날짜
            return `진행중 (${formatDate(todo.startTime)} ~ ${formatDate(todo.endTime)})`;
        }
    };

    return (
        <div className="today-todo-sidebar">
            <h5 className='today-todo-sidebar-title'>오늘 할 일</h5>
            <div className="today-date">
                {new Date().toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    weekday: 'long'
                })}
            </div>
            <div className="today-todo-list">
                {todos.map((todo) => (
                    <div key={todo.id} className="today-todo-item">
                        <div className="today-todo-title">{todo.title}</div>
                        <div className="today-todo-time">
                            {getTimeDisplay(todo)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodayTodoList;