import { FC, useRef, useState, useEffect} from "react"
import style from './main.module.css'
import TaskMini from "./taskMain/taskMain"
import { FiPlus } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import './taskMain/styleDraggable.css';
import { createClient } from "@supabase/supabase-js";
import { useSelector } from "react-redux";
import { RootState } from '../../redux/store';
import { useAppDispatch } from '../../hooks';
import {setUserId} from "../../redux/slice/UserId";
// import { setSupabase } from "../../redux/slice/Supabase";
import { useNavigate } from "react-router-dom";

const supabase = createClient("https://ynelcdqjjejcylduvmjy.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluZWxjZHFqamVqY3lsZHV2bWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc0ODE0NjcsImV4cCI6MjAyMzA1NzQ2N30.nvBnJPg5HG57sSU2JGLeQIi2zBbbInRnar2qWTIUhKc");

const Main: FC = () => {
    const UserId = useSelector((state: RootState) => state.UserId.UserId)
    const [AllTask, setAllTask] = useState<any>([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();

    const dispatch = useAppDispatch()
    useEffect(() => {
            test()
    },[])

    async function test() {
        const { data, error } = await supabase.auth.getSession()
        Proverka(data.session?.user.id)
        dispatch(setUserId(data.session?.user.id))
        if (data.session?.user.id === undefined) {
            navigate("/login")
        }
        console.log(error)
    }

    async function Proverka(userId:any) {
        const { data, error } = await supabase
        .from("boba")
        .select()
        .eq('id', userId);
        setAllTask(data);
        setLoading(false)
        console.log(error)
    }
    
    
    useEffect(() => {
        // getData();
        UpsertData()
    }, [AllTask]);

    async function UpsertData() {
        if (!loading) {
            const { error } = await supabase
            .from('boba')
            .update({
                todo_data : AllTask[0].todo_data
            })
            .eq('id', UserId)
            console.log(error)
        }
    }

    const [addCard, setAddCard] = useState<boolean>(false)
    const [addTitle, setAddTitle] = useState<string>('')
    const [currentBoard, setCurrentBoard] = useState<any>(null)
    const [currentItem, setCurrentItem] = useState<any>(null)
    const [indexBoard, setIndexBoard] = useState<any>(null)
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
            const BoardIndex = AllTask[0].todo_data.Baza[0].Arrey.indexOf(indexBoard)
            const BoardDropIndex = AllTask[0].todo_data.Baza[0].Arrey.indexOf(Task)
            const copy = [...AllTask]
            copy[0].todo_data.Baza[0].Arrey.splice(BoardDropIndex, 1, indexBoard)
            copy[0].todo_data.Baza[0].Arrey.splice(BoardIndex, 1, Task)
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
            if (event.target.className === 'noneClick' || event.target.className === 'noneClickTwo')
            setAddCard(false)
        }
    }

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
            copy[0].todo_data.Baza[0].Arrey.push(BoardObj)
            // setAllTask(copy)
            setAddCard(false)
            setAddTitle('')
            UpsertData()
        }   
        
    }

    return (
        <div className='main'>
                <div>
                    <h3 className={style.h3Title}>
                        {loading ? <p>Загрузка</p> :
                            AllTask[0].todo_data.Baza[0].title
                        }
                    </h3>
                    <div className={style.flexTable}>
                        <div className="noneClick">
                            {loading ? <p>Загрузка</p> :
                                    AllTask[0].todo_data.Baza[0].Arrey.map((Task:any) => 
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
                                        
                                    )
                                
                            }
                            <div className={style.addСolumnPosition}>
                                {
                                    addCard ? 
                                    <div className={style.addBoard} ref={BoardH1Ref}>
                                        <div className={style.addBoardHeader}>
                                            <input value={addTitle} onChange={event => setAddTitle(event.target.value)} className={style.TitleInput} type="text"/>
                                            <button className={style.CheckBtn} onClick={() => AddBoard()}>
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
                    </div>
                </div>
        </div>
    )
}




export default Main