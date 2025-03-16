import Axios from "axios";

export const api = Axios.create({
  baseURL: process.env.BACKEND_URI!,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})
export const securedApi = (token?: string, type?: "blob") => {
  return Axios.create({
    baseURL: process.env.BACKEND_URI!,
    responseType: type,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
}