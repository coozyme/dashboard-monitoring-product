import axios from "axios"
import { BaseURL } from "../../../config/config"

export const GetIssueCategory = async () => {
   await axios.get(`${BaseURL}/categories/issues`).then((res) => {
      console.log("LOG-GetIssueCategory", res.data)
      return res.data
   }).catch((err) => {
      console.log("LOG-ERROR-GetIssueCategory: ", err)
   })
}