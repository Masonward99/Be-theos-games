import {  seed } from "./seed"
import { devData } from "../data/developement-data/dev-data"
import db from "../../db"
function runSeed( ){
    return seed(devData)
    .then(()=> db.end())
}
runSeed()