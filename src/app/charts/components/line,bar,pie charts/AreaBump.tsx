'use client'

import { ResponsiveAreaBump } from '@nivo/bump'

const data = [
  {
    id: "JavaScript",
    data: [
      { x: 2000, y: 23 },
      { x: 2001, y: 20 },
      { x: 2002, y: 28 },
      { x: 2003, y: 14 },
      { x: 2004, y: 25 },
      { x: 2005, y: 12 },
    ]
  },
  {
    id: "ReasonML",
    data: [
      { x: 2000, y: 27 },
      { x: 2001, y: 18 },
      { x: 2002, y: 28 },
      { x: 2003, y: 30 },
      { x: 2004, y: 30 },
      { x: 2005, y: 23 },
    ]
  },
  {
    id: "TypeScript",
    data: [
      { x: 2000, y: 30 },
      { x: 2001, y: 10 },
      { x: 2002, y: 29 },
      { x: 2003, y: 19 },
      { x: 2004, y: 18 },
      { x: 2005, y: 22 },
    ]
  },
  {
    id: "Elm",
    data: [
      { x: 2000, y: 27 },
      { x: 2001, y: 11 },
      { x: 2002, y: 24 },
      { x: 2003, y: 24 },
      { x: 2004, y: 29 },
      { x: 2005, y: 27 },
    ]
  },
  {
    id: "CoffeeScript",
    data: [
      { x: 2000, y: 16 },
      { x: 2001, y: 17 },
      { x: 2002, y: 26 },
      { x: 2003, y: 21 },
      { x: 2004, y: 27 },
      { x: 2005, y: 17 },
    ]
  }
]

const MyAreaBump = () => (
  <div style={{ height: 400, width: '500px' }}>
    <ResponsiveAreaBump 
      data={data}
      margin={{ top: 40, right: 100, bottom: 40, left: 100 }}
      blendMode="multiply"
      colors={{ scheme: 'nivo' }}
    />
  </div>
)

export default MyAreaBump
