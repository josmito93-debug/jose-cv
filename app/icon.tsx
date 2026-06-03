import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: '20px',
          background: '#0e131f',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#2ddc80',
          fontWeight: 900,
          fontFamily: 'sans-serif',
        }}
      >
        U
      </div>
    ),
    {
      ...size,
    }
  )
}
