create git repo
push code on github

///////////////////////////////////////////

next parameter in route handler
middleware implementation
app.use

differernce between app.use()  and  app.all()


write a dummy auth middleware for admin
write a dummy auth middleware for user except for login
handling error using middlewares => app.use

/////////////////////////////

create a free cluster
get connection string
add the cluster on mongodb compass
install mongoose

call mongoose.connect function and connect to db before starting our server listening the requests
connect to db using connection string and after successful connection to mongodb make app listen on your defined port



/////////////////////
create schema of user and use similar fields of user like name,emial,pass and etc , model of user

create post /signup api to save the data of user in mongodb
make api call to post /api to save data in db



//////
difference between json and js object
implement express.json middleware , send the data from body of req from postman
make signup api dynamic to recieve data from the end user or client

find which document does Model.findOne() returns the first found one or the last one  or any random

create a api to get the user - GET /user
create a api to get the all users - GET /feed
use function = findById()
difference between put and patch HTTP method




/////////////////////////
- Explor scheme type options from the document
- add required , unique , lowercase , validate , minLength , maxLength , min,max ,  trim : true , get,set,default
- Add timestamps on schema for createdAt and udpatedAt in document automatiocallly



////////////
- add api levep validation on PATCH and POST request api
- data sanitizing - Add api validation for each field

////////
- create passwordHash using bcrypt.hash function & save the user's password as hashedpassword
- create login api that takes emailId and password , check if user is present in DB with given emailId or not , if yes then compare the given password while logging in with the hash value stored in dB for original password
- if both got matched send login success , else invalid credentials


- after successfull login , create jwt token send it to client by wrapping it inside the cookies ,=> res.cookie() emthod .
- implement userAuth middleware , that checks whether the cookies  sent to server in req are valid , is jwt token present in this or not , if present , verify cookie using the jwt.verify method

- use userAuth middleware function in /profile and /sendConnectionRequest
- set the expiry date of token and cookie of 7 days