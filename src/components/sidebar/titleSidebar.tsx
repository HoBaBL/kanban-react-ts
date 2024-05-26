import { FC, useState, useRef, useEffect } from "react";
import style from './sidebar.module.css'
import { IoMdMore } from "react-icons/io";
import { useAppDispatch } from '../../hooks';
import { FiBook } from "react-icons/fi";
import { setnumProd } from "../../redux/slice/numProd";
import { useSelector } from "react-redux";
import { RootState } from '../../redux/store';
import { Link, useParams } from "react-router-dom";
import { LuClipboardList } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import {setСhanges} from "../../redux/slice/AllTask"

type TitleSidebarType = {
    title:any,
    AllTask:any,
    setAllTask:any,
}

const TitleSidebar:FC<TitleSidebarType> = ({title, AllTask, setAllTask}) => {
    const [dropdownGap, setDropdownGap] = useState(false)
    const dispatch = useAppDispatch()
    const refTask = useRef<any>();
    const [titleСhange, setTitleСhange] = useState(title.title)
    const [modalActive, setModalActive] = useState(false)
    const numProd = useSelector((state: RootState) => state.numProd.numProd)
    const navigate = useNavigate();
    const changes = useSelector((state: RootState) => state.changes.changes)

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

    function titleChange(num:number) {
        const copy = [...AllTask] 
        copy[0].todo_data.Baza[num].title = titleСhange
        
        setModalActive(false)
        setTitleСhange('')
        setAllTask(copy)
    }

    function deleteBaza(index:number) {
        console.log(AllTask[0].todo_data.Baza.indexOf(title))
        const copy = [...AllTask]
        if (index === AllTask[0].todo_data.Baza.indexOf(title)) {
            // dispatch(setnumProd(0))
            navigate("/home")
        }
        if (index !== -1) {
            copy[0].todo_data.Baza.splice(index, 1)
            
        }
        
        setAllTask(copy)
        dispatch(setСhanges(changes + 1))
    }

    return (
        <div className={style.flexBtn}>
                <Link to={`/baza/${AllTask[0].todo_data.Baza.indexOf(title)}`} className={style.btnMenu} >
                    <p className={style.textProject}><FiBook size={22}/> {title.title}</p>
                </Link>
                <div>
                    <button onClick={() => setDropdownGap(true)} className={style.pointBtn}><IoMdMore size={16}/></button>
                    <ul className={dropdownGap ? style.dropdownMini : style.dropdownNone} ref={refTask}>
                        <li><button onClick={() => setModalActive(true)} className={style.btnDropdown}>Изменить название</button></li>
                        <li><button onClick={() => deleteBaza(AllTask[0].todo_data.Baza.indexOf(title))} className={style.btnDropdownDelete}>Удалить</button></li>
                    </ul> 
                </div>
            
        
            <div className={modalActive ? "modal active" : 'modal'} onClick={() => setModalActive(false)}>
                <div className='ModalContent' onClick={e => e.stopPropagation()}>
                    <div className={style.flexAdd}>
                        <p className={style.flexBigText}>Изменить название</p>  
                        <p className={style.flexText}>Название:</p>  
                        <input value={titleСhange} onChange={event => setTitleСhange(event.target.value)} type="text" />
                        <button onClick={() => titleChange(AllTask[0].todo_data.Baza.indexOf(title))} className={style.addTitle}>Изменить название</button>
                    </div>
                </div> 
            </div>
            
        </div>
    )
}

export default TitleSidebar;
