import style from './App.module.css';
import Sidebar from './components/sidebar/sidebar';
import Main from './components/main/main';
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect} from "react"
import { useAppDispatch } from './hooks';
import {setUserId} from "./redux/slice/UserId";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from './redux/store';


const supabase = createClient("https://ynelcdqjjejcylduvmjy.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluZWxjZHFqamVqY3lsZHV2bWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc0ODE0NjcsImV4cCI6MjAyMzA1NzQ2N30.nvBnJPg5HG57sSU2JGLeQIi2zBbbInRnar2qWTIUhKc");

function App() {
  const [AllTask, setAllTask] = useState<any>([])
  const dispatch = useAppDispatch()
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true)
  const UserId = useSelector((state: RootState) => state.UserId.UserId)

  useEffect(() => {
    test()
  },[])

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


  useEffect(() => {
  // getData();
  UpsertData()
  }, [AllTask]);

  async function UpsertData() {
  if (!loading) {
      const { error } = await supabase
      .from('boba')
      .update({
          todo_data : AllTask[0].todo_data
      })
      .eq('id', UserId)
      if (error !== null) {
          console.log(error)
      }
  }
  }

  return (
    <div className={style.App}>
      <Sidebar AllTask={AllTask} setAllTask={setAllTask} supabase={supabase} loading={loading}/>
      <Main AllTask={AllTask} setAllTask={setAllTask} supabase={supabase} loading={loading}/>
    </div>
  );
}

export default App;
