import style from "./account.module.css"
import { FC, useState } from "react"
import { useAppDispatch } from '../../hooks';
import { setUserName } from "../../redux/slice/userName";
import { FaCheck } from "react-icons/fa6";

type AccountItemType = {
    icon:string,
    text:string,
    userDataItem:any,
    supabase:any,
    setUserData:any,
    userData:any
}


const AccountItem:FC<AccountItemType> = ({icon, text, userDataItem, supabase, setUserData, userData}) => {
    const [inputChange, setInputChange] = useState(false)
    const [user, setUser] = useState(userDataItem)
    const dispatch = useAppDispatch()
    
    async function update() {
        if (text === "Имя") {
            const { data, error } = await supabase.auth.updateUser({
                data: { first_name: user }
            })
            if (error !== null) {
                console.log(error)
            }
            const copy =[...userData]
            copy[0].userData = user
            setUserData(copy)
            dispatch(setUserName(user))
        } else if (text === "Email") {
            const { data, error } = await supabase.auth.updateUser({
                email: user
            })
            if (error !== null) {
                console.log(error)
            }
            const copy =[...userData]
            copy[1].userData = user
            setUserData(copy)
        }
        else if (text === "Телефон") {
            const copy =[...userData]
            copy[2].userData = user
            setUserData(copy)
        }

        setInputChange(false)
    }

    return (
        <div className={style.itemPosition}>
            <p className={style.miniText}>{icon} {text}</p>
            <div className={style.itemFlex}>
                {inputChange ? 
                    <>
                        <input value={user} onChange={e => setUser(e.target.value)} type="text" className={style.inputItem}/>
                        <button onClick={() =>  update()}><FaCheck /></button>
                    </>
                    : 
                    <p className={style.text}>{userDataItem === "" ? "Не указано":userDataItem}</p>}
                <button onClick={() => setInputChange(!inputChange)} className={style.btnItem}>Изменить</button>
            </div>
        </div>
    )
}

export default AccountItem