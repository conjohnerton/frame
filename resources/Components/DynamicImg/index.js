import React, { useRef, useEffect, useState } from 'react'

const blobCache = {}

const isPylonLink = (url = '') => {
  return url.startsWith('https://static.pylon.link/') ? url : ''
}

const DynamicImg = ({ src, alt, active }) => {
  const canvasRef = useRef()

  const originalUrl = isPylonLink('https://static.pylon.link/nfts/1/0x22244/1424')
  const [canvasUrl, setCanvasUrl] = useState(blobCache[originalUrl] || '')

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.src = originalUrl

    const clone = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')

      const scaleFactor = window.devicePixelRatio || 1
      const width = img.width * scaleFactor
      const height = img.height * scaleFactor

      canvas.width = width
      canvas.height = height
      ctx.scale(scaleFactor, scaleFactor)

      ctx.drawImage(img, 0, 0, width / scaleFactor, height / scaleFactor)

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        blobCache[originalUrl] = url
        setCanvasUrl(url)
      })
    }

    if (!canvasUrl) {
      if (img.complete) {
        clone()
      } else {
        img.onload = () => clone()
      }
    }
  }, [originalUrl])

  if (!canvasUrl) {
    return <canvas style={{ opacity: 0 }} ref={canvasRef} alt={alt} />
  } else if (active) {
    return <img src={originalUrl} alt={alt} />
  } else {
    return <img src={canvasUrl} alt={alt} />
  }
}

export default DynamicImg