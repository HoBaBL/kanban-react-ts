import React, { FC, useEffect, useRef, useState } from 'react';
import { Task } from './Task';
import style from './diary.module.css'
import { Droppable } from '@hello-pangea/dnd';
import TextareaAutosize from 'react-textarea-autosize';
import { FiPlus } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { RootState } from '../../redux/store';

export const Column:FC<any> = ({tasks, data, AllTask, setAllTask, loading, supabase, form}) => {
    const [AddTaskDown, setAddTaskDown] = useState(false)
    const AddTaskDownRef = useRef<any>(null)
    const [AddTaskDownText, setAddTaskDownText] = useState('')

    const handleClick = (event:any) => {
        if (AddTaskDownRef.current && AddTaskDownRef.current.contains(event.target)) {
            setAddTaskDown(true)
        } else {
            setAddTaskDown(false)
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClick)
        return () => {
            document.removeEventListener("mousedown", handleClick)
        }
    },[])

    const monthArray = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

    function AddTask() {
        const copy = [...AllTask]
        const index = AllTask[0].column.tasks.findIndex((i:any) => i.title === data.title)

        const date = new Date();

        let monthDate = date.getMonth()
        let day = date.getDate();
        let month = monthArray[date.getMonth()];
        let year = date.getFullYear()
        let currentDate = ''
        if (copy[0].column.tasks[index].title === "Сегодня") {
            currentDate = `${day} ${month} ${year}`;

        } else if (copy[0].column.tasks[index].title === "Завтра") {
            const dateNew = new Date(year, date.getMonth(), day+1 )
            let dayNew = dateNew.getDate();
            let monthNew = monthArray[dateNew.getMonth()];
            currentDate = `${dayNew} ${monthNew}`;
            day = dayNew
            monthDate = dateNew.getMonth()

        } else if (copy[0].column.tasks[index].title === "На этой неделе") {
            const date = new Date(); // текущая дата
            let dayOfWeek = date.getDay();
            if (dayOfWeek === 0) {
                dayOfWeek = 7; // делаем воскресенье не первым днем, а седьмым
            }
            date.setDate(date.getDate() + (7 - date.getDay())); // добавляем к текущей дате кол-во оставшийся в этой неделе дней
            date.setHours(23, 59, 59); // устанавливаем время
            const dateString = ('0' + date.getDate()).slice(-2) ;
            const dateNew = new Date(year, date.getMonth(), Number(dateString))
            let dayNew = dateNew.getDate();
            let monthNew = monthArray[dateNew.getMonth()];
            currentDate = `${dayNew} ${monthNew}`
            day = dayNew
            monthDate = dateNew.getMonth()
            
        } else if (copy[0].column.tasks[index].title === "На следующей неделе") {
            const date = new Date(); // текущая дата
            let dayOfWeek = date.getDay();
            if (dayOfWeek === 0) {
                dayOfWeek = 7; // делаем воскресенье не первым днем, а седьмым
            }
            date.setDate(date.getDate() + (7 - date.getDay())); // добавляем к текущей дате кол-во оставшийся в этой неделе дней
            date.setHours(23, 59, 59); // устанавливаем время
            const dateString = ('0' + date.getDate()).slice(-2) ;
            const dateNew = new Date(year, date.getMonth(), Number(dateString)+1)
            let dayNew = dateNew.getDate();
            let monthNew = monthArray[dateNew.getMonth()];
            currentDate = `${dayNew} ${monthNew}`
            day = dayNew
            monthDate = dateNew.getMonth()

        } else if (copy[0].column.tasks[index].title === "Позже") {
            const dateNew = new Date(year, date.getMonth(), day+14 )
            let dayNew = dateNew.getDate();
            let monthNew = monthArray[dateNew.getMonth()];
            currentDate = `${dayNew} ${monthNew}`;
            day = dayNew
            monthDate = dateNew.getMonth()
        }
 

        const TaskObj = {
            id: Math.random(),
            titleTask: AddTaskDownText,
            colorTask: '',
            importanceTask: {color: "gray", text: "Обычная"},
            date: currentDate,
            day:day,
            monthDate:monthDate,
            dateFull: date
        }
        
        copy[0].column.tasks[index].task.push(TaskObj)
        // tasks.push(TaskObj)
        setAllTask(copy)
        setAddTaskDownText('')
        setAddTaskDown(false)
        // UpsertData()
    }

    return (
        <div>
            <div className={style.column}>
                <h4 className={style.h4}>{data.title}</h4>
            </div>
            <Droppable droppableId={String(data.id)}>
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        
                        {tasks.map((task:any, idx:any) => <Task Task={data} form={form} setAllTask={setAllTask} AllTask={AllTask} key={task.id} data={task} index={idx}/>)}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            {
                AddTaskDown ? 
                <div className={style.TodoObjHeader} ref={AddTaskDownRef}>
                    <TextareaAutosize value={AddTaskDownText} onChange={event => setAddTaskDownText(event.target.value)} className={style.AddTaskDown} />
                    <button className={style.CheckBtn} onClick={() => AddTask()}>
                        <FaCheck className={style.TodoObjHeaderMore} size={18}/>
                    </button>
                </div>
                :
                <button onClick={() => setAddTaskDown(true)} className={ style.btnAddColumn}>
                    <FiPlus size={16}/> Добавить задачу                       
                </button>
            }
        </div>
    );
}