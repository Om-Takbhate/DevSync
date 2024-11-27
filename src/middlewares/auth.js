const adminAuth = (req,res,next)=>{
    const token = "xyz"
    const isAdminAuthorized = token === "xyz"
    if(!isAdminAuthorized) {
        res.status(401).send('Unauthorized access!')
    }
    else {
        next()
    }
}

const userAuth = (req,res,next)=>{
    const token = "users"
    const isUserAuthorized = token === "users"
    if(!isUserAuthorized) {
        res.send("User is not authorized")
    }
    else {
        next()
    }
}


module.exports = {
    adminAuth,
    userAuth
}