import { FC, useRef, useState, useEffect} from "react";
import { IoMdMore } from "react-icons/io";
import style from '../main.module.css';
import './styleDraggable.css';
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { RootState } from '../../../redux/store';
import { FaFlag } from "react-icons/fa6";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale} from  "react-datepicker";
import { ru } from 'date-fns/locale/ru';
registerLocale('ru', ru)
import { Draggable } from '@hello-pangea/dnd';

type TaskMiniProps = {
    list: {
        id: number;
        titleTask: string;
        colorTask: string;
        importanceTask: {
            color:string,
            text: string
        };
        date:any,
        dateСomparison:any
    },
    currentBoard:any,
    currentItem:any,
    setCurrentBoard:any,
    setCurrentItem:any,
    Task:any,
    supabase:any,
    AllTask:any,
    loading:boolean,
    userId:any,
    setAllTask:any,
    form:boolean,
    index:any
}

const ArrayTask: FC<TaskMiniProps> = ({list, currentBoard,
    currentItem,
    setCurrentBoard,
    setCurrentItem,
    Task,
    supabase,
    AllTask,
    loading,
    userId,
    setAllTask,
    form,
    index
    }) => {

    const [isShownMini, setIsShownMini] = useState(false)
    const [dropdownGap, setDropdownGap] = useState(false)
    const refTask = useRef<any>();
    const [modalActive, setModalActive] = useState(false)
    const numProd = useSelector((state: RootState) => state.numProd.numProd)
    const color = ['#ffb5b5', '#f9eeda', '#fff6e5', '#d8f8ff', '#d8fff7', '#f3ddff'
    , '#ffaecc', '#fce7ca', '#fff5c2', '#bde0fe', '#c3f8f1',
    '#f1dbf2', '#ffc8d4', '#fde2d3', '#e5ffcf', '#caecde',
    '#e1e6ff', '#e7e0ff', '#fcc6b7', '#fad5c0', '#e5f5dd', '#bdd4d1',
    '#d9ddf3', '#e7e7e7']
    const importanceAll = [{color: 'red', text: 'Высокая'}, {color: 'gray', text: 'Обычная'}, {color: 'black', text: 'Низкая'}]

    const MimoClick = (event:any) => {
        if (refTask.current && refTask.current.contains(event.target)) {
            setDropdownGap(true)
        } else {
            setDropdownGap(false)
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", MimoClick)
        return () => {
            document.removeEventListener("mousedown", MimoClick)
        }
    },[])

    async function UpsertData() {
        if (!loading) {
            const { error } = await supabase
            .from('boba')
            .update({
                todo_data : AllTask[0].todo_data
            })
            .eq('id', userId)
            if (error !== null) {
                console.log(error) 
            }
           
        }
    }

    function deleteBourd( Task:any, list:any) {
        const copy = [...AllTask]
        const index = copy[0].todo_data.Baza[numProd].Arrey.findIndex((n:any) => n.id === Task.id);
        const indexTop = copy[0].todo_data.Baza[numProd].Arrey[index].items.indexOf(list)
        if (index !== -1) {
            copy[0].todo_data.Baza[numProd].Arrey[index].items.splice(indexTop, 1)
        }
        setAllTask(copy)
    }

    function colorTask(Task:any, list:any, block:string) { /// изменение цвета таска
        const copy = [...AllTask]
        const index = copy[0].todo_data.Baza[numProd].Arrey.findIndex((n:any) => n.id === Task.id);
        const indexTop = copy[0].todo_data.Baza[numProd].Arrey[index].items.indexOf(list)
        copy[0].todo_data.Baza[numProd].Arrey[index].items[indexTop].colorTask = block
        setAllTask(copy)
    }

    function colorTaskDefault(Task:any, list:any) { /// изменение цвета до белого
        const copy = [...AllTask]
        const index = copy[0].todo_data.Baza[numProd].Arrey.findIndex((n:any) => n.id === Task.id);
        const indexTop = copy[0].todo_data.Baza[numProd].Arrey[index].items.indexOf(list)
        copy[0].todo_data.Baza[numProd].Arrey[index].items[indexTop].colorTask = 'white'
        setAllTask(copy)
    }

    function importance(Task:any, list:any, block:any) {  /// важность в виде флагов 
        const copy = [...AllTask]
        const index = copy[0].todo_data.Baza[numProd].Arrey.findIndex((n:any) => n.id === Task.id);
        const indexTop = copy[0].todo_data.Baza[numProd].Arrey[index].items.indexOf(list)
        copy[0].todo_data.Baza[numProd].Arrey[index].items[indexTop].importanceTask = block
        setAllTask(copy)
    }

    const monthArray = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
    
    function completedFunc(id:number, titleTask:string, column:string, Task:any, list:any) { /// дата выполнение добавляется в массив с выполнеными задачами
        const copy = [...AllTask]
        const date = new Date();

        let day = date.getDate();
        let month = monthArray[date.getMonth()];
        let year = date.getFullYear()
        let hours = date.getHours()
        let minutes = date.getMinutes()
        let currentDate = `${day} ${month} ${year}`;
        let time = `${hours}:${minutes}`

        const completedTask = {
            id: id,
            titleTask: titleTask,
            column: column,
            date: currentDate,
            time: time
        }
        copy[0].todo_data.Baza[numProd].completed.unshift(completedTask)
        deleteBourd( Task, list)
        setAllTask(copy)
    }

    const [startDate, setStartDate] = useState<any>(new Date());

    function dateTask(date:any, Task:any, list:any) {  /// дата до которой нужно выполнить задачу выводится на главный экран
        const copy = [...AllTask]
        const dateMore = date;

        let day = dateMore.getDate();
        let month = monthArray[dateMore.getMonth()].substring(0, 3);
        let currentDate = `${day} ${month}`;

        const index = copy[0].todo_data.Baza[numProd].Arrey.findIndex((n:any) => n.id === Task.id);
        const indexTop = copy[0].todo_data.Baza[numProd].Arrey[index].items.indexOf(list)
        copy[0].todo_data.Baza[numProd].Arrey[index].items[indexTop].date = currentDate
        copy[0].todo_data.Baza[numProd].Arrey[index].items[indexTop].dateСomparison = dateMore
        setAllTask(copy)
        console.log(dateMore)
    }

    function dateTaskDefault(Task:any, list:any) {
        const copy = [...AllTask]

        const index = copy[0].todo_data.Baza[numProd].Arrey.findIndex((n:any) => n.id === Task.id);
        const indexTop = copy[0].todo_data.Baza[numProd].Arrey[index].items.indexOf(list)
        copy[0].todo_data.Baza[numProd].Arrey[index].items[indexTop].date = undefined

        setAllTask(copy)
    }
    
    return(
        <Draggable 
            draggableId={String(list.id)} index={index}>
            {(provided) => (
        
                <div 
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    className="taskTaskPosition" 
                    onMouseEnter={() => {setIsShownMini(true)}}  onMouseLeave={() => {setIsShownMini(false)}}
                    >
                        <div style={{backgroundColor:list.colorTask}} className={form ? "taskMini" :'taskTask'} >

                        
                            {list.date !== undefined ? <p className={style.dateText}>до {list.date}.</p> : ''}
                            <p className={style.taskMiniText}>{list.titleTask}</p>
                            {list.importanceTask.color === 'gray' ? '' : <FaFlag className={style.importanceMain} size={10} color={list.importanceTask.color}/>}
                            
                            <button className={form ? isShownMini ? style.moreMini : style.moreMiniNone : isShownMini ? style.moreMiniTask : style.moreMiniNoneTask} onClick={() => setDropdownGap(true)}>
                                <IoMdMore size={18}/>
                            </button>    
                            <div className={form ? dropdownGap ? "dropdownMini" : "dropdownNone" : dropdownGap ? "dropdownMiniTask" : "dropdownNone"} ref={refTask}>
                                <li><button onClick={() => {setModalActive(true), setDropdownGap(false)}} className={style.btnDropdown}>Настройки</button></li>
                                <li><button onClick={() => completedFunc(list.id, list.titleTask, Task.title, Task, list)} className={style.btnDropdown}>Выполнить</button></li>
                                <li><button onClick={() => deleteBourd( Task, list)} className={style.btnDropdownDelete}>Удалить</button></li>
                            </div> 


                            <div className={modalActive ? "modal active" : 'modal'} onClick={() => setModalActive(false)}>
                                <div className='ModalContent' onClick={e => e.stopPropagation()}>
                                    <div>
                                        <p>Установить важность</p>
                                        <div className={style.importance}>
                                            {importanceAll.map((block) => (
                                                <button key={block.text} onClick={() => importance(Task, list, block)} className={list.importanceTask.color === block.color ? style.importanceTextActive : style.importanceText }><FaFlag color={block.color}/> {block.text}</button>
                                            ))
                                            }
                                        </div>
                                    </div>
                                    <div>
                                        <p>Добавить дату</p>
                                        <DatePicker selected={startDate} onChange={(date) => {dateTask(date, Task, list), setStartDate(date)}} locale="ru" dateFormat="dd.MM.yyyy" />
                                        <button onClick={() => dateTaskDefault(Task, list)} className={style.colorNone}><RxCross2 size={16}/> Сбросить дату</button>
                                    </div>
                                    <div>
                                        <p>Установить цвет</p>    
                                        <div className={style.colorFlex}>
                                            {color.map((block) => (
                                                <button onClick={() => colorTask(Task, list, block)} key={block} className={style.color} style={{backgroundColor: block}}></button>
                                            ))}
                                        </div>
                                        <button onClick={() => colorTaskDefault(Task, list)} className={style.colorNone}><RxCross2 size={16}/> Сбросить цвет</button>
                                    </div>
                                    
                                </div>    
                            </div> 
                    </div>      
                </div>
            )}
        </Draggable>
    )
}

export default ArrayTask;