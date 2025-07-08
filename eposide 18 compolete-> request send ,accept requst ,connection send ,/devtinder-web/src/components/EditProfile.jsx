import React, { useEffect, useState } from 'react'
import UserCard from "./UserCard"
import axios from "axios"
import { BASE_URL } from "../utils/constants.js"
import { useDispatch } from 'react-redux'
import { addUser } from '../utils/userSlice';

const EditProfile = (user) => {
    const [firstName, setFirstName] = useState(user?.user?.firstName);
    const [lastName, setLastName] = useState(user?.user?.lastName);
    const [age, setAge] = useState(user?.user?.age);
    const [gender, setGender] = useState(user?.user?.gender);
    const [about, setAbout] = useState(user?.user?.about);
    const [skills, setSkills] = useState(user?.user?.skills)
    const [photoUrl, setPhotoUrl] = useState(user?.user?.photoUrl);
    const dispatch = useDispatch();
    const [error, setError] = useState("")
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("")

    const saveProfile = async () => {
        // clear error 
        setError("");
        setShowToast(false);
        setToastMessage(" ")
        try {
            const res = await axios.put(BASE_URL + "/profile/edit", {
                firstName, lastName, photoUrl, skills, age, gender, about
            },
                { withCredentials: true }
            );
            dispatch(addUser(res?.data?.data));
            setToastMessage(res?.data?.message);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 3000)

        } catch (error) {
            setError(error?.response?.data)
        }
    }
    return (
        <>
            <div className='  flex justify-center my-10 '>
                <div className=" flex justify-center gap-6 my-10 ">
                    <div className="card bg-base-300 text-primary-content w-96">
                        <div className="card-body ">
                            <h2 className="card-title flex justify-center">Edit Profile</h2>
                            <div>
                                {/* <fieldset className="fieldset"> */}
                                <legend className="fieldset-legend">First Name</legend>
                                <input type="text"
                                    value={firstName}
                                    className="input" placeholder="Enter First Name"
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                <legend className="fieldset-legend">LastName</legend>
                                <input type="text"
                                    value={lastName}
                                    className="input" placeholder="Enter Last Name"
                                    onChange={(e) => setLastName(e.target.value)}
                                /> <legend className="fieldset-legend">Age</legend>
                                <input type="number"
                                    value={age}
                                    className="input" placeholder="Enter Age"
                                    onChange={(e) => setAge(e.target.value)}
                                />
                                <legend className="fieldset-legend">Gender</legend>
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="select"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="others">Others</option>
                                </select>

                                {/* <fieldset className="fieldset"> */}
                                    <legend className="fieldset-legend">About</legend>
                                    <textarea
                                        value={about}
                                        onChange={(e) => setAbout(e.target
                                            .value
                                        )}
                                        className="textarea h-24" placeholder="About"></textarea>
                                {/* </fieldset> */}
                                <legend className="fieldset-legend">Photo URL</legend>
                                <input type="text"
                                    value={photoUrl}
                                    className="input" placeholder="Enter About"
                                    onChange={(e) => setPhotoUrl(e.target.value)}
                                />
                                <legend className="fieldset-legend">Skill's </legend>
                                <input type="text"
                                    value={skills}
                                    className="input" placeholder="Enter About"
                                    onChange={(e) => setSkills(e.target.value)}
                                />
                                {/* </fieldset> */}
                            </div>
                            <p className="text-red-500">{error}</p>
                            <div className="card-actions justify-center">
                                <button className="btn" onClick={saveProfile}>Save Profile</button>
                            </div>
                        </div>
                    </div>
                    <UserCard user={{ firstName, lastName, photoUrl, skills, age, gender, about }} />

                </div>
            </div>
            {showToast && (
                <div className="toast toast-top toast-end">
                    <div className="alert alert-success">
                        <span>{toastMessage || "Profile updated successfully"}</span>
                    </div>
                </div>

            )}
        </>



    )
}

export default EditProfile