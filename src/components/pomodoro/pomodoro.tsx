import { FC, useEffect, useRef, useState } from 'react'
import style from './pomodoro.module.css'
import { CircularProgressbar } from "react-circular-progressbar";
import { CiPlay1, CiPause1 } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { GrPowerReset } from "react-icons/gr";

const Pomodoro:FC = () => {
    let hours = 0
    // const [minutes, setMinutes] = useState<any>(1)
    // let minutes = 1
    const minutes:any = useRef(1)
    let seconds = 0
    const [paused, setPaused] = useState(true);
    const [over, setOver] = useState(false);
    const [[h, m, s], setTime] = useState([hours, minutes.current, seconds]);
    const [modalActive, setModalActive] = useState(false)
    const [timeWork, setTimeWork] = useState('1')
    const [timeRest, setTimeRest] = useState('1')
  
    const tick = () => {
      if (paused) return;
      if (h === 0 && m === 0 && s === 0) {
        setOver(!over);
        minutes.current = timeRest
        setTime([hours, minutes.current, seconds]);
      } else if (m === 0 && s === 0) {
        setTime([h - 1, 59, 59]);
      } else if (s == 0) {
        setTime([h, m - 1, 59]);
      } else {
        setTime([h, m, s - 1]);
      }
    };
  
    const reset = () => {
      setTime([hours, minutes.current, seconds]);
      setPaused(false);
      setOver(false);
    };
  
    useEffect(() => {
      const timerID = setInterval(() => tick(), 1000);
      return () => clearInterval(timerID);
    });
    let timeVot = m * 60 + s
    const timeValue = (timeVot * 100) / (minutes.current * 60 + seconds)

    function savePomodoro() {
        minutes.current = timeWork
        setModalActive(false)
        setTime([hours, minutes.current, seconds]);
    }
        
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
                    <button className={style.timerBtn} onClick={() => setPaused(!paused)}>
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
                    </div>
                    <button onClick={() => savePomodoro()} className={style.savePomodoro}>Сохранить</button>
                </div>
                
            </div>    
        </div> 
      </div>
    );
}

export default Pomodoro