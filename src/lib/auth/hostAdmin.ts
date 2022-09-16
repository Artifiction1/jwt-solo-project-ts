import createHttpError from "http-errors"
import atob from "atob"
import UsersModel from "../../api/users/model.js"
import { verifyAccessToken } from "./tools.js"

export const hostOnlyMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(createHttpError(401, "Please provide credentials in Authorization header!"))
  } else {
    const token = req.headers.authorization.replace("Bearer ", "")
    const payload = await verifyAccessToken(token)
    req.user = {
      _id: payload._id,
      role: payload.role,
    }
  if (req.user.role === "host") {
    next()
  } else {
    next(createHttpError(403, "Host Only Endpoint!"))
  }
}
}
/*export const basicAuthMiddleware = async (req, res, next) => {

  if (!req.headers.authorization) {
    next(createHttpError(401, "Please provide credentials in Authorization header!"))
  } else {
    console.log(req.headers.authorization)
    const base64Credentials = req.headers.authorization.split(" ")[1] 
    const decodedCredentials = atob(base64Credentials) 
    const [email, password] = decodedCredentials.split(":")
    console.log("Email:",email, "  ", "password:", password)

    
    const user = await UsersModel.checkCredentials(email, password)

    if (user.role === "Admin") {
      
      req.user = user
      next()
    } else {

      next(createHttpError(401, "only for admin!"))
    }
  }
}*/
