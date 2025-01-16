## DEVTINDER API List


## authRouter
POST /signup
POST /login
POST /logout

//profile Router
GET /profile/view
PATCH /profile/edit
PATCH /profile/password


STATUS - interested , ignore , accepted , rejected


## ConnectionRequestRouter

//to send or ignore the suggest profile
POST /request/send/:status/:userId

//to accept or reject the obtained request to match
POST /request/review/:status/:requestId




## userRouter
// to get connections

GET /user/request/recieved
GET /user/connections
//to get some profiles to explore
GET /user/feed

