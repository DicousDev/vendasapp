import Axios, { AxiosInstance } from "axios"

export const httpClient: AxiosInstance = Axios.create({
  baseURL: "http://localhost:8080/",
  headers: {
    accept: "application/json",
    "content-type": "application/json" 
  }
})
