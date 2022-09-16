import createHttpError from "http-errors"
import {UserDocument} from "../../api/users/modelType"

interface UserRequest extends Request {
  user?: Partial<UserDocument>
}

export const adminOnlyMiddleware = (req:UserRequest, res, next) => {
  if(req.user){
  if (req.user.role === "host") {
    next()
  } else {
    next(createHttpError(403, "Host Only Endpoint!"))
  }
}}
