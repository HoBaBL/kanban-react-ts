import { FC, forwardRef, useEffect, useRef, useState } from 'react';
import style from './diary.module.css'
import { Draggable } from '@hello-pangea/dnd';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale} from  "react-datepicker";
import { ru } from 'date-fns/locale/ru';
registerLocale('ru', ru)
import { FaFlag , FaCheck, FaRegTrashCan} from "react-icons/fa6";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const Task:FC<any>= ({index, data, AllTask, setAllTask, form, Task, loading }) => {
    const monthArray = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
    
    const dateToday = new Date()
    let day = dateToday.getDate();
    let month = dateToday.getMonth();
    let year = dateToday.getFullYear()

    // console.log('data', data)
    const dataDate = new Date(data.dateFull)


    const [startDate, setStartDate] = useState<any>(new Date(year, data.monthDate, data.day));

    function deleteBourd( list:any) {
        const copy = [...AllTask]
        
        const index = copy[0].column.tasks.findIndex((n:any) => n.id === Task.id);
        const indexTop = copy[0].column.tasks[index].task.indexOf(list)
        if (index !== -1) {
            copy[0].column.tasks[index].task.splice(indexTop, 1)
        }
        setAllTask(copy)
    }

    function CompletedTask(list:any) {
        const date = new Date();

        let day = date.getDate();
        let month = monthArray[date.getMonth()];

        let hours = date.getHours()
        let minutes = date.getMinutes()
        let time = `${hours}:${minutes}`
        let currentDate = `${day} ${month}`;

        const copy = [...AllTask]
        const obj = {
            date: currentDate,
            id: list.id,
            titleTask: list.titleTask,
            time: time,
            day: day,
            month:date.getMonth()
        }
        copy[0].column.completed.unshift(obj)
        setAllTask(copy)
        deleteBourd(list)
    }

    // console.log(dataDate.getDate())

    const ExampleCustomInput = forwardRef(({ value, onClick }:any, ref:any) => (
        <button style={(dataDate.getDate() < dateToday.getDate() && dataDate.getMonth() <= dateToday.getMonth()) ? {color:'red'}: {color:'gray'}} className={style.inputCastom} onClick={onClick} ref={ref}>
          {data.date}
        </button>
    ));

    function dateTask( date:any ,list:any) {  /// дата задачи
        const copy = [...AllTask]

        let dayCalendar = date.getDate();
        let monthCalendar = monthArray[date.getMonth()].substring(0, 3);
        let currentDateCalendar = `${dayCalendar} ${monthCalendar}`;

        const index = copy[0].column.tasks.findIndex((n:any) => n.id === Task.id); /// индекс колонки
        const indexTop = copy[0].column.tasks[index].task.indexOf(list) /// индекс таска

        copy[0].column.tasks[index].task[indexTop].date = currentDateCalendar
        copy[0].column.tasks[index].task[indexTop].day = dayCalendar
        copy[0].column.tasks[index].task[indexTop].monthDate = date.getMonth()
        copy[0].column.tasks[index].task[indexTop].dateFull = date

        setAllTask(copy)

        let Today = new Date()

        let dateNewWeek = new Date(year, month, day+1)

        const dateMonth = new Date(); // текущая дата
        let dayOfWeek = dateMonth.getDay();
        if (dayOfWeek === 0) {
            dayOfWeek = 7; // делаем воскресенье не первым днем, а седьмым
        }
        
        dateMonth.setDate(dateMonth.getDate() + (7 - dateMonth.getDay())); // добавляем к текущей дате кол-во оставшийся в этой неделе дней
        dateMonth.setHours(23, 59, 59); // устанавливаем время
        const dateString = ('0' + dateMonth.getDate()).slice(-2) ;
        const dateMonthNew = new Date(year, dateMonth.getMonth(), Number(dateString))
        const startWeek = new Date(year, dateMonthNew.getMonth(), Number(dateString)-7)

        const dateNextWeek = new Date(year, dateMonth.getMonth(), Number(dateString)+7)

        if (Today.getDate() === date.getDate() && Today.getMonth() === date.getMonth()) {
            copy[0].column.tasks[index].task.splice(indexTop, 1)
            copy[0].column.tasks[0].task.unshift(list)
        } else if (date.getDate() === dateNewWeek.getDate() && date.getMonth() === dateNewWeek.getMonth()) {
            copy[0].column.tasks[index].task.splice(indexTop, 1)
            copy[0].column.tasks[1].task.unshift(list)
        } else if ((date.getDate() <= dateMonthNew.getDate() && date.getDate() > startWeek.getDate()) && date.getMonth() <= dateMonthNew.getMonth()) {
            copy[0].column.tasks[index].task.splice(indexTop, 1)
            copy[0].column.tasks[2].task.unshift(list)
        } else if ((date.getDate() <= dateNextWeek.getDate() && date.getDate() > dateMonthNew.getDate()) && date.getMonth() <= dateNextWeek.getMonth()) {
            copy[0].column.tasks[index].task.splice(indexTop, 1)
            copy[0].column.tasks[3].task.unshift(list)
        } 
        if (date.getDate() > dateNextWeek.getDate()  && date.getMonth() >= dateNextWeek.getMonth()) {
            copy[0].column.tasks[index].task.splice(indexTop, 1)
            copy[0].column.tasks[4].task.unshift(list)
        }
    }
    
    return (
        <Draggable 
             draggableId={String(data.id)} index={index} >
            {(provided) => (
                <div className={style.tasks}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    <p className={style.taskTest}>{data.titleTask}</p> 
                    
                    {data.importanceTask.color === 'gray' ? '' : <FaFlag className={style.importanceMain} size={10} color={data.importanceTask.color}/>}
                    <DatePicker customInput={<ExampleCustomInput />} selected={startDate} onChange={(date) => {dateTask(date, data), setStartDate(date)}} locale="ru" dateFormat="dd.MM.yyyy" />
                    <div className={style.deleteBtnPosition}>
                        
                        <button onClick={() => CompletedTask(data)} className={style.btnCircle}>
                           <FaCheck size={12}/>
                        </button>
                        <button className={style.deleteBtn} onClick={() => deleteBourd(data)}>
                            <FaRegTrashCan  size={16}/>
                        </button>
                    </div>      
                 </div>
            )}
        </Draggable>
        
    )
}