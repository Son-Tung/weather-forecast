import RainyImage from './svg/LightRainV3.svg'
import CloudyImage from './svg/MostlyCloudyDayV2.svg'
import SunnyImage from './svg/MostlySunnyDay.svg'
import FogImage from './svg/Haze.svg'

export const weatherImages: { [key: string]: string } = {
  clear: SunnyImage,
  clouds: CloudyImage,
  rain: RainyImage,
  fog: FogImage
}
