import axios from 'axios'

const endpointUrl = '' // Định nghĩa đường dẫn để call API

const http = axios.create({
  baseURL: endpointUrl,
  headers: {
    "Content-Type": 'application/json'
  }
})

export { http }
