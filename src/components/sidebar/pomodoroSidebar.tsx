import { useSelector } from "react-redux";
import { RootState } from '../../redux/store';
import { useRef, useState, useEffect } from 'react'
import { CircularProgressbar } from "react-circular-progressbar";
import style from './sidebar.module.css'
import { CiPlay1, CiPause1 } from "react-icons/ci";
import { useAppDispatch } from '../../hooks';
import { setTimeH, setTimeM, setTimeS, setPaused, setOver, setCheck} from '../../redux/slice/pomodoro';
import { RxCross2 } from "react-icons/rx";


const PomodoroSidebar = () => {
    let hours = 0
    const h = useSelector((state: RootState) => state.h.h)
    const m = useSelector((state: RootState) => state.m.m)
    const s = useSelector((state: RootState) => state.s.s)
    const paused = useSelector((state: RootState) => state.paused.paused)
    const over = useSelector((state: RootState) => state.over.over)
    const minutes:any = useRef(+localStorage.getItem('workTime')!)
    const check = useSelector((state: RootState) => state.check.check)
    
    let seconds = 0
    const dispatch = useAppDispatch()
    const [timeValue, setTimeValue] = useState<any>()

    // useEffect(() => {
    //     dispatch(setCheck(localStorage.getItem('check')))
    // },[])
    
    useEffect(() => {
        if (over) {
            minutes.current = +localStorage.getItem('restTime')!
        } else if (!over) {
            minutes.current = +localStorage.getItem('workTime')!
        }
        let timeVot = m * 60 + s
        const timeValue = (timeVot * 100) / (minutes.current * 60 + seconds)
        setTimeValue(timeValue)
    })

    const tick = () => {
        if (paused) return;
        if (h === 0 && m === 0 && s === 0) {
            dispatch(setOver(!over))
            if (!over) {
                minutes.current = localStorage.getItem('restTime')!
            } else if (over) {
                minutes.current = localStorage.getItem('workTime')!
            }
            dispatch(setOver(!over))
            dispatch(setTimeH(hours))
            dispatch(setTimeM(minutes.current))
            dispatch(setTimeS(seconds))
        } else if (m === 0 && s === 0) {
            dispatch(setTimeH(h-1))
            dispatch(setTimeM(59))
            dispatch(setTimeS(59))
        } else if (s == 0) {
            dispatch(setTimeH(h))
            dispatch(setTimeM(m-1))
            dispatch(setTimeS(59))
            
        } else {
            dispatch(setTimeH(h))
            dispatch(setTimeM(m))
            dispatch(setTimeS(s-1))
        }
        
      };

    
    
    useEffect(() => {
        const timerID = setInterval(() => tick(), 1000);
        sessionStorage.setItem('sec', s);
        sessionStorage.setItem('min', m);
        sessionStorage.setItem('hrs', h);
        return () => clearInterval(timerID);
    })

   

    return (
        <div className={check ? style.sidebarCirclePosition : style.sidebarNone}>
            <div className={style.crossPosition}>
                <button onClick={() => {dispatch(setCheck(false));localStorage.setItem('check', 'false')}} className={style.crossBtn}>
                    <RxCross2 className={style.cross}/>
                </button>
            </div>
            
            <div className={style.circlePosition}>
                <div className={style.timerPosition}>
                    {over ? 
                    <div className={style.flexTimer}>
                        <p className={style.timerOver}>Отдых</p>
                        <p className={style.timerP}>{`${m
                            .toString()
                            .padStart(2, '0')}:${s.toString().padStart(2, '0')}`}
                        </p>
                    </div>
                    : 
                    <div className={style.flexTimer}>
                        <p className={style.timerOver}>Работа</p>
                        <p className={style.timerP}>{`${m
                            .toString()
                            .padStart(2, '0')}:${s.toString().padStart(2, '0')}`}
                        </p>
                    </div>
                    }
                    {/* {over ? <button className={style.timerBtn} onClick={() => reset()}><GrPowerReset size={40}/></button> : */}
                        <button className={style.timerBtn} onClick={() => dispatch(setPaused(!paused))}>
                            {paused ? <CiPlay1 size={22} color="white"/> : <CiPause1 size={22} color="white"/>}
                        </button>
                    {/* } */}
                    
                </div>
            </div>
            <div style={{width:"160px"}}>
                {over ? 
                    <CircularProgressbar 
                    value={timeValue}
                    circleRatio={1}
                    strokeWidth={8}
                    styles={{ root:{transform:'rotate(0turn)',stroke: 'black',strokeLinecap: 'round',borderRadius:"50%"},
                    path:{stroke:"red", strokeLinecap: "round"},
                    text:{transform:"translate(-20%, 5%)", stroke:"none"}}}
                    />
                    :
                    <CircularProgressbar 
                        value={timeValue}
                        circleRatio={1}
                        strokeWidth={8}
                        styles={{ root:{transform:'rotate(0turn)',stroke: 'black',strokeLinecap: 'round',borderRadius:"50%"},
                        path:{stroke:"#0066CC", strokeLinecap: "round"},
                        text:{transform:"translate(-20%, 5%)", stroke:"none"}}}
                    />
                }
            </div>

        </div>
        
    )
}

export default PomodoroSidebar