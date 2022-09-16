import mongoose from "mongoose"

const { Schema, model } = mongoose

const AccomodationsSchema = new Schema(
  {
    name: { type: String, required: true },
    host: [{ type: Schema.Types.ObjectId, ref: "User" }],
    description: { type: String, required: true},
    maxGuest: { type: Number, required: true },
    city: { type: String,required:true},
  },
  {
    timestamps: true,
  }
)

export default model("Accomodations", AccomodationsSchema)