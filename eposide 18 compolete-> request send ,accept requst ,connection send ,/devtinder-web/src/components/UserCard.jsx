import React from 'react'

const UserCard = (user) => {
    const {firstName,lastName,photoUrl,skills,age,gender,about}= user.user
    console.log(user);
    
  return (
   <div className="card bg-base-300 w-96 shadow-sm">
  <figure>
    <img
      src={user?.user?.photoUrl} 
      alt="Photo" />
  </figure>
  <div className="card-body">
    <h2 className="card-title">{firstName + " " + lastName}</h2>
  {age && gender &&   <p>{age + ", " + gender}</p>}
   {about &&  <p>{about}</p>}
    <div className="card-actions justify-center my-4">

      <button className="btn btn-primary">Ignore</button>
      <button className="btn btn-secondary">Interested</button>
    </div>
  </div>
</div>
  )
}

export default UserCard