import express, { request } from "express"
import createError from "http-errors"
import { hostOnlyMiddleware } from "../../lib/auth/hostAdmin"
import AccomodationsModel from "./model"
import {JWTAuthMiddleware} from "../../lib/auth/token"
import usersModel from "../../api/users/model"
import { correctUser } from "../../lib/auth/correctUser"
import { AccomDocument } from "./modelType"
import { Request } from "express"

const accomodationsRouter = express.Router()

interface AccomRequest extends Request {
  accom? :Partial<AccomDocument>
}

accomodationsRouter.post("/", JWTAuthMiddleware, hostOnlyMiddleware, async (req:AccomRequest, res, next) => {
  try {
    const newAccom = new AccomodationsModel(req.body)
    const { _id } = await newAccom.save()
    const foundUser = await usersModel.findById(newAccom.host)
    if(foundUser){
    //foundUser.accomodations.push(_id)
    console.log(foundUser)
    foundUser.save()
    res.status(201).send({ _id })}
  } catch (error) {
    next(error)
  }
})

accomodationsRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const accoms = await AccomodationsModel.find().populate({ path: "host", select: "email _id" })
    res.send(accoms)
  } catch (error) {
    next(error)
  }
})




accomodationsRouter.get("/:accomId", JWTAuthMiddleware, async (req:AccomRequest, res, next) => {
  try {
    const accom = await AccomodationsModel.findById(req.params.accomId).populate({ path: "User", select: "name _id" })
    if (accom) {
      res.send({ currentRequestingAccom: req.accom, accom })
    } else {
      next(createError(404, `Accomodation with id ${req.params.accomId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

accomodationsRouter.put("/:accomId", hostOnlyMiddleware, correctUser, async (req, res, next) => {
  try {

    const updatedAccom = await AccomodationsModel.findByIdAndUpdate(req.params.accomId, req.body, { new: true, runValidators: true })
    if (updatedAccom) {
      res.send(updatedAccom)
    } else {
      next(createError(404, `Accomodation with id ${req.params.accomId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

accomodationsRouter.delete("/:accomId", hostOnlyMiddleware, correctUser, async (req, res, next) => {
  try {
    const deletedAccom = await AccomodationsModel.findByIdAndDelete(req.params.accomId)
    if (deletedAccom) {
      res.status(204).send()
    } else {
      next(createError(404, `Accomodation with id ${req.params.accomId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default accomodationsRouter
