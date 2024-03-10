import { FC, useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js";
import { useForm, SubmitHandler } from "react-hook-form"
import { useAppDispatch } from '../../hooks';
import {setUserId} from "../../redux/slice/UserId";
import style from './auth.module.css'
import { Link, useNavigate } from "react-router-dom";

type Inputs = {
    email: string
    pasword: string,
    name:string
  }

const Registration: FC = () => {
    const dispatch = useAppDispatch()
    const supabase = createClient("https://ynelcdqjjejcylduvmjy.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluZWxjZHFqamVqY3lsZHV2bWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc0ODE0NjcsImV4cCI6MjAyMzA1NzQ2N30.nvBnJPg5HG57sSU2JGLeQIi2zBbbInRnar2qWTIUhKc");
    const { register, handleSubmit} = useForm<Inputs>()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const onSubmit: SubmitHandler<Inputs> = (dataForm) => {
        registration(dataForm)
        // Proverka()
        console.log('dataForm', dataForm)
    }

    async function registration(dataForm:Inputs) {
        const { data, error } = await supabase.auth.signUp(
            {
            email: dataForm.email,
            password: dataForm.pasword,
            options: {
                data: {
                first_name: dataForm.name,
                }
            }
            }
        )
        AddData(data.user?.id)
        console.log(data.user?.id)
        setLoading(true)
    }
    

    const sample = {
        Baza: [
            {
                title: "Первый проект",
                Arrey: [
                    {
                        id: 1,
                        title: "Неразобранное",
                        color: "",
                        items: []
                    },
                    {
                        id: 2,
                        title: "В работе",
                        color: "",
                        items: []
                    },
                    {
                        id: 3,
                        title: "Готово",
                        color: "",
                        items: []
                    }
                ]
            }
        ]
    }

    async function AddData(user:any) {
        const { error } = await supabase
        .from('boba')
        .insert({ id: user, todo_data: sample})
        .select()
    }

    useEffect(() => {
        if (loading) {
            navigate("/")
        }
    },[loading])
    
    return (
        <div className={style.windowPosition}>
            <div className={style.window}>
                <h3 className={style.authH3}>Выполните вход</h3>
                <div className={style.inputPosition}>
                    <div>
                        <form onSubmit={handleSubmit(onSubmit)} className={style.formLogin}>
                            <input className={style.input} {...register("email")} type="text" placeholder="Ваша электронная почта"/>
                            <input className={style.input} {...register("pasword")} type="text" placeholder="Ваш пароль"/>
                            <input className={style.input} {...register("name")} type="text" placeholder="Ваше имя"/>
                                <input className={style.btnLogin} type="submit" value={'Регистрация'}/>
                        </form>
                        <div className={style.textFotter}>
                            У вас есть учетная запись? 
                            <Link to={`/login`}>
                                <button>Выполните вход</button>
                            </Link>
                            
                        </div>
                
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default Registration