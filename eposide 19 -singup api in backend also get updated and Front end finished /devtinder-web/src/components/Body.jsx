import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./NavBar.jsx";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants.js"
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice"
import { useEffect } from "react";
const Body = () => {
    const navigate = useNavigate()
    const distach = useDispatch();
    const userData = useSelector((store) => store.user);
    const fetchUser = async () => {
        if(userData) return;
        try {
            const res = await axios.get(BASE_URL + "/profile/view", {
                withCredentials: true,
            })
            distach(addUser(res.data))
        } catch (error) {
            if (error.status === 401) {
                navigate("/login")
            }
            console.error("Login failed:", error.message);
        }

    }

    useEffect(() => {
        // if (!userData) {
            fetchUser();
        // }
    }, [])
    return (
        <div>
            <NavBar />
            <Outlet />
            <Footer />
        </div>
    )
}

export default Body; 