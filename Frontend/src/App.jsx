import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import HomePage from "./Pages/HomePage";
import SettingsPage from "./Pages/SettingsPage";
import LoginPage from "./Pages/LoginPage";
import SignUpPage from "./Pages/SignUpPage";
import ProfilePage from "./Pages/ProfilePage";
import { useAuthStore } from "./Stores/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import {Toaster} from "react-hot-toast";
import { useThemesStore } from "./Stores/useThemesStore";


const App = () => {

  const {userAuth,checkAuth,isCheckingAuth,onlineUsers} = useAuthStore();
  const {theme} = useThemesStore();
  
  useEffect(()=>{
    checkAuth();
  },[checkAuth]);
 
  console.log("Data of online users:-",onlineUsers);

  if(isCheckingAuth && !userAuth){
    return(
     <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin"/>
     </div>
    );
  };

  return (
    <div data-theme={theme}>
      <Navbar/>
      <Routes>
          <Route path="/" element={userAuth ? <HomePage/> : <Navigate to= '/login'/>}/>
          <Route path="/signup" element={!userAuth ? <SignUpPage/> : <Navigate to="/"/>}/>
          <Route path="/login" element={!userAuth ? <LoginPage/> : <Navigate to="/"/>}/>
          <Route path="/settings" element={<SettingsPage/>}/>
          <Route path="/profile" element={userAuth ? <ProfilePage/> : <Navigate to= '/login'/>}/>
      </Routes>

      <Toaster/>
    </div>
  );
};

export default App;
