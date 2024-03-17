import style from '../main.module.css';
import { FiPlus } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";
import { FC, useState, useRef, useEffect } from "react"
import TextareaAutosize from 'react-textarea-autosize';
import ArrayTask from './arrayTask';
import './styleDraggable.css';
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { RootState } from '../../../redux/store';


type TaskMiniProps = {
    Task:{
        id: number;
        title: string;
        numTask: number;
        color:string
        items: {
            titleTask: string;
            colorTask: string;
            importanceTask: string;
    }[]
    },
    currentBoard:any,
    currentItem:any,
    setCurrentBoard:any,
    setCurrentItem:any,
    supabase:any,
    AllTask:any,
    loading:boolean,
    userId:any,
    setAllTask:any
}


const TaskMini: FC<TaskMiniProps> = ({
    Task,
    currentBoard,
    currentItem,
    setCurrentBoard,
    setCurrentItem,
    supabase,
    AllTask,
    loading,
    userId,
    setAllTask

    }) => {
    // const [isShown, setIsShown] = useState(true); // показывает всплывающие объекты
    const [titleActive, setTitleActive] = useState(false) // активирует изменение названия у колонки
    const [AddTaskDown, setAddTaskDown] = useState(false) // активирует добавление задачи снизу
    const [dropdown, setDropdown] = useState(false)
    const [TodoH3, setTodoH3] = useState(Task.title)
    const [AddTaskDownText, setAddTaskDownText] = useState('')
    const TodoH3Ref = useRef<any>(null)
    const AddTaskDownRef = useRef<any>(null)
    const ref = useRef<any>();
    const numProd = useSelector((state: RootState) => state.numProd.numProd)
    const [modalActive, setModalActive] = useState(false)
    const color = ['#ffb5b5', '#f9eeda', '#fff6e5', '#d8f8ff', '#d8fff7', '#f3ddff'
    , '#ffaecc', '#fce7ca', '#fff5c2', '#bde0fe', '#c3f8f1',
    '#f1dbf2', '#ffc8d4', '#fde2d3', '#e5ffcf', '#caecde',
    '#e1e6ff', '#e7e0ff', '#fcc6b7', '#fad5c0', '#e5f5dd', '#bdd4d1',
    '#d9ddf3', '#e7e7e7']
    Task.numTask = Task.items.length

    const handleClick = (event:any) => {
        if (AddTaskDownRef.current && AddTaskDownRef.current.contains(event.target)) {
            setAddTaskDown(true)
        } else {
            setAddTaskDown(false)
        }
    }

    const MimoClick = (event:any) => {
        if (ref.current && ref.current.contains(event.target)) {
            setDropdown(true)
        } else {
            setDropdown(false)
        }
    }
    
    useEffect(() => {
        document.addEventListener("mousedown", MimoClick)
        return () => {
            document.removeEventListener("mousedown", MimoClick)
        }
    },[])

    useEffect(() => {
        document.addEventListener("mousedown", handleClick)
        return () => {
            document.removeEventListener("mousedown", handleClick)
        }
    },[])

    

    function AddTask() {
        const TaskObj = {
            id: Math.random(),
            titleTask: AddTaskDownText,
            colorTask: '',
            importanceTask: ''
        }
        Task.items.push(TaskObj)
        setAddTaskDownText('')
        setAddTaskDown(false)
        UpsertData()
    }
   
    async function UpsertData() {
        if (!loading) {
            const { error } = await supabase
            .from('boba')
            .update({
                todo_data : AllTask[0].todo_data
            })
            .eq('id', userId)
            console.log(error) 
        }
    }

    function cloneTodoH3() {
        Task.title = TodoH3
        console.log(AllTask)
        UpsertData()
        setTitleActive(false)
    }
    
    function deleteBourd(idClick:number) {
        const copy = [...AllTask]
        const index = copy[0].todo_data.Baza[numProd].Arrey.findIndex((n:any) => n.id === idClick);
        if (index !== -1) {
            copy[0].todo_data.Baza[numProd].Arrey.splice(index, 1)
        }
        setDropdown(false)
        setAllTask(copy)
        UpsertData()
    }

    function colorTask(idClick:number, block:string) {
        const copy = [...AllTask]
        const index = copy[0].todo_data.Baza[numProd].Arrey.findIndex((n:any) => n.id === idClick);
        copy[0].todo_data.Baza[numProd].Arrey[index].color = block
        console.log(copy[0].todo_data.Baza[numProd].Arrey[index])
        setAllTask(copy)
    }

    function colorTaskDefault(idClick:number) {
        const copy = [...AllTask]
        const index = copy[0].todo_data.Baza[numProd].Arrey.findIndex((n:any) => n.id === idClick);
        copy[0].todo_data.Baza[numProd].Arrey[index].color = 'white'
        console.log(copy[0].todo_data.Baza[numProd].Arrey[index])
        setAllTask(copy)
    }

    // onMouseEnter={() => {setIsShown(true)}}  onMouseLeave={() => {setIsShown(false)}}
  return (
            <div className={style.TodoObjActive} style={{backgroundColor:Task.color}}>
                <div className={style.TodoObjHeader}>
                    {
                        titleActive ? 
                        <div className={style.addBoardHeader}>
                            <input value={TodoH3} onChange={event => setTodoH3(event.target.value)} className={style.TitleInput} type="text" ref={TodoH3Ref}/>
                            <button className={style.CheckBtn} onClick={() => cloneTodoH3()}>
                                <FaCheck className={style.TodoObjHeaderMore} style={{ color:'gray'}}/>
                            </button> 
                        </div>
                         :
                        <h3 onClick={() => setTitleActive(true)} className={style.TodoH3}>{Task.title}</h3>
                    }
                    <div>
                        <IoIosMore onClick={() => setDropdown(true)} className={style.TodoObjHeaderMore}/>
                        <ul className={dropdown ? "dropdown" : "dropdownNone"} ref={ref}>
                            <li><button onClick={() => {setModalActive(true), setDropdown(false)}} className={style.btnDropdown}>Установить цвет колонки</button></li>
                            <li><button onClick={() => deleteBourd(Task.id)} className={style.btnDropdownDelete}>Удалить</button></li>
                        </ul>
                        <div className={modalActive ? "modal active" : 'modal'} onClick={() => setModalActive(false)}>
                            <div className='ModalContent' onClick={e => e.stopPropagation()}>
                                <p>Установить цвет</p>    
                                <div className={style.colorFlex}>
                                    {color.map((block) => (
                                        <button onClick={() => colorTask(Task.id, block)} key={block} className={style.color} style={{backgroundColor: block}}></button>
                                    ))}
                                </div>
                                <button onClick={() => colorTaskDefault(Task.id)} className={style.colorNone}><RxCross2 size={16}/> Сбросить цвет</button>
                            </div>    
                        </div> 
                    </div>
                    
                </div>
                <div className={style.TodoObjHeader}>
                    <p className={style.numTask}>Задачи {Task.items.length}</p>
                </div>
                <div
                className='bigTable'>
                    {
                            
                            Task.items.length > 0 &&(
                                Task.items.map((list:any) =>
                                <div 
                                    className='item'
                                    key={Math.random()}
                                >
                                    <ArrayTask  list={list} currentBoard={currentBoard} currentItem={currentItem}
                                        setCurrentBoard={setCurrentBoard} setCurrentItem={setCurrentItem} Task={Task} supabase={supabase} AllTask={AllTask} 
                                        loading={loading} userId={userId} setAllTask={setAllTask}/> 
                                </div>
                                    
                            ))
                        }
                </div>
                {
                    AddTaskDown ? 
                    <div className={style.TodoObjHeader} ref={AddTaskDownRef}>
                        <TextareaAutosize value={AddTaskDownText} onChange={event => setAddTaskDownText(event.target.value)} className={style.AddTaskDown} />
                        <button className={style.CheckBtn} onClick={() => AddTask()}>
                            <FaCheck className={style.TodoObjHeaderMore} style={{marginTop:10, color:'gray'}}/>
                        </button>
                    </div>
                    :
                    <button onClick={() => setAddTaskDown(true)} className={ style.btnAddTask}>
                        <FiPlus size={16}/> Добавить задачу                       
                    </button>
                }
                
            </div>
  );
}

export default TaskMini;
