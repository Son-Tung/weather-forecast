import RainyImage from '../../assets/images/Rain.png'
import CloudyImage from '../../assets/images/Cloudy.png'
import SunnyImage from '../../assets/images/Sunny.png'
import MistImage from '../../assets/images/Mist.png'
import SnowImage from '../../assets/images/Snowdy.png'
import SmokeImage from '../../assets/images/mist_detail.png'

export const weatherImages: { [key: string]: string } = {
  clear: SunnyImage,
  rain: RainyImage,
  clouds: CloudyImage,
  mist: MistImage,
  haze: MistImage,
  smoke: SmokeImage, 
  snow: SnowImage
}