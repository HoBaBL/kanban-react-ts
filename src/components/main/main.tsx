import { FC, useRef, useState, useEffect} from "react"
import style from './main.module.css'
import TaskMini from "./taskMain/taskMain"
import { FiPlus } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import './taskMain/styleDraggable.css';
import { useSelector } from "react-redux";
import { RootState } from '../../redux/store';
import CompletedTask from "./completedTask/completedTask";
import { Reorder, useDragControls} from 'framer-motion';
import { IoMdMore } from "react-icons/io";
import { IoList } from "react-icons/io5";
import { BiTable } from "react-icons/bi";
import { useParams } from "react-router-dom";
import { useAppDispatch } from '../../hooks';
import { setnumProd } from "../../redux/slice/numProd";
import { BsClipboard2Check } from "react-icons/bs";
import SkeletonBoard from "../skeleton/skeletonBoard";
import { DragDropContext } from '@hello-pangea/dnd';


type AllTask ={
    AllTask:any,
    supabase:any, 
    setAllTask:any,
    loading:boolean
}

const Main: FC<AllTask> = ({AllTask, supabase, setAllTask, loading}) => {
    const UserId = useSelector((state: RootState) => state.UserId.UserId)
    const numProd = useSelector((state: RootState) => state.numProd.numProd)
    const dispatch = useAppDispatch()
    
    const params = useParams()
    useEffect(() => {
        const prodId = params.id
        dispatch(setnumProd(prodId))
    })

    async function UpsertData() {
        if (!loading) {
            const { error } = await supabase
            .from('boba')
            .update({
                todo_data : AllTask[0].todo_data
            })
            .eq('id', UserId)
            if (error !== null) {
                console.log(error)
            }
        }
        }

    const [addCard, setAddCard] = useState<boolean>(false)
    const [addTitle, setAddTitle] = useState<string>('')
    const [currentBoard, setCurrentBoard] = useState<any>(null)
    const [currentItem, setCurrentItem] = useState<any>(null)
    const [dropdownGap, setDropdownGap] = useState(false)
    const [screen, setScreen] = useState(false)
    const [form, setForm] = useState<any>(JSON.parse(localStorage.getItem('form')!))
    const BoardH1Ref = useRef<any>(null)

    const handleClick = (event:any) => {
        if (BoardH1Ref.current && BoardH1Ref.current.contains(event.target)) {
            setAddCard(true)
        } else {
            if (event.target.id !== 'addBoard')
            setAddCard(false)
        }
    }

    const handleKeyPress = (event:any) => {
        if(event.key === 'Enter'){
            AddBoard()
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClick)
        return () => {
            document.removeEventListener("mousedown", handleClick)
        }
    },[])

    function AddBoard() {
        if (addTitle !== '') {
            const BoardObj = {
                id: Math.random(),
                title: addTitle,
                numTask: 0,
                items: []
            }
            let copy = [...AllTask]
            copy[0].todo_data.Baza[numProd].Arrey.push(BoardObj)
            // setAllTask(copy)
            setAddCard(false)
            setAddTitle('')
            UpsertData()
        }   
    }

    const [test, setTest] = useState<any>([])

    useEffect(() => {
        if (!loading) {
            setTest(AllTask[0].todo_data.Baza[numProd].Arrey)
            
        }
    },[loading])
    
    function render() {
            const copy = [...AllTask]
            copy[0].todo_data.Baza[numProd].Arrey = test
            setAllTask(copy)
    }

    useEffect(() => {
        if (test[0] !== undefined) {
            render()
        }
    },[test])

    const refTask = useRef<any>();

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
    
    function formLocalBoard() {
        setForm(true)
        setDropdownGap(false)
        localStorage.setItem('form', 'true');
    }   

    function formLocalList() {
        setForm(false)
        setDropdownGap(false)
        localStorage.setItem('form', 'false');
    }   

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
            let column = copy[0].todo_data.Baza[numProd].Arrey.find((item:any) => {
                return item.id == source.droppableId
            })

            let newTask = column.items.find((item:any) => {
                return item.id == draggableId
            })
            column.items.splice(source.index, 1)
            column.items.splice(destination.index, 0, newTask)
            
            setAllTask(copy)
        } 
        /// если объект перемещается в другую колонку
        if (destination.droppableId !== source.droppableId) {
            const copy = [...AllTask]
            let column = copy[0].todo_data.Baza[numProd].Arrey.find((item:any) => {
                return item.id == source.droppableId
            })

            let columnNew = copy[0].todo_data.Baza[numProd].Arrey.find((item:any) => {
                return item.id == destination.droppableId
            })

            let newTask = column.items.find((item:any) => {
                return item.id == draggableId
            })
            column.items.splice(source.index, 1)
            columnNew.items.splice(destination.index, 0, newTask)

            setAllTask(copy)
        }
        // UpsertData()
    };

    return (
       
                <div className={style.main}>
                    {loading ? 
                    <div className={style.skeleton}>
                        <SkeletonBoard/>
                    </div>
                     : 
                        <>
                            <div className={style.flexHeader}>

                                    <h3 className={style.h3Title}>
                                        {AllTask[0].todo_data.Baza[numProd].title}
                                    </h3>
                                    <div className={style.flexHeaderBtn}>
                                        { !screen ? 
                                            <button className={style.headerBtn} onClick={() => setScreen(true)}>
                                                <BsClipboard2Check size={18}/>  Завершено задач: <span>{AllTask[0].todo_data.Baza[numProd].completed.length}</span>
                                            </button> :
                                            <button className={style.headerBtn} onClick={() => setScreen(false)}>
                                               <BsClipboard2Check size={18}/>  Вернутся к задачам
                                            </button>
                                        }
                                        <button className={style.btnHeaderPoint} onClick={() => setDropdownGap(true)}>
                                            <IoMdMore size={18}/>
                                        </button>
                                        <div className={dropdownGap ? style.dropdownMini : style.dropdownNone} ref={refTask}>
                                            <li><button onClick={() => formLocalBoard()} className={style.btnDropdown}><BiTable/> Таблица</button></li>
                                            <li><button onClick={() => formLocalList()} className={style.btnDropdown}><IoList/> Список</button></li>
                                        </div> 
                                        
                                    </div>

                                    </div>

                                    <div className={form ?  style.flexTable : style.Todo} >

                                                {!screen ?
                                                <DragDropContext
                                                onDragEnd={handleDragEnd}>
                                                        <div className={form ? "noneClick" : style.todoPosition}>
                                                        <Reorder.Group as="div"  axis={form ? "x" : "y"} values={AllTask[0].todo_data.Baza[numProd].Arrey} onReorder={setTest} 
                                                            className={form ? "noneClickTwo" : style.todoColumn} >
                                                            {AllTask[0].todo_data.Baza[numProd].Arrey.map((Task:any) => 
                                                                    <div key={Task.id}  style={{height:"100%"}}>
                                                                        <TaskMini Task={Task} currentBoard={currentBoard} currentItem={currentItem}
                                                                        setCurrentBoard={setCurrentBoard} setCurrentItem={setCurrentItem} supabase={supabase} AllTask={AllTask} setAllTask={setAllTask}
                                                                        loading={loading} userId={UserId} form={form}
                                                                        />
                                                                    </div>
                                                            )}
                                                        </Reorder.Group> 
                                                            
                                                        <div className={style.addСolumnPosition}>
                                                            {
                                                                addCard ? 
                                                                <div className={style.addBoard} ref={BoardH1Ref} id="addBoard">
                                                                    <div className={style.addBoardHeader}>
                                                                        <input value={addTitle} onChange={event => setAddTitle(event.target.value)} className={style.TitleInput} type="text" onKeyDown={handleKeyPress}/>
                                                                        <button className={style.CheckBtn} onClick={() => AddBoard()} >
                                                                            <FaCheck className={style.TodoObjHeaderMore} style={{ color:'gray'}}/>
                                                                        </button> 
                                                                    </div>
                                                                    
                                                                </div>
                                                                :
                                                                
                                                                <button onClick={() => setAddCard(true)} className={style.addСolumn}>
                                                                    <FiPlus size={22}/>
                                                                    Добавить колонку
                                                                </button>
                                                            }
                                                        </div>
                                                    </div>

                                                </DragDropContext>
                                                
                                                    :
                                                    <div className={style.containerFlex}>
                                                        
                                                        <CompletedTask AllTask={AllTask} setAllTask={setAllTask} numProd={numProd}/>
                                                        
                                                    </div>}
                                    </div> 
                        
                        </>



                    }
                    
                    
                         
                </div>

        
    )
}




export default Main