import { FC, useRef, useState, useEffect} from "react"
import style from './main.module.css'
import TaskMini from "./taskMain/taskMain"
import { FiPlus } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import './taskMain/styleDraggable.css';
import { useSelector } from "react-redux";
import { RootState } from '../../redux/store';
import CompletedTask from "./completedTask/completedTask";

type AllTask ={
    AllTask:any,
    supabase:any, 
    setAllTask:any,
    loading:boolean
}

const Main: FC<AllTask> = ({AllTask, supabase, setAllTask, loading}) => {
    const UserId = useSelector((state: RootState) => state.UserId.UserId)
    const numProd = useSelector((state: RootState) => state.numProd.numProd)

    
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
    const [indexBoard, setIndexBoard] = useState<any>(null)
    const [screen, setScreen] = useState(false)
    const BoardH1Ref = useRef<any>(null)

    function dragHadler( Task:any) {
        setCurrentBoard(Task)
        setIndexBoard(Task)
    }
    
    // function dragEndHadler(e:any) {}

    function dragOverHandler(e:any) {
        e.preventDefault()
    }

    function dropHandler(e:any, Task:any) {
        e.preventDefault()
        if (e.target.className !== 'bigTable') {
            const BoardIndex = AllTask[0].todo_data.Baza[numProd].Arrey.indexOf(indexBoard)
            const BoardDropIndex = AllTask[0].todo_data.Baza[numProd].Arrey.indexOf(Task)
            const copy = [...AllTask]
            copy[0].todo_data.Baza[numProd].Arrey.splice(BoardDropIndex, 1, indexBoard)
            copy[0].todo_data.Baza[numProd].Arrey.splice(BoardIndex, 1, Task)
            setAllTask(copy)
            
        } else if (e.target.className !=='taskMini' && currentItem !== null){
            e.preventDefault()
            Task.items.push(currentItem)
            const currentIndex = currentBoard.items.indexOf(currentItem)
            currentBoard.items.splice(currentIndex, 1)
        }
        e.target.style.opacity = '1'
        setCurrentItem(null)
        UpsertData()
    }

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

    return (
        <div className={style.main}>
                
                    
                        {loading ? <p>Загрузка</p> :
                        <div className={style.flexHeader}>
                            <h3 className={style.h3Title}>
                                {AllTask[0].todo_data.Baza[numProd].title}
                            </h3>
                            { !screen ? 
                                <button className={style.headerBtn} onClick={() => setScreen(true)}>
                                    Завершено задач: <span>{AllTask[0].todo_data.Baza[numProd].completed.length}</span>
                                </button> :
                                <button className={style.headerBtn} onClick={() => setScreen(false)}>
                                    Вернутся к задачам
                                </button>
                            }
                            
                        </div>
                            
                        }
                        
                    
                    
                    <div className={style.flexTable} >
                        
                            {loading ? <p>Загрузка</p> :

                                !screen ?
                                <div className="noneClick">
                                    {AllTask[0].todo_data.Baza[numProd].Arrey.map((Task:any) => 
                                    <div className="noneClickTwo" key={Task.id} 
                                        draggable={true}
                                        onDrag={() => dragHadler( Task)}
                                        // onDragLeave={(e:any) => dragEndHadler(e)}
                                        // onDragEnd={(e:any) => dragEndHadler(e)}
                                        onDragOver={(e:any) => dragOverHandler(e)}
                                        onDrop={(e:any) => {dropHandler(e, Task)}}
                                        >
                                        <TaskMini Task={Task} currentBoard={currentBoard} currentItem={currentItem}
                                        setCurrentBoard={setCurrentBoard} setCurrentItem={setCurrentItem} supabase={supabase} AllTask={AllTask} setAllTask={setAllTask}
                                         loading={loading} userId={UserId}
                                        />
                                    </div>
                                        
                                    )}
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
                                     :
                                    <div className={style.containerFlex}>
                                        
                                        <CompletedTask AllTask={AllTask} numProd={numProd}/>
                                        
                                    </div>
                                    
                            }
                            
                        
                            
                        
                    </div>
                
        </div>
    )
}




export default Main