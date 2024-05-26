import { FC, useEffect, useState } from "react"
import style from './auth.module.css'
import { Link, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { useForm, SubmitHandler } from "react-hook-form"
import { useAppDispatch } from '../../hooks';
import {setUserId} from "../../redux/slice/UserId";


type Inputs = {
    email: string
    pasword: string,
}

const Login: FC = () => {
    const supabase = createClient("https://ynelcdqjjejcylduvmjy.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluZWxjZHFqamVqY3lsZHV2bWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc0ODE0NjcsImV4cCI6MjAyMzA1NzQ2N30.nvBnJPg5HG57sSU2JGLeQIi2zBbbInRnar2qWTIUhKc");
    const { register, handleSubmit} = useForm<Inputs>()
    const [loading, setLoading] = useState(false)
    const dispatch = useAppDispatch()
    const onSubmit: SubmitHandler<Inputs> = (dataForm) => {
        dispatch(setUserId(dataForm))
        login(dataForm)
        // DataRef.current = dataForm
    }

    async function login(dataForm:any) {
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: dataForm.email,
            password: dataForm.pasword,
        })
        console.log(data)
        console.log(error)
        setLoading(true)
    }

    const navigate = useNavigate();

    useEffect(() => {
        if (loading) {
            navigate("/home")
        }
    },[loading])
    
    return (
        <div className={style.backgroundFon}>
            <div className={style.windowPosition}>
                <div className={style.eximple}>
                    <p>Можете создать свой аккаунт или воспользоваться примером</p>
                    <p>Электронная почта: eximple@gmail.com</p>
                    <p>Пароль: eximple</p>
                    <p>Приложение находится в разработке, по-этому пока не работают вкладки "Уведомления", "Аккаунт", "Главная"</p>
                    <p>Можете добавлять свои записи или проекты. Всё переносится на сервер</p>
                </div>
                <div className={style.window}>
                    <h3 className={style.authH3}>Выполните вход</h3>
                    <div className={style.inputPosition}>
                        <div>
                            <form onSubmit={handleSubmit(onSubmit)} className={style.formLogin}>
                                <input className={style.input} {...register("email")} type="text" placeholder="Ваша электронная почта"/>
                                <input className={style.input} {...register("pasword")} type="password" placeholder="Ваш пароль"/>
                                    <input className={style.btnLogin} type="submit" value={'Вход'}/>
                            </form>
                            <div className={style.textFotter}>
                                Нет учетной записи? 
                                <Link to={`/registration`}>
                                    <button>Зарегистрируйтесь</button>
                                </Link>
                                
                            </div>
                    
                        </div>
                    </div>
                    
                </div>
            </div>

        </div>
        
        
    )
}

export default Login