            ## authRouter
            POST /signup
            POST /login
            POST /logout

            ## profileRputer
            GET /profile/view
            PATCH /profile/edit
            PATHC /profile/password

            ## connectionRequestRouter
            POST /request/send/intrested/:userId
            POST /request/send/ignored/:userId
            POST /request/review/accepted/:requestedID
            POST /request/review/rejected/:rejectedID

            ##  userRouter
            GET /connections
            GET /user/requests/recieved
            GET /feed - Gets you the profiles of others users on platform


            Status:ignore,intrested,accepted,rejected