import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux'
import { store } from './redux/store';
import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './components/auth/login';
import Registration from './components/auth/registration';
import { createClient } from "@supabase/supabase-js";
import Home from './components/home/home';
import Sidebar from './components/sidebar/sidebar';
import Account from './components/account/account';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const supabase = createClient("https://ynelcdqjjejcylduvmjy.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluZWxjZHFqamVqY3lsZHV2bWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc0ODE0NjcsImV4cCI6MjAyMzA1NzQ2N30.nvBnJPg5HG57sSU2JGLeQIi2zBbbInRnar2qWTIUhKc");

const router = createHashRouter([
  {
    path: "/",
    element: <Sidebar supabase={supabase} />,
    children: [
      {
        path:"baza/:id",
        element: <App/>
      },
      {
        path: "home",
        element: <Home supabase={supabase}/>
      },
      {
        path:"account",
        element: <Account supabase={supabase}/>
      }
    ]
  },
  {
    path: "login",
    element: <Login/>,
  },
  {
    path: "registration",
    element: <Registration/>,
  },
]);



root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
