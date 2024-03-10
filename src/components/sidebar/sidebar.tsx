import { FC, useEffect, useState } from "react"
import style from './sidebar.module.css'
import { CiMenuFries } from "react-icons/ci";
import { RiHome2Line, RiSearchLine } from "react-icons/ri";
import { BiBell } from "react-icons/bi";
import { FiPlus, FiBook } from "react-icons/fi";
import { MdOutlineAccountCircle } from "react-icons/md";
import { useAppDispatch } from '../../hooks';
import { Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const Sidebar: FC = () => {
    const supabase = createClient("https://ynelcdqjjejcylduvmjy.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluZWxjZHFqamVqY3lsZHV2bWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc0ODE0NjcsImV4cCI6MjAyMzA1NzQ2N30.nvBnJPg5HG57sSU2JGLeQIi2zBbbInRnar2qWTIUhKc");
    const [name, setName] = useState('')
    const [list, setList] = useState<any>()
    const [loading, setLoading] = useState(true)

    async function exitUser() {
        const { error } = await supabase.auth.signOut()

    }

    useEffect(() => {
        test()
    },[])

    async function test() {
        const { data, error } = await supabase.auth.getSession()
        setName(data.session?.user.user_metadata.first_name)
        Proverka(data.session?.user.id)
    }

    async function Proverka(userId:any) {
        const { data, error } = await supabase
        .from("boba")
        .select()
        .eq('id', userId);
        setList(data);
        setLoading(false)
    }
    

    return (
        <div className={style.sidebar}>
            <div className={style.sidebarHeader}>
                <img src='../../images/logo.png' alt="" />
                <button><CiMenuFries size={26}/></button>
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
                      list[0].todo_data.Baza.map((title:any) => (
                        <button key={title.title} className={style.btnMenu}>
                            <p className={style.textProject}><FiBook size={22}/> {title.title}</p>
                        </button>
                      ))
                        
                    }
                </div>
                <button className={style.addProject}><FiPlus /> Добавить проект</button>
            </div>
            <Link to={`login`}>
                <button onClick={() => exitUser()}>Выход</button>
            </Link>
            
        </div>
    )
}




export default Sidebar