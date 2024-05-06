import { FC } from 'react';
import style from './diary.module.css'
import { Draggable } from '@hello-pangea/dnd';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale} from  "react-datepicker";
import { ru } from 'date-fns/locale/ru';
registerLocale('ru', ru)
import { FaFlag } from "react-icons/fa6";
import { FaRegTrashCan } from "react-icons/fa6";

export const Task:FC<any>= ({index, data, AllTask, setAllTask, form, Task }) => {
    const monthArray = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']


    const date = new Date()
    let day = date.getDate();
    let month = monthArray[date.getMonth()];
    let year = date.getFullYear()
    let currentDate = `${day} ${month} ${year}`;

    function deleteBourd( list:any) {
        const copy = [...AllTask]
        
        const index = copy[0].column.tasks.findIndex((n:any) => n.id === Task.id);
        console.log(copy[0].column.tasks[index])
        const indexTop = copy[0].column.tasks[index].task.indexOf(list)
        if (index !== -1) {
            copy[0].column.tasks[index].task.splice(indexTop, 1)
        }
        setAllTask(copy)
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
                    <div className={style.deleteBtnPosition}>
                        <p className={style.dateText}>{data.date}</p>
                        <button className={style.deleteBtn} onClick={() => deleteBourd(data)}><FaRegTrashCan /></button>
                    </div>
                    
                 </div>

                 
            )}
        </Draggable>
        
    )
}