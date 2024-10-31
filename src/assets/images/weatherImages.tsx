import RainyImage from '../images/rain.svg'
import CloudyImage from '../images/cloud.svg'
import SunnyImage from '../images/sunny.svg'
import MistImage from '../images/Haze.svg'

export const weatherImages: { [key: string]: string } = {
  clear: SunnyImage,
  rain: RainyImage,
  clouds: CloudyImage,
  mist: MistImage,
  haze: MistImage
}
