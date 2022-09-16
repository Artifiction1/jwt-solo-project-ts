import { verifyAccessToken } from "./tools.js"
import createHttpError from "http-errors"
import AccomodationsModel from "../../api/accomodations/model.js"

export const correctUser = async (req, res, next) =>{
    if (!req.headers.authorization) {
        next(createHttpError(401, "Please provide credentials in Authorization header!"))
      } else {
        const token = req.headers.authorization.replace("Bearer ", "")
        const payload = await verifyAccessToken(token)
        req.user = {
          _id: payload._id,
        }
        const accomodations = await AccomodationsModel.findById(req.params.accomId)
        console.log(req.user._id)
        console.log(accomodations.host)
      if (req.user._id.toString() === accomodations.host.toString()) {
        next()
      } else {
        next(createHttpError(403, "wrong user!"))
      }
    }
}