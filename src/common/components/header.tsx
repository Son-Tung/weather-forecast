import '../../assets/styles/global.scss'
import { Link } from 'react-router-dom'
import img from '../../assets/images/svg/IMG.jpg'

const Header: React.FC<{
  city: string
  setCity: React.Dispatch<React.SetStateAction<string>>
  getWeather: (city: string) => Promise<void>
}> = ({ city, setCity, getWeather }) => {
  return (
    <header>
      <div className='Font'>
        <h1 className='h1'>
          <img src={img} alt='Weather ' />
          Weather Forecast
        </h1>
        <nav>
          <div className='search-container'>
            <div className='input-wrapper'>
              <input type='text' placeholder='Search...' value={city} onChange={(e) => setCity(e.target.value)} />
              <button className='fas fa-search search-icon' onClick={() => getWeather(city)}></button>
            </div>
          </div>
          <ul>
            <li>
              <Link to='/'>Home</Link>
            </li>
            <li>
              <Link to='/map'>Map</Link>
            </li>
            <li>
              <Link to='/news'>Tin tức</Link>
            </li>
            <li>
              <Link to='/air-quality'>Không khí</Link>
            </li>
          </ul>
          <a className='menu-icon'>
            <i className='fas fa-bell bell-icon'></i>
          </a>
        </nav>
      </div>
    </header>
  )
}

export default Header
