import { FC } from "react";
import style from './completedTask.module.css'
import { LuCalendarDays } from "react-icons/lu";
import { SlMagnifier } from "react-icons/sl";
import { FaRegTrashCan} from "react-icons/fa6";

type CompletedTaskProps = {
    AllTask:any,
    numProd:number,
    setAllTask:any
}

const CompletedTask:FC<CompletedTaskProps> = ({AllTask, numProd, setAllTask}) => {

    function deleteBourd(completedTask:any) {
        const copy = [...AllTask]
        const index = AllTask[0].todo_data.Baza[numProd].completed.indexOf(completedTask)
        AllTask[0].todo_data.Baza[numProd].completed.splice(index, 1)
        setAllTask(copy)
    }

    return (
        <div>
            { AllTask[0].todo_data.Baza[numProd].completed.length !== 0 ? 

                <div>
                    <div className={style.inputFlex}>
                        <SlMagnifier color="gray"/>
                        <input type="text" className={style.input} placeholder="Найти..."/>
                    </div>

                    {AllTask[0].todo_data.Baza[numProd].completed.map((completedTask:any) => 
                        <div className={style.container} key={completedTask.id}>
                            <p className={style.text}>
                                {completedTask.titleTask}
                            </p>
                            <div className={style.footer}>
                                <p className={style.column}>
                                    Колонка: {completedTask.column}
                                </p>
                                <div className={style.footerFlex}>
                                    <p className={style.time}>
                                        <LuCalendarDays />{completedTask.date}. {completedTask.time}
                                    </p>
                                    <button className={style.deleteBtn} onClick={() => deleteBourd(completedTask)}>
                                        <FaRegTrashCan  size={16}/>
                                    </button>
                                </div>
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

export default CompletedTask