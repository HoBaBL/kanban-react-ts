import { FC, useState, useEffect } from "react";
import style from './home.module.css'
import { useAppDispatch } from '../../hooks';
import { useNavigate } from "react-router-dom";
import {setUserId} from "../../redux/slice/UserId";
import { useSelector } from "react-redux";
import { RootState } from '../../redux/store';
import { Link } from "react-router-dom";
import { LuClipboardList } from "react-icons/lu";
import { BsClipboard2Check } from "react-icons/bs";
import Pomodoro from "../pomodoro/pomodoro";

type HomeType ={
    supabase:any, 
}

const Home:FC<HomeType> = ({supabase}) => {
    const [AllTask, setAllTask] = useState<any>([])
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    // const loading:any = useSelector((state: RootState) => state.loading.loading)
    const [loading, setLoading] = useState(true)
    const changes = useSelector((state: RootState) => state.changes.changes)

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


    return (
        <div className={style.home}>
            <h2>Главная</h2>
            {loading ? <p>Загрузка</p> :
            <div>
                <div className={style.boardFlex}>
                    <h2 className={style.boardFlexH2}>Активные проекты</h2>
                    {AllTask[0] !== undefined && AllTask[0].todo_data.Baza.map((board:any) => 
                        <Link to={`/baza/${AllTask[0].todo_data.Baza.indexOf(board)}`} key={board.title} className={style.board}>
                            <h3 className={style.h3}><LuClipboardList size={22}/> {board.title}</h3>
                            {/* <p>Активные задачи {board.Arrey.length}</p> */}
                            <p className={style.p}><BsClipboard2Check size={18}/> Завершено задач {board.completed.length}</p>
                        </Link>
                    )}
                    
                </div>
                <Pomodoro/>
            </div>
                
            }
            
        </div>
    )
}

export default Home