import { FC, useState, useEffect } from "react";
import style from './home.module.css'
import { useAppDispatch } from '../../hooks';
import { useNavigate } from "react-router-dom";
import {setUserId} from "../../redux/slice/UserId";
import { useSelector } from "react-redux";
import { RootState } from '../../redux/store';
import { Link } from "react-router-dom";
import { LuClipboardList } from "react-icons/lu";
import Pomodoro from "../pomodoro/pomodoro";
import { FaCheck} from "react-icons/fa6";
import CoffeeBreak from '../../assets/CoffeeBreak.svg'
import Pana from '../../assets/EnthusiasticPana.svg'
import blogging from '../../assets/BloggingPana.svg'

type HomeType ={
    supabase:any, 
}

const Home:FC<HomeType> = ({supabase}) => {
    const [AllTask, setAllTask] = useState<any>([])
    const [myTaskBtn, setMyTaskBtn] = useState('Today')
    const dispatch = useAppDispatch()
    const UserName:any = useSelector((state: RootState) => state.UserName.UserName)
    const navigate = useNavigate();
    // const loading:any = useSelector((state: RootState) => state.loading.loading)
    const [loading, setLoading] = useState(true)
    const changes = useSelector((state: RootState) => state.changes.changes)
    const [TodayTask, setTodayTask] = useState<any>([])
    const [Overdue, setOverdue] = useState<any>([])
    const [Over, setOver] = useState<any>([])
    const UserId = useSelector((state: RootState) => state.UserId.UserId)

    const monthArray = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

    useEffect(() => {
        UpsertData()
    }, [AllTask]);

    async function UpsertData() {
        if (!loading) {
            const { error } = await supabase
            .from('boba')
            .update({
                column : AllTask[0].column,
                todo_data : AllTask[0].todo_data
            })
            .eq('id', UserId)
            if (error !== null) {
                console.log(error)
            }
        }
    }
    
    const dateToday = new Date()
    let day = dateToday.getDate();
    let month = monthArray[dateToday.getMonth()];
    let currentDateCalendar = `${day} ${month}`;
    
    useEffect(() => {
        test()
      },[])

      useEffect(() => {
        test()
      },[changes])
    
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

    function renderHome() {
        const copy = [...TodayTask]
        

        if (AllTask[0] !== undefined) {
            /// массив дел на сегодня

            for (let i = 0; i < AllTask[0].column.tasks.length; i++) {
                AllTask[0].column.tasks[i].task.map((item:any) => {
                    if (item.day === day && item.monthDate === dateToday.getMonth()) {
                        const objItem = {
                            id: item.id,
                            titleTask: item.titleTask,
                            boardName: "Ежедневник",
                            link: '/diary'
                        }
                        copy.push(objItem)
                    }
                })
            }

            for (let i = 0; i < AllTask[0].todo_data.Baza.length; i++) {
               for (let y = 0; y <  AllTask[0].todo_data.Baza[i].Arrey.length; y++) {
                AllTask[0].todo_data.Baza[i].Arrey[y].items.map((item:any) => {
                    if (item.day === day && item.monthDate === dateToday.getMonth()) {
                        const objItem = {
                            id: item.id,
                            titleTask: item.titleTask,
                            boardName: AllTask[0].todo_data.Baza[i].title,
                            link:`/baza/${i}`
                        }
                        copy.push(objItem)
                    }
                })
               }
            }
            setTodayTask(copy)

            /// массив просроченых дел

            const copyOverdue = [...Overdue]

            for (let i = 0; i < AllTask[0].column.tasks.length; i++) {
                AllTask[0].column.tasks[i].task.map((item:any) => {
                    if (item.day < day && item.monthDate <= dateToday.getMonth()) {
                        const objItem = {
                            id: item.id,
                            titleTask: item.titleTask,
                            boardName: "Ежедневник",
                            date: item.date,
                            link: '/diary'
                        }
                        copyOverdue.push(objItem)
                    }
                })
            }

            for (let i = 0; i < AllTask[0].todo_data.Baza.length; i++) {
                for (let y = 0; y <  AllTask[0].todo_data.Baza[i].Arrey.length; y++) {
                AllTask[0].todo_data.Baza[i].Arrey[y].items.map((item:any) => {
                     if (item.day < day && item.monthDate <= dateToday.getMonth()) {
                         const objItem = {
                             id: item.id,
                             titleTask: item.titleTask,
                             boardName: AllTask[0].todo_data.Baza[i].title,
                             date: item.date,
                             link:`/baza/${i}`
                        }
                        copyOverdue.push(objItem)
                     }
                })
                }
            }
            copyOverdue.sort((a, b) => a.date > b.date ? 1 : -1)

            setOverdue(copyOverdue)

            /// массив для выполненых сегодня задач

            const copyOver = [...Over]

            AllTask[0].column.completed.map((item:any) => {
                if (item.day === day && item.month === dateToday.getMonth()) {
                    const objItem = {
                        id: item.id,
                        titleTask: item.titleTask,
                        boardName: "Ежедневник",
                        date: item.date,
                        link: '/diary'
                    }
                    copyOver.push(objItem)
                }
            })

            for (let i = 0; i < AllTask[0].todo_data.Baza.length; i++) {
                AllTask[0].todo_data.Baza[i].completed.map((item:any) => {
                    if (item.day === day && item.month === dateToday.getMonth()) {
                        const objItem = {
                            id: item.id,
                            titleTask: item.titleTask,
                            boardName: AllTask[0].todo_data.Baza[i].title,
                            date: item.date,
                            link:`/baza/${i}`
                        }
                        copyOver.push(objItem)
                    }
                    
                })
            }
            setOver(copyOver)
        }
    }

    useEffect(() => { /// при открытии страницы обновляются массивы на главной вкладке
        renderHome()
    }, [loading])

    function CompletedTaskHome(item:any) {
        const copy = [...AllTask]
        const copyToday = [...TodayTask]
        const copyCompleted = [...Over]
        const copyOverdue = [...Overdue]
        const date = new Date();

        let day = date.getDate();
        let month = monthArray[date.getMonth()];

        let hours = date.getHours()
        let minutes = date.getMinutes()
        let time = `${hours}:${minutes}`
        let currentDate = `${day} ${month}`;

        if (item.boardName === "Ежедневник") {
            
            for (let i = 0; i < AllTask[0].column.tasks.length; i++) {
                AllTask[0].column.tasks[i].task.map((task:any) => {
                    if (task.id === item.id) {
                        const indexTop = copy[0].column.tasks[i].task.indexOf(task)
                        copy[0].column.tasks[i].task.splice(indexTop, 1)
                        if (myTaskBtn === "Today") {
                            const index = copyToday.indexOf(item)
                            copyToday.splice(index, 1)
                            copyCompleted.unshift(item)
                        } else if (myTaskBtn === "Overdue") {
                            const index = copyOverdue.indexOf(item)
                            copyOverdue.splice(index, 1)
                            copyCompleted.unshift(item)
                        }
                        
                        const obj = {
                            date: currentDate,
                            id: task.id,
                            titleTask: task.titleTask,
                            time: time,
                            day: day,
                            month:date.getMonth()
                        }
                        copy[0].column.completed.unshift(obj)
                        setAllTask(copy)
                        setTodayTask(copyToday)
                        setOverdue(copyOverdue)
                        setOver(copyCompleted)
                    }
                })
            }
        } else {
            for (let i = 0; i < AllTask[0].todo_data.Baza.length; i++) {
                for (let y = 0; y < AllTask[0].todo_data.Baza[i].Arrey.length; y++) {
                    AllTask[0].todo_data.Baza[i].Arrey[y].items.map((task:any )=> {
                        if (item.id === task.id) {
                            const indexTop = copy[0].todo_data.Baza[i].Arrey[y].items.indexOf(task)
                            copy[0].todo_data.Baza[i].Arrey[y].items.splice(indexTop, 1)
                            if (myTaskBtn === "Today") {
                                const index = copyToday.indexOf(item)
                                copyToday.splice(index, 1)
                                copyCompleted.unshift(item)
                            } else if (myTaskBtn === "Overdue") {
                                const index = copyOverdue.indexOf(item)
                                copyOverdue.splice(index, 1)
                                copyCompleted.unshift(item)
                            }
                            const obj = {
                                date: currentDate,
                                id: task.id,
                                titleTask: task.titleTask,
                                time: time,
                                day: day,
                                month:date.getMonth()
                            }

                            copy[0].todo_data.Baza[i].completed.unshift(obj)
                            setAllTask(copy)
                            setTodayTask(copyToday)
                            setOverdue(copyOverdue)
                            setOver(copyCompleted)
                        }
                    })
                }
            }
        }
    }

    

    return (
        <div className={style.home}>
            <h2 className={style.h2}>Главная</h2>
            {loading ? <p>Загрузка</p> :
            <div className={style.homeContainer}>
                <div className={style.headerPosition}>
                    <p className={style.dataText}>{currentDateCalendar}</p>
                    <p className={style.headerText}>Здравствуйте, {UserName}</p>
                </div>

                <div className={style.myTask}>
                    <h2 className={style.boardFlexH2}>Мои задачи</h2>
                    <div className={style.flexBtn}>
                        <button onClick={() => setMyTaskBtn("Today")} className={myTaskBtn === "Today" ? style.btnMyTaskActive : style.btnMyTask}>Задачи на сегодня</button>
                        <button onClick={() => setMyTaskBtn("Overdue")} className={myTaskBtn === "Overdue" ? style.btnMyTaskActive : style.btnMyTask}>Просрочено</button>
                        <button onClick={() => setMyTaskBtn("Done")} className={myTaskBtn === "Done" ? style.btnMyTaskActive : style.btnMyTask}>Выполнено сегодня</button>
                    </div>
                    <div className={style.positionMenu}>
                        { myTaskBtn === "Today" ? 
                            <div>
                                {TodayTask.length > 0 ?
                                <div className={style.todayBlock}>
                                    {TodayTask.map((today:any) => 
                                        <div className={style.today} key={today.id}>
                                            <div className={style.flex}>
                                                <button onClick={() => CompletedTaskHome(today)} className={style.btnCircle}>
                                                    <FaCheck size={12}/>
                                                </button>
                                                <p className={style.todayText}>{today.titleTask}</p>
                                            </div>
                                            <Link to={today.link} className={style.linkStyle}>
                                                <p className={style.textName}>{today.boardName}</p>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                                    
                                :
                                <div className={style.imgPositionCompleted}>
                                    <img className={style.imgToday} src={CoffeeBreak} alt="" />
                                    <p>У вас нет на сегодня задач!</p>
                                    
                                </div>
                                }
                            </div>
                            :  myTaskBtn === "Overdue" ? 
                                <div>
                                    {Overdue.length > 0 ?
                                    <div className={style.todayBlock}>
                                        {
                                            Overdue.map((today:any) => 
                                                <div className={style.today} key={today.id}>
                                                    <div className={style.flex}>
                                                        <button onClick={() => CompletedTaskHome(today)} className={style.btnCircle}>
                                                            <FaCheck size={12}/>
                                                        </button>
                                                        <p className={style.todayText}>{today.titleTask}</p>
                                                    </div>
                                                    <div className={style.flexOver}>
                                                        <Link to={today.link} className={style.linkStyle}>
                                                            <p className={style.textName}>{today.boardName}</p>
                                                        </Link>
                                                        <p className={style.dateText}>{today.date}</p>
                                                    </div>
                                                    
                                                </div>
                                            )
                                        }
                                    </div>
                                        
                                        : 
                                        <div className={style.imgPositionCompleted}>
                                            <img className={style.imgToday} src={Pana} alt="" />
                                            <p>У вас нет просроченых задач. Отлично!</p>
                                        </div>

                                    }
                                </div>
                                : 
                                <div>
                                    {Over.length > 0 ?
                                        <div className={style.todayBlock}>
                                            {Over.map((today:any) => 
                                                <div className={style.today} key={today.id}>
                                                    <div className={style.flex}>
                                                        <button className={style.btnCircle} style={{border:'solid 1px #0066CC'}}>
                                                            <FaCheck size={12} color="#0066CC"/>
                                                        </button>
                                                        <p className={style.todayText}>{today.titleTask}</p>
                                                    </div>
                                                    <div className={style.flexOver}>
                                                        <Link to={today.link} className={style.linkStyle}>
                                                            <p className={style.textName}>{today.boardName}</p>
                                                        </Link>
                                                    </div>
                                                </div>
                                    )}
                                        </div>
                                        : 
                                        <div className={style.imgPositionCompleted}>
                                            <img className={style.imgToday} src={blogging} alt="" />
                                            <p>Здесь хранятся выполненые задачи за сегодня.</p>
                                        </div>
                                    }
                                    
                                </div>
                        }
                    </div>
                </div>
                <div className={style.flexHome}>
                    <div className={style.boardFlex}>
                        <h2 className={style.boardFlexH2}>Проекты</h2>
                        <div className={style.flexProject}>
                            {AllTask[0] !== undefined && AllTask[0].todo_data.Baza.map((board:any) => 
                                <Link to={`/baza/${AllTask[0].todo_data.Baza.indexOf(board)}`} key={board.title} className={style.board}>
                                    <h3 className={style.h3}><LuClipboardList size={22}/> {board.title}</h3>
                                </Link>
                            )}
                        </div>
                    </div>
                    <Pomodoro/>
                </div>
            </div>
            }
        </div>
    )
}

export default Home