import RainyImage from './svg/LightRainV3.svg'
import CloudyImage from './svg/MostlyCloudyDayV2.svg'
import SunnyImage from './svg/MostlySunnyDay.svg'
import MistImage from './svg/Haze.svg'

export const weatherImages: { [key: string]: string } = {
  clear: SunnyImage,
  rain: RainyImage,
  clouds: CloudyImage,
  mist: MistImage,
  haze: MistImage
}
