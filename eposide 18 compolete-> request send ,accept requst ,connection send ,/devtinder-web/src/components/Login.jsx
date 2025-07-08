import { useState } from "react";
import axios from "axios";
import { useDispatch } from 'react-redux'
import { addUser } from "../utils/userSlice";
import {useNavigate} from "react-router-dom"
import { BASE_URL } from "../utils/constants.js";
const Login = () => {
    const [emailId, setEmailId] = useState("trup@gmail.com");
    const [password, setPassword] = useState("Trup#1234");
    const [error,setError]=useState("")
    const navigate=useNavigate();

    const dispatch = useDispatch()

    const handleLogin = async () => {
        try {
            const res = await axios.post(
                BASE_URL + "/login",
                {
                    emailId,
                    password,
                },
                {
                    withCredentials: true
                }
            );
            console.log(res.data);
            dispatch(addUser(res.data))
            navigate("/")
        } catch (error) {
            setError(error?.response?.data || "Something went wrong")
            console.error(error?.response?.data || "Something went wrong")
            // res.status(400).json({ sucess: false, Error: error.message })
        }
    }
    return (
        <div className=" flex justify-center my-10">
            <div className="card bg-base-300 text-primary-content w-96">
                <div className="card-body ">
                    <h2 className="card-title flex justify-center">Login</h2>
                    <div>
                        {/* <fieldset className="fieldset"> */}
                        <legend className="fieldset-legend">Email ID</legend>
                        <input type="text"
                            value={emailId}
                            className="input" placeholder="Enter Email ID"
                            onChange={(e) => setEmailId(e.target.value)}
                        />
                        <legend className="fieldset-legend">Password</legend>
                        <input type="text"
                            value={password}
                            className="input" placeholder="Enter Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {/* </fieldset> */}
                    </div>
                    <p className="text-red-500">{error}</p>
                    <div className="card-actions justify-center">
                        <button className="btn" onClick={handleLogin}>Login</button>
                    </div>
                </div>
            </div></div>
    )
}

export default Login;