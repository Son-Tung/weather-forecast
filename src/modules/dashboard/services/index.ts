// Định nghĩa các hàm để call API tuỳ vào từng module làm việc
import { http } from '../../../common/services/BaseService'

const API_PATH = '' // Đường dẫn API muốn gọi

export const getAPI = async () => {
  return await http.get(`${API_PATH}`)
}

export const postAPI = async (body: any) => {
  return await http.post(`${API_PATH}`, body)
}
