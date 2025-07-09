import { useState } from "react";
import axios from "axios";
import { useDispatch } from 'react-redux'
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom"
import { BASE_URL } from "../utils/constants.js";
const Login = () => {
    const [emailId, setEmailId] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastname] = useState("");
    const [isLoginForm, setIsLoginForm] = useState(true);
    const [error, setError] = useState("")
    const navigate = useNavigate();

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

    const handleSignUp = async () => {
        try {
           const res= await axios.post(BASE_URL + "/signup", { firstName, lastName, emailId, password }, { withCredentials: true })

            dispatch(addUser(res?.data?.data))
            return navigate("/profile");
        } catch (errror) {

        }
    }
    return (
        <div className=" flex justify-center my-10">
            <div className="card bg-base-300 text-primary-content w-96">
                <div className="card-body ">
                    <h2 className="card-title flex justify-center">{isLoginForm ? "Login" : "SignUp"}</h2>
                    <div>
                        {/* <fieldset className="fieldset"> */}
                        {!isLoginForm &&
                            <>
                                <legend className="fieldset-legend">First Name </legend>
                                <input type="text"
                                    value={firstName}
                                    className="input" placeholder="Enter First Name"
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                <legend className="fieldset-legend">
                                    Last Name </legend>
                                <input type="text"
                                    value={lastName}
                                    className="input" placeholder="Enter Last Name"
                                    onChange={(e) => setLastname(e.target.value)}
                                />
                            </>
                        }

                        <legend className="fieldset-legend">Email ID</legend>
                        <input type="email"
                            value={emailId}
                            className="input" placeholder="Enter Email ID"
                            onChange={(e) => setEmailId(e.target.value)}
                        />
                        <legend className="fieldset-legend">Password</legend>
                        <input type="password"
                            value={password}
                            className="input" placeholder="Enter Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {/* </fieldset> */}
                    </div>
                    <p className="text-red-500">{error}</p>
                    <div className="card-actions justify-center">
                        <button className="btn" onClick={isLoginForm ? handleLogin : handleSignUp}>{isLoginForm ? "Login" : "Sign Up"}</button>
                    </div>
                    <p className="m-auto cursor-pointer "
                        onClick={() => setIsLoginForm((value) => !value)}
                    >{isLoginForm ? "New User? Signup here" : "Existing User ? Login Here"}</p>
                </div>
            </div></div>
    )
}

export default Login;