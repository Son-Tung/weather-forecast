import RainyImage from '../images/svg/rain.svg'
import CloudyImage from '../images/svg/cloud.svg'
import SunnyImage from '../images/svg/sunny.svg'
import MistImage from '../images/svg/Haze.svg'

export const weatherImages: { [key: string]: string } = {
  clear: SunnyImage,
  rain: RainyImage,
  clouds: CloudyImage,
  mist: MistImage,
  haze: MistImage
}
