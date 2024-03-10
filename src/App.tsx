import style from './App.module.css';
import Sidebar from './components/sidebar/sidebar';
import Main from './components/main/main';
import { createClient } from "@supabase/supabase-js";
import { useEffect } from 'react';


function App() {

  return (
    <div className={style.App}>
      <Sidebar/>
      <Main/>
    </div>
  );
}

export default App;
