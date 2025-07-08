import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addRequests, removeRequest } from "../utils/requestSlice"

const Requests = () => {
  const requests = useSelector((store) => store.requests)
  const dispatch = useDispatch();
  const reviewRequest = async (status, _id) => {

    try {
      const res = await axios.post(BASE_URL + "/request/review/" + status + "/" + _id,{},{
        withCredentials:true
      })
      dispatch(removeRequest(_id))
    } catch (error) {

    }
  }


  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + '/user/requests/recieved', {
        withCredentials: true,
      })
      dispatch(addRequests(res?.data?.data))
      console.log("request", res?.data?.data)
    } catch (error) {

    }
  }
  useEffect(() => {
    fetchRequests();
  }, [])



  if (!requests) return;
  if (requests.length === 0) return <h1 className='flex justify-center'>No requests found</h1>
  return (
    <div className='text-center  my-10'>
      <h1 className='text-bold text-4xl text-white'>Connection Requests</h1>
      {requests.map((request) => {
        const { _id, firstName, lastName, photoUrl, age, gender, about, skills } = request.fromUserId

        return (
          <div
            key={_id}
            className=' flex  m-4 p-4 justify-between text-center rounded-lg bg-base-300 w-2/3 mx-auto'>
            <div>
              <img alt='photo' className="w-20 h-20 rounded-full" src={photoUrl} />

            </div>
            <div className='text-left mx-4'>
              <h2 className='font-bold text-4xl'>{firstName + " " + lastName}</h2>
              {age && gender && <p>{age + " " + gender}</p>}
              <p>{about}</p>
            </div>

            <div>
              <button className="btn btn-primary mx-2" onClick={()=>reviewRequest(("rejected",request._id))}>Reject</button>
              <button className="btn btn-secondary mx-2" onClick={()=>reviewRequest("accepted",request._id)}>Accept</button>
            </div>
          </div>
        )
      }
      )}
    </div>

  )
}

export default Requests