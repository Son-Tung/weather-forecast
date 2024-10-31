import RainyImage from './LightRainV3.svg'
import CloudyImage from './MostlyCloudyDayV2.svg'
import SunnyImage from './MostlySunnyDay.svg'
import MistImage from './Haze.svg'

export const weatherImages: { [key: string]: string } = {
  clear: SunnyImage,
  rain: RainyImage,
  clouds: CloudyImage,
  mist: MistImage,
  haze: MistImage
}
