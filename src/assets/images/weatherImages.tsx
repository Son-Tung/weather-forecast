import RainyImage from '../images/Rain.png'
import CloudyImage from '../images/Cloudy.png'
import SunnyImage from '../images/Sunny.png'
import MistImage from '../images/Mist.png'
import SnowImage from '../images/Snowdy.png'

export const weatherImages: { [key: string]: string } = {
  clear: SunnyImage,
  rain: RainyImage,
  clouds: CloudyImage,
  mist: MistImage,
  haze: MistImage,
  snow: SnowImage
}
