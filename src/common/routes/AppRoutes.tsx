// Định nghĩa đường dẫn của toàn bộ Application
import { Route, Routes } from 'react-router-dom'
import { APP_PATH } from '../configs/enum'
import PageNotFound from '../pages/PageNotFound'
import Dashboard from '../../modules/dashboard/pages/Dashboard'
import MainScreen from '../layouts/MainScreen'

const publicRoutes = (
  <Routes>
    <Route element={<MainScreen />}>
      <Route path={APP_PATH.INDEX} element={<Dashboard />} />
      <Route path='*' element={<PageNotFound />} />
    </Route>
  </Routes>
)

export const AppRoutes = () => {
  return publicRoutes
}
