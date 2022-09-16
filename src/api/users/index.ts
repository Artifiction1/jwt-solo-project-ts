import express from "express"
import { RequestHandler, Request} from "express"
import createError from "http-errors"
import { adminOnlyMiddleware } from "../../lib/auth/admin"
import usersModel from "./model"
import { UserDocument, UsersModel} from "./modelType"
import {JWTAuthMiddleware} from "../../lib/auth/token"
import {createAccessToken} from "../../lib/auth/tools"

const hostsRouter = express.Router()

interface UserRequest extends Request {
  user?: Partial<UserDocument>
}

hostsRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new usersModel(req.body)
    const { _id } = await newUser.save()
    const token = await createAccessToken({ _id: _id, role: req.body.role })
      res.send({ accessToken: token })
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

hostsRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const users = await usersModel.find()
    res.send(users)
  } catch (error) {
    next(error)
  }
})

hostsRouter.get("/me", JWTAuthMiddleware, async (req:UserRequest, res, next) => {
  try {
    if(req.user){
    const foundUser = await usersModel.findById(req.user._id)
    if (foundUser){
      delete foundUser['password']
    res.send(foundUser)}
    else{
      next(createError(401, " User doesn't exist"))
    }
  }} catch (error) {
    next(error)
  }
})


hostsRouter.get("/me/accomodations", JWTAuthMiddleware, adminOnlyMiddleware, async (req:UserRequest, res, next) => {
  try {
    if(req.user){
    const foundUser = await usersModel.findById(req.user._id).populate({ path: "accomodations", select: "name _id" })
    console.log(req.user._id)
    if (foundUser){
    res.send(foundUser)}
    else{
      next(createError(401, " User doesn't exist"))
    }}
  } catch (error) {
    next(error)
  }
})

hostsRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    console.log(req.body)
    const updatedUser = await usersModel.findByIdAndUpdate(req.body.user._id, req.body, { new: true, runValidators: true })
    if (updatedUser) {
      res.send(updatedUser)
    } else {
      next(createError(404, `User  not found!`))
    }
  } catch (error) {
    next(error)
  }
})

hostsRouter.delete("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    await usersModel.findByIdAndDelete(req.body.user._id)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

hostsRouter.get("/:userId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await usersModel.findById(req.params.userId)
    if (user) {
      delete user["password"]
      res.send({ currentRequestingUser: req.body.user, user })
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

hostsRouter.put("/:userId", JWTAuthMiddleware, adminOnlyMiddleware, async (req:UserRequest, res, next) => {
  try {
    const updatedUser = await usersModel.findByIdAndUpdate(req.params.userId, req.body, { new: true, runValidators: true })
    if (updatedUser) {
      res.send(updatedUser)
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

hostsRouter.delete("/:userId", JWTAuthMiddleware, adminOnlyMiddleware, async (req:UserRequest, res, next) => {
  try {
    const deletedUser = await usersModel.findByIdAndDelete(req.params.userId)
    if (deletedUser) {
      res.status(204).send(deletedUser._id)
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

hostsRouter.post("/login", async (req, res, next) => {
  try {
    // 1. Obtain credentials from req.body
    const { email, password } = req.body

    // 2. Verify credentials
    const user = await usersModel.checkCredentials(email, password)

    if (user) {
      // 3. If credentials are fine --> generate an access token (JWT) and send it back as a response
      const token = await createAccessToken({ _id: user._id, role: user.role })
      res.send({ accessToken: token })
    } else {
      // 4. If credentials are NOT ok --> throw an error (401)
      next(createError(401, "Credentials are not ok!"))
    }
  } catch (error) {
    next(error)
  }
})

export default hostsRouter
