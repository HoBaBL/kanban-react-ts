import { FC, useEffect, useRef, useState } from 'react'
import style from './pomodoro.module.css'
import { CircularProgressbar } from "react-circular-progressbar";
import { CiPlay1, CiPause1 } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { GrPowerReset } from "react-icons/gr";
import { useAppDispatch } from '../../hooks';
import { useSelector } from "react-redux";
import { RootState } from '../../redux/store';
import { setTimeH, setTimeM, setTimeS, setPaused, setOver, setCheck} from '../../redux/slice/pomodoro';
import { FaCheck } from "react-icons/fa";

const Pomodoro:FC = () => {
    let hours = 0
    const dispatch = useAppDispatch()
    const h = useSelector((state: RootState) => state.h.h)
    const m = useSelector((state: RootState) => state.m.m)
    const s = useSelector((state: RootState) => state.s.s)
    const paused = useSelector((state: RootState) => state.paused.paused)
    const over = useSelector((state: RootState) => state.over.over)
    const minutes:any = useRef(localStorage.getItem('workTime')!)
    const check = useSelector((state: RootState) => state.check.check)
    let seconds = 0
    const [modalActive, setModalActive] = useState(false)
    const [timeWork, setTimeWork] = useState(localStorage.getItem('workTime')!)
    const [timeRest, setTimeRest] = useState(localStorage.getItem('restTime')!)
  
    const tick = () => {
      if (over) {
        minutes.current = +localStorage.getItem('restTime')!
      } else if (!over) {
        minutes.current = +localStorage.getItem('workTime')!
      }
    };

    const [timeValue, setTimeValue] = useState<any>()
    
    useEffect(() => {
        let timeVot = m * 60 + s
        const timeValue = (timeVot * 100) / (minutes.current * 60 + seconds)
        setTimeValue(timeValue)
    })
  
    useEffect(() => {
      tick()
    },[over]);

    function savePomodoro() {
        minutes.current = timeWork
        setModalActive(false)
        localStorage.setItem('workTime', timeWork);
        localStorage.setItem('restTime',timeRest);
        dispatch(setTimeH(hours))
        dispatch(setTimeM(timeWork))
        dispatch(setTimeS(seconds))
        reset()
    }

    const reset = () => {
        dispatch(setTimeH(hours))
        dispatch(setTimeM(minutes.current))
        dispatch(setTimeS(seconds))
        dispatch(setPaused(false))
        dispatch(setOver(false))
    };
        
    return (
      <div className={style.pomodoro}>
        <h2 className={style.h2}>Pomodoro</h2>
        <div style={{width:"250px"}}>
            {over ? 
                <CircularProgressbar 
                value={timeValue}
                circleRatio={1}
                strokeWidth={8}
                styles={{ root:{transform:'rotate(0turn)',stroke: '#d6d6d6',strokeLinecap: 'round',borderRadius:"50%"},
                path:{stroke:"red", strokeLinecap: "round"},
                text:{transform:"translate(-20%, 5%)", stroke:"none"}}}
                />
                :
                <CircularProgressbar 
                    value={timeValue}
                    circleRatio={1}
                    strokeWidth={8}
                    styles={{ root:{transform:'rotate(0turn)',stroke: '#d6d6d6',strokeLinecap: 'round',borderRadius:"50%"},
                    path:{stroke:"#0066CC", strokeLinecap: "round"},
                    text:{transform:"translate(-20%, 5%)", stroke:"none"}}}
                />
            }
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
                        {paused ? <CiPlay1 size={40}/> : <CiPause1 size={40}/>}
                    </button>
                {/* } */}
                
            </div>
        </div>
        <div className={style.resetPosition}>
            <button onClick={() => setModalActive(true)} className={style.resetBtn}><IoSettingsOutline size={30}/></button>
        </div>
        <div className={modalActive ? "modal active" : 'modal'} onClick={() => setModalActive(false)}>
            <div className='ModalContent' onClick={e => e.stopPropagation()}>
                <div className={style.pomodoroModal}>
                    <h3>Настройки Pomodoro</h3>
                    <div className={style.positionNum}>
                        <p>Время работы</p>
                        <input className={style.inputNum} type="number" min={1} max={60} onChange={e => setTimeWork(e.target.value)} value={timeWork}/>
                        <p>Время отдыха</p>
                        <input className={style.inputNum} type="number" min={1} max={60} onChange={e => setTimeRest(e.target.value)} value={timeRest}/>
                        <div className={style.checkFlex}>
                            <div onClick={() => {dispatch(setCheck(!check))}} className={style.check}>{check ? <FaCheck size={12} color='#0066CC'/> : ''}</div>
                            <p className={style.checkText}>Показывать Pomodoro в меню</p>
                        </div>
                    </div>
                    <button onClick={() => savePomodoro()} className={style.savePomodoro}>Сохранить</button>
                </div>
            </div>    
        </div> 
      </div>
    );
}

export default Pomodoro