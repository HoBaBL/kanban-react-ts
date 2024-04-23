import { FC, useEffect, useState } from "react"
import style from "./account.module.css"
import { TbUserEdit } from "react-icons/tb";
import { MdOutlineEmail } from "react-icons/md";
import { IoMdPhonePortrait } from "react-icons/io";
import { CiLock } from "react-icons/ci";
import { MdOutlineAccountCircle } from "react-icons/md";
import AccountItem from "./accountItem";
import { IoExitOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

type AccountType = {
    supabase:any
}

const Account:FC<AccountType> = ({supabase}) => {
    
    // const [name, setName] = useState<any>()
    const [loading, setLoading] = useState(true)
    const [modalActive, setModalActive] = useState(false)
    const [password, setPassword] = useState('')
    const [inputChange, setInputChange] = useState(false)
    const [userData, setUserData] = useState<any>([
        {
            icon: <TbUserEdit size={16}/>,
            text: "Имя",
            userData:''
        },
        {
            icon: <MdOutlineEmail size={16}/>,
            text: "Email",
            userData:''
        },
        {
            icon: <IoMdPhonePortrait size={16}/>,
            text: "Телефон",
            userData:''
        },
    ])

    useEffect(() => {
        testName()
    },[])

    async function testName() {
        const { data, error } = await supabase.auth.getSession()
        if (error !== null) {
            console.log(error)
        }
        let copy =[...userData]
        copy[0].userData = data.session?.user.user_metadata.first_name
        copy[1].userData = data.session?.user.email
        copy[2].userData = data.session?.user.phone
        setUserData(copy)
        setLoading(false)
    }

    async function exitUser() {
        const { error } = await supabase.auth.signOut()
        if (error !== null) {
            console.log(error)
        }
    }

    return (
        <div className={style.account}>
            <h2 className={style.h2}><MdOutlineAccountCircle size={26}/> Мой профиль</h2>
            {loading ? <div>Загрузка</div> :
                <div className={style.main}>
                    <div className={style.exit}>
                        <Link to={`login`}>
                            <button onClick={() => exitUser()} className={style.exitText}>Выйти <IoExitOutline size={18}/></button>
                        </Link>
                    </div>
                    {userData.map((item:any)=> 
                        <AccountItem key={item.text} userData={userData} setUserData={setUserData} supabase={supabase} icon={item.icon} text={item.text} userDataItem={item.userData}/>    
                    )}
                    <div className={style.itemPosition}>
                        <p className={style.miniText}><CiLock size={16}/> Пароль</p>
                        <div className={style.itemFlex}>
                            <p className={style.text}>**************</p>
                            <button onClick={() => setModalActive(true)} className={style.btnItem}>Изменить</button>
                        </div>
                    </div>
                </div>
            }
            <div className={modalActive ? "modal active" : 'modal'} onClick={() => setModalActive(false)}>
                    <div className='ModalContent' onClick={e => e.stopPropagation()}>
                        <div>
                            <p>Изменить пароль</p>
                            <input type="text" value={password} onChange={e => setPassword(e.target.value)}/>
                        </div>
                        
                    </div>    
            </div> 


            
        </div>
    )
}

export default Account