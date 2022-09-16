import mongoose from "mongoose"
import bcrypt from "bcrypt"
import { UserDocument, UsersModel } from "./modelType"

const { Schema, model } = mongoose

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique:true},
    password: { type: String, required: true },
    role: { type: String, enum: ["guest", "host"], default: "guest" },
    accomodations : [{ type: Schema.Types.ObjectId, ref: "Accomodations" }],
  },
  {
    timestamps: true,
  }
)

UserSchema.pre("save", async function (next) {


  const currentUser = this

  const plainPW = this.password

  if (currentUser.isModified("password")) {


    const hash = await bcrypt.hash(plainPW, 11)
    currentUser.password = hash
  }

  next()
})

UserSchema.methods.toJSON = function () {


  const userDocument = this
  const user = userDocument.toObject()

  delete user.password
  delete user.__v
  return user
}

UserSchema.static("checkCredentials", async function (email, plainPassword) {

  const user = await this.findOne({ email })

  if (user) {
    console.log("USER: ", user)
    const isMatch = await bcrypt.compare(plainPassword, user.password)

    if (isMatch) {

      return user
    } else {
      return null
    }
  } else {
    return null
  }
})

export default model<UserDocument, UsersModel>("User", UserSchema)
