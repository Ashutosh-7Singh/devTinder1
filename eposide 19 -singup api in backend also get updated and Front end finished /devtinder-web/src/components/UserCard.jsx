import React from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { removeUserFromFeed } from '../utils/feedSlice';

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoUrl, skills, age, gender, about } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status) => {
    try {
      const res = await axios.post(`${BASE_URL}/request/send/${status}/${_id}`, {}, {
        withCredentials: true
      });
      dispatch(removeUserFromFeed(_id)); 
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  return (
    <div className="card bg-base-300 w-96 shadow-sm">
      <figure>
        <img src={photoUrl} alt="User" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName} {lastName}</h2>
        {age && gender && <p>{age}, {gender}</p>}
        {about && <p>{about}</p>}
        <div className="card-actions justify-center my-4">
          <button className="btn btn-primary" onClick={() => handleSendRequest("ignored")}>Ignore</button>
          <button className="btn btn-secondary" onClick={() => handleSendRequest("interested")}>Interested</button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;





// import React from 'react'
// import axios from "axios";
// import {BASE_URL} from "../utils/constants"
// import {useDispatch} from "react-redux"
// import { removeUserFromFeed } from '../utils/feedSlice';

// const UserCard = (user) => {
//     const {_id,firstName,lastName,photoUrl,skills,age,gender,about}= user
//     console.log("user",user);
//     const dispatch = useDispatch();
// const handleSendRequest= async (status,userId)=>{
//   try{
//     const res= await axios.post(BASE_URL + "request/send/" + status + "/" + userId,{},{
//       withCredentials:true
//     } );
//     dispatch(removeUserFromFeed(userId));
//   }catch(error){

//   }
// }

//   return (
//    <div className="card bg-base-300 w-96 shadow-sm">
//   <figure>
//     <img
//       src={user?.photoUrl} 
//       alt="Photo" />
//   </figure>
//   <div className="card-body">
//     <h2 className="card-title">{firstName + " " + lastName}</h2>
//   {age && gender &&   <p>{age + ", " + gender}</p>}
//    {about &&  <p>{about}</p>}
//     <div className="card-actions justify-center my-4">

//       <button className="btn btn-primary" onClick={()=>handleSendRequest("ignored",_id)}>Ignore</button>
//       <button className="btn btn-secondary" onClick={()=>handleSendRequest("interested",_id)}>Interested</button>
//     </div>
//   </div>
// </div>
//   )
// }

// export default UserCard