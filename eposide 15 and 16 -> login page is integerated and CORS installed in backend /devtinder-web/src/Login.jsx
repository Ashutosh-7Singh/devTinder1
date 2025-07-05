import { useState } from "react";
import axios from "axios";
const Login = () => {
    const [emailId, setEmailId] = useState("trup@gmail.com");
    const [password, setPassword] = useState("Trup#1234");


    const handleLogin = () => {
        try {
            const res = axios.post("http://localhost:1212/login", {
                emailId, password,
            },{
                withCredentials:true
            }
        )
        } catch (error) {
            res.status(400).json({ sucess: false, Error: error.message })
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
                    <div className="card-actions justify-center">
                        <button className="btn" onClick={handleLogin}>Login</button>
                    </div>
                </div>
            </div></div>
    )
}

export default Login;