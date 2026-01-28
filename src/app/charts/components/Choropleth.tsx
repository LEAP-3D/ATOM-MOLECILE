'use client'

import { ResponsiveChoropleth } from '@nivo/geo'
import { feature } from 'topojson-client'
import world from 'world-atlas/countries-110m.json'

// TypeScript-д алдаа гарахаас сэргийлэх
const worldFeatures: any = feature(
  world as any,
  (world as any).objects.countries
)

const features = worldFeatures.features

const data = [
  { id: 'USA', value: 331002651 },
  { id: 'CHN', value: 1444216107 },
  { id: 'RUS', value: 145912025 },
  { id: 'MNG', value: 3347782 },
]

const MyChoropleth = () => (
  <div
    className="
      w-full max-w-[350px]
      rounded-2xl
      bg-white/5
      backdrop-blur-xl
      border border-white/10
      p-5
      shadow-lg
    "
    style={{ height: 300 }} // card-д тааруулах өндөр
  >
    <ResponsiveChoropleth
      data={data}
      features={features}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      colors="nivo"
      domain={[0, 1500000000]}
      unknownColor="#eeeb15"
      label="properties.name"
      valueFormat=".2s"
      enableGraticule={true}
      graticuleLineColor="#dddddd"
      borderWidth={0.5}
      borderColor="#152538"
    />
  </div>
)

export default MyChoropleth
