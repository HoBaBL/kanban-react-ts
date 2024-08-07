import { FC, useEffect, useState } from "react"
import style from './sidebar.module.css'
import { CiMenuFries } from "react-icons/ci";
import { RiHome2Line } from "react-icons/ri";
import { BiBell } from "react-icons/bi";
import { FiPlus } from "react-icons/fi";
import { MdOutlineAccountCircle } from "react-icons/md";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from '../../redux/store';
import TitleSidebar from "./titleSidebar";
import { useAppDispatch } from '../../hooks';
import { useNavigate } from "react-router-dom";
import {setUserId} from "../../redux/slice/UserId";
import { Outlet} from "react-router-dom";
import { setUserName } from "../../redux/slice/userName";
// import { setAllTask } from "../../redux/slice/AllTask";
import {setСhanges} from "../../redux/slice/AllTask"
import PomodoroSidebar from "./pomodoroSidebar";
import { setTimeM } from "../../redux/slice/pomodoro";
import { IoCalendarNumberOutline } from "react-icons/io5";

type sidebarType = {
    // AllTask:any,
    supabase:any, 
    // setAllTask:any,
    // loading:boolean
}

const Sidebar: FC<sidebarType> = ({supabase}) => {
    const UserId = useSelector((state: RootState) => state.UserId.UserId)
    const UserName:any = useSelector((state: RootState) => state.UserName.UserName)
    const changes = useSelector((state: RootState) => state.changes.changes)
    const [loading, setLoading] = useState(true)
    const [modalActive, setModalActive] = useState(false)
    const [title, setTitle] = useState('')
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const [AllTask, setAllTask] = useState<any>([])

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
      if (error !== null) {
          console.log(error)
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
  
    useEffect(() => {
    // getData();
        UpsertData()
    }, [AllTask]);
  
    /////

    useEffect(() => {
        if (localStorage.getItem('workTime') === null) {
            localStorage.setItem('workTime', '10');
            localStorage.setItem('restTime', '3');
        } else if (sessionStorage.getItem('min') === '0') {
            dispatch(setTimeM(localStorage.getItem('workTime')))
        }
        
    },[])


    useEffect(() => {
        testName()
    },[])

    async function testName() {
        const { data, error } = await supabase.auth.getSession()
        dispatch(setUserName(data.session?.user.user_metadata.first_name))
        if (error !== null) {
            console.log(error)
        }
    }

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
    
    function addBaza() {
        const Baza ={
                title: title,
                Arrey: [
                    {
                        id: 1,
                        title: "Неразобранное",
                        color: "",
                        items: [],
                        
                    },
                    {
                        id: 2,
                        title: "В работе",
                        color: "",
                        items: [],
                        
                    },
                    {
                        id: 3,
                        title: "Готово",
                        color: "",
                        items: []
                    }
                ],
                completed: []
        }
        const copy = AllTask.slice()
        
        copy[0].todo_data.Baza.push(Baza)
        setAllTask(copy)
        UpsertData()
        setModalActive(false)
        setTitle('')
        dispatch(setСhanges(changes + 1))
    }
    


    return (
        <div className={style.backgroundFon}>
            <div className={style.sidebar}>
                {/* <div className={style.sidebarHeader}>
                    <button onClick={() => setSidebarActive(!sidebarActive)}><CiMenuFries size={26}/></button>
                </div> */}
                    <div className={style.menu}>
                        {loading ? <p>Загрузка</p> :
                            <Link to={`/account`} className={style.btnMenu}>
                                <MdOutlineAccountCircle size={24}/> {UserName}
                            </Link>
                        }
                        <Link to={`/home`} className={style.btnMenu}>
                            <RiHome2Line size={22}/> Главная
                        </Link>
                        <Link to={`/diary`} className={style.btnMenu}>
                            <IoCalendarNumberOutline size={22}/> Ежедневник
                        </Link>
                    </div>
                <div className={style.project}>
                        <p className={style.AllProject}>Ваши проекты</p>
                    <div className={style.projectPosition}>
                        {loading ? <p>Загрузка</p> :
                        AllTask[0] !== undefined &&
                        AllTask[0].todo_data.Baza.map((title:any) => (
                            <TitleSidebar key={title.title} title={title} AllTask={AllTask} setAllTask={setAllTask}/>
                        ))
                            
                        }
                    </div>
                    <button onClick={() => setModalActive(true)} className={style.addProject}><FiPlus size={24}/>Добавить проект</button>
                    <PomodoroSidebar/>
                    <div className={modalActive ? "modal active" : 'modal'} onClick={() => setModalActive(false)}>
                        <div className='ModalContent' onClick={e => e.stopPropagation()}>
                            <div className={style.flexAdd}>
                                <p className={style.flexBigText}>Добавить проект</p>  
                                <p className={style.flexText}>Название:</p>  
                                <input value={title} onChange={event => setTitle(event.target.value)} type="text" />
                                <button onClick={() => addBaza()} className={style.addTitle}>Добавить проект</button>
                            </div>
                        </div>    
                    </div> 
                </div>
            </div>
            <Outlet />
        </div>
        
    )
}




export default Sidebar