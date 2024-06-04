import { FC, useEffect, useState } from "react"
import style from './diary.module.css'
import { Column } from './/Column';
import { DragDropContext } from '@hello-pangea/dnd';
import { useSelector } from "react-redux";
import { RootState } from '../../redux/store';
import { BsClipboard2Check } from "react-icons/bs";
import CompletedDiary from "./CompletedDiary";

type DiaryType = {
    supabase:any
}

const Diary:FC<DiaryType> = ({supabase}) => {
    const [AllTask, setAllTask] = useState<any>([])
    const [loading, setLoading] = useState(true)
    const UserId = useSelector((state: RootState) => state.UserId.UserId)
    const [form, setForm] = useState<any>(JSON.parse(localStorage.getItem('form')!))
    const [screen, setScreen] = useState(false)

    // console.log(data)
    useEffect(() => {
        test()
      },[])

      async function test() {
        const { data, error } = await supabase.auth.getSession()
        Proverka(data.session?.user.id)
        if (error !== null) {
            console.log(error)
        }
    }

    useEffect(() => {
        UpsertData()
    }, [AllTask]);

    async function UpsertData() {
        if (!loading) {
            const { error } = await supabase
            .from('boba')
            .update({
                column : AllTask[0].column
            })
            .eq('id', UserId)
            if (error !== null) {
                console.log(error)
            }
        }
    }

    async function Proverka(userId:any) {
        const { data, error } = await supabase
        .from("boba")
        .select()
        .eq('id', userId);
        setAllTask(data);
        setLoading(false)
        if (error !== null) {
            console.log(error)
        }
    }

    const monthArray = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

    const handleDragEnd = (result:any) => {
        const {destination, source, draggableId } = result;
        // Если объект перетащиши за область, в которую можно дропать
        if (!destination) {
            return;
        }

        // Если объект перетащили в то же самое место
        if (destination.droppableId === source.droppableId 
            && destination.index === source.index) {
            return;
        }
        /// если объект в одной колонке
        if (destination.droppableId === source.droppableId) {
            const copy = [...AllTask]
            let column = copy[0].column.tasks.find((item:any) => {
                return item.id == source.droppableId
            })
            let newTask = column.task.find((item:any) => {
                return item.id == draggableId
            })
            column.task.splice(source.index, 1)
            column.task.splice(destination.index, 0, newTask)
            
            setAllTask(copy)
        } 
        /// если объект перемещается в другую колонку
        if (destination.droppableId !== source.droppableId) {
            const copy = [...AllTask]
            let column = copy[0].column.tasks.find((item:any) => {
                return item.id == source.droppableId
            })

            let columnNew = copy[0].column.tasks.find((item:any) => {
                return item.id == destination.droppableId
            })

            const date = new Date();

            let currentDate = ''
            let day = date.getDate();
            let month = monthArray[date.getMonth()];
            let year = date.getFullYear()

            let newTask = column.task.find((item:any) => {
                return item.id == draggableId
            })
            //// изменение даты
            if (columnNew.title === "Сегодня") {
                currentDate = `${day} ${month}`;
                newTask.date = currentDate
                newTask.day = day
                newTask.monthDate = date.getMonth()
                newTask.dateFull = date

            } else if (columnNew.title === "Завтра") {
                const dateNew = new Date(year, date.getMonth(), day+1 )
                let dayNew = dateNew.getDate();
                let monthNew = monthArray[dateNew.getMonth()];
                currentDate = `${dayNew} ${monthNew}`;
                newTask.date = currentDate
                newTask.day = dayNew
                newTask.monthDate = dateNew.getMonth()
                newTask.dateFull = date

            } else if (columnNew.title === "На этой неделе") {
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
                console.log('dateNew', dateNew)
                currentDate = `${dayNew} ${monthNew}`
                newTask.date = currentDate
                newTask.day = dayNew
                newTask.monthDate = dateNew.getMonth()
                newTask.dateFull = date

            }  else if (columnNew.title === "На следующей неделе") {
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
                newTask.date = currentDate
                newTask.day = dayNew
                newTask.monthDate = dateNew.getMonth()
                newTask.dateFull = date

            } else if (columnNew.title === "Позже") {
                const dateNew = new Date(year, date.getMonth(), day+14 )
                let dayNew = dateNew.getDate();
                let monthNew = monthArray[dateNew.getMonth()];
                currentDate = `${dayNew} ${monthNew}`;
                newTask.date = currentDate
                newTask.day = dayNew
                newTask.monthDate = dateNew.getMonth()
                newTask.dateFull = date
            }

            column.task.splice(source.index, 1)
            columnNew.task.splice(destination.index, 0, newTask)

            setAllTask(copy)
        }
        // UpsertData()
    };

    return (
        <DragDropContext
            onDragEnd={handleDragEnd}>
                {!loading ?
                    <div className={style.diary}>
                        <div className={style.flexHeader}>
                            <h3 className={style.h3Diary}>Ежедневник</h3>
                            { !screen ? 
                                <button className={style.headerBtn} onClick={() => setScreen(true)}>
                                    <BsClipboard2Check size={18}/>  Завершено задач: <span>{AllTask[0].column.completed.length}</span>
                                </button> :
                                <button className={style.headerBtn} onClick={() => setScreen(false)}>
                                    <BsClipboard2Check size={18}/>  Вернутся к задачам
                                </button>
                            }
                        </div>
                        {!screen ?
                                <div className={style.diaryFlex}>
                                    {
                                        AllTask[0].column.tasks.map((item:any) => {
                                        const tasks = item.task.map((taskId:any) => taskId);
                                        return (
                                            <div key={item.id}>
                                                <Column supabase={supabase} loading={loading} data={item} tasks={tasks} AllTask={AllTask} setAllTask={setAllTask} form={form}/>
                                            </div>
                                        )
                                            
                                        })
                                }
                                </div>
                                : 
                                <div className={style.containerFlex}>
                                    <CompletedDiary AllTask={AllTask} setAllTask={setAllTask}/>
                                </div>
                        }
                    </div>
                    : ''
                }
            
        </DragDropContext>
        
    )
}

export default Diary