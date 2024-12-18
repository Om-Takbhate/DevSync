#DEVTINDER API List

POST /signup
POST /login
POST /logout

GET /profile/view
PATCH /profile/edit
PATCH /profile/password


STATUS - interested , ignore , accepted , rejected


//to send or ignore the suggest profile

POST /request/send/interested/:userId
POST /request/send/ignore/:userId



//to accept or reject the obtained request to match

POST /request/review/accept/:requestId
POST /request/review/reject/:requestId



// to get connections

GET /request/recieved
GET /connections


//to get some profiles to explore

GET /feed