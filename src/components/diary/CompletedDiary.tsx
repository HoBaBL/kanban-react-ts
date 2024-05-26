import { FC } from 'react'
import style from './diary.module.css'
import { LuCalendarDays } from "react-icons/lu";
import { SlMagnifier } from "react-icons/sl";
import { FaRegTrashCan} from "react-icons/fa6";

const CompletedDiary:FC<any> = ({AllTask, setAllTask}) => {

    function deleteBourd( completedTask:any) {
        const copy = [...AllTask]
        const index = copy[0].column.completed.indexOf(completedTask)
        copy[0].column.completed.splice(index, 1)
        setAllTask(copy)
    }

    return (
        <div>
            { AllTask[0].column.completed.length !== 0 ? 

                <div>
                    <div className={style.inputFlex}>
                        <SlMagnifier color="gray"/>
                        <input type="text" className={style.input} placeholder="Найти..."/>
                    </div>

                    {AllTask[0].column.completed.map((completedTask:any) => 
                        <div className={style.container} key={completedTask.id}>
                            <p className={style.text}>
                                {completedTask.titleTask}
                            </p>
                            <div className={style.footer}>
                                <p className={style.time}>
                                    <LuCalendarDays />{completedTask.date} {completedTask.time}
                                </p>
                                <button className={style.deleteBtn} onClick={() => deleteBourd(completedTask)}>
                                    <FaRegTrashCan  size={16}/>
                                </button>
                            </div>
                            
                            
                        </div>
                    )}

                </div>
                :
                <div className={style.noneTasks}>
                    <p className={style.noneTasksTextBig}>Завершенных задач нет</p>
                    <p>В этом разделе хранятся задачи, которые были завершены</p>
                </div>
            }
            
           
        </div>
    )
}

export default CompletedDiary