import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import { HomePage } from "./pages/Home/HomePage";
import { LoginPage } from "./pages/Login/LoginPage";
import { SignupPage } from "./pages/Signup/SignupPage";
import { FeedPage } from "./pages/Feed/FeedPage";
import { SimpleNavBar} from './components/SimpleNavBar/SimpleNavBar';
import { NavBar} from './components/NavBar/NavBar';
import Profile from './pages/ProfilePage/Profile';
import {EditPage} from './pages/EditPage/EditPage';

// docs: https://reactrouter.com/en/main/start/overview
const router = createBrowserRouter([
  {
    path: "/",
    element: 
    <>
    <SimpleNavBar/>
    <HomePage/>,
    </>
  },
  {
    path: "/login",
    element: 
    <>
    <SimpleNavBar/>
    <LoginPage/>
    </>,
  },
  {
    path: "/signup",
    element:     <>
    <SimpleNavBar/>
    <SignupPage/>
    </>,
  },
  {
    path: "/posts", 
    element: 
    <>
    <SimpleNavBar/>
    <NavBar/>
    <FeedPage/> 
    </>
  },
  {
    path: "/profile", 
    element: 
    <>
    <SimpleNavBar/>
    <NavBar/>
    <Profile/> 
    </>
  },
  {
    path: "/edit/:id", 
    element: 
    <>
    <NavBar/>
    <EditPage/> 
    </>
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
