import { FC, useRef, useState, useEffect } from "react";
import { IoMdMore } from "react-icons/io";
import style from '../main.module.css';
import './styleDraggable.css';
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { RootState } from '../../../redux/store';

type TaskMiniProps = {
    list: {
        id: number;
        titleTask: string;
        colorTask: string;
        importanceTask: string;
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
    setAllTask:any
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
    setAllTask
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

    function dragHadler(e:any, Task:any, list:any) {
        e.target.style.opacity = '0.3'
        setCurrentBoard(Task)
        setCurrentItem(list)
    }

    function dragEndHadler(e:any) {
        if (e.target.className === 'taskMini') {
            e.target.style.boxShadow = 'none'
        }
        
    }

    function dragLeaveHadler(e:any) {
        e.target.style.boxShadow = 'none'
    }

    function dragOverHandler(e:any) {
        e.preventDefault()
        if (e.target.className ==='taskMini') {
            e.target.style.boxShadow = '0 4px 3px gray'
        }
    }
    
    function dropHandler(e:any, Task:any, list:any) {
        e.target.style.boxShadow = 'none'
        e.stopPropagation() 
        e.preventDefault()
        if (currentItem !== null) {
            const currentIndex = currentBoard.items.indexOf(currentItem)
            const dropIndex = Task.items.indexOf(list)
            if (Task.id !== currentBoard.id) {
                currentBoard.items.splice(currentIndex, 1)
                Task.items.splice(dropIndex , 0, currentItem)
            } else if(Task.id === currentBoard.id) {
                Task.items.splice(dropIndex, 1, currentItem)
                Task.items.splice(currentIndex, 1, list)
            } 
        }
        setCurrentItem(null)
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

    function deleteBourd( Task:any, list:any) {
        const copy = [...AllTask]
        const index = copy[0].todo_data.Baza[numProd].Arrey.findIndex((n:any) => n.id === Task.id);
        const indexTop = copy[0].todo_data.Baza[numProd].Arrey[index].items.indexOf(list)
        // Task.items.splice(index, 1)
        if (index !== -1) {
            copy[0].todo_data.Baza[numProd].Arrey[index].items.splice(indexTop, 1)
        }
        setAllTask(copy)
    }

    function colorTask(Task:any, list:any, block:string) {
        const copy = [...AllTask]
        const index = copy[0].todo_data.Baza[numProd].Arrey.findIndex((n:any) => n.id === Task.id);
        const indexTop = copy[0].todo_data.Baza[numProd].Arrey[index].items.indexOf(list)
        copy[0].todo_data.Baza[numProd].Arrey[index].items[indexTop].colorTask = block
        setAllTask(copy)
    }

    function colorTaskDefault(Task:any, list:any) {
        const copy = [...AllTask]
        const index = copy[0].todo_data.Baza[numProd].Arrey.findIndex((n:any) => n.id === Task.id);
        const indexTop = copy[0].todo_data.Baza[numProd].Arrey[index].items.indexOf(list)
        copy[0].todo_data.Baza[numProd].Arrey[index].items[indexTop].colorTask = 'white'
        setAllTask(copy)
    }
    
    return(
        <div draggable
        onDrag={(e:any) => dragHadler(e, Task, list)}
        onDragLeave={(e:any) => dragLeaveHadler(e)}
        onDragEnd={(e:any) => dragEndHadler(e)}
        onDragOver={(e:any) => dragOverHandler(e)}
        onDrop={(e:any) => dropHandler(e, Task, list)} 
        className='taskMini' style={{backgroundColor:list.colorTask}} onMouseEnter={() => {setIsShownMini(true)}}  onMouseLeave={() => {setIsShownMini(false)}}>
            <p className={style.taskMiniText}>{list.titleTask}</p>
            <button className={isShownMini ? style.moreMini : style.moreMiniNone} onClick={() => setDropdownGap(true)}>
                <IoMdMore size={16}/>
            </button>    
            <ul className={dropdownGap ? "dropdownMini" : "dropdownNone"} ref={refTask}>
                <li><button onClick={() => {setModalActive(true), setDropdownGap(false)}} className={style.btnDropdown}>Установить цвет</button></li>
                <li><button onClick={() => deleteBourd( Task, list)} className={style.btnDropdownDelete}>Удалить</button></li>
            </ul> 
            <div className={modalActive ? "modal active" : 'modal'} onClick={() => setModalActive(false)}>
                <div className='ModalContent' onClick={e => e.stopPropagation()}>
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
    )
}

export default ArrayTask;