import { Outlet } from "react-router-dom";
import NavBar from "./NabBar";
import Footer from "./Footer";

const Body = ()=>{
    return (
        <div>
            <NavBar/>
            <Outlet/>
            <Footer/>
        </div>
    )
}

export default Body ; 