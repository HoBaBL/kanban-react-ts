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

type sidebarType = {
    AllTask:any,
    supabase:any, 
    setAllTask:any,
    loading:boolean
}

const Sidebar: FC<sidebarType> = ({AllTask, supabase, setAllTask, loading}) => {
    const [name, setName] = useState('')
    const UserId = useSelector((state: RootState) => state.UserId.UserId)
    const [modalActive, setModalActive] = useState(false)
    const [title, setTitle] = useState('')
    

    async function exitUser() {
        const { error } = await supabase.auth.signOut()
        if (error !== null) {
            console.log(error)
        }
    }

    useEffect(() => {
        test()
    },[])

    async function test() {
        const { data, error } = await supabase.auth.getSession()
        setName(data.session?.user.user_metadata.first_name)
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
            console.log(error) 
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
        const copy = [...AllTask]
        copy[0].todo_data.Baza.push(Baza)
        setAllTask(copy)
        UpsertData()
        setModalActive(false)
        setTitle('')
    }

    function miniSidebar() {

    }

    return (
        <div className={style.sidebar}>
            <div className={style.sidebarHeader}>
                <img src="../../images/logo.png" alt="" />
                <button onClick={() => miniSidebar()}><CiMenuFries size={26}/></button>
            </div>
            <div className={style.menu}>
                <button className={style.btnMenu}>
                    <p><MdOutlineAccountCircle size={24}/> {name}</p>
                </button>
                <button className={style.btnMenu}>
                    <p><RiHome2Line size={22}/> Главная</p>
                </button>
                <button className={style.btnMenu}>
                    <p><BiBell size={22}/> Уведомления</p>
                </button>
            </div>
            <div className={style.project}>
                <p className={style.AllProject}>Ваши проекты</p>
                <div className={style.projectPosition}>
                    {loading ? <p>Загрузка</p> :
                      AllTask[0].todo_data.Baza.map((title:any) => (
                        <TitleSidebar key={title.title} title={title} AllTask={AllTask} setAllTask={setAllTask}/>
                      ))
                        
                    }
                </div>
                <button onClick={() => setModalActive(true)} className={style.addProject}><FiPlus /> Добавить проект</button>
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
            <Link to={`login`}>
                <button onClick={() => exitUser()}>Выход</button>
            </Link>
            
        </div>
    )
}




export default Sidebar