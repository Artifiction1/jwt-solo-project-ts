import express from "express"
import listEndpoints from "express-list-endpoints"
import mongoose from "mongoose"
import cors from "cors"
import hostsRouter from "./api/users/index"
import { forbiddenErrorHandler, genericErroHandler, notFoundErrorHandler, unauthorizedErrorHandler } from "./errorHandlers"
import accomodationsRouter from "./api/accomodations/index"

const server = express()
const port = process.env.PORT || 3001

server.use(cors())
server.use(express.json())

server.use("/host", hostsRouter)
server.use("/accomodations", accomodationsRouter)


server.use(forbiddenErrorHandler)
server.use(notFoundErrorHandler)
server.use(genericErroHandler)

mongoose.connect("mongodb+srv://Artifiction:Engelis1@cluster0.uuya6.mongodb.net/test")

mongoose.connection.on("connected", () => {
  console.log("Mongo Connected!")
  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server is listening on port ${port}`)
  })
})
