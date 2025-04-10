'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export default function ProductGallery({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState(0)

  // التحقق من أن الصور موجودة وغير فارغة
  const validImages = images?.filter((image) => !!image) || []

  // التأكد من أن selectedImage ضمن النطاق الصحيح
  useEffect(() => {
    if (validImages.length > 0 && selectedImage >= validImages.length) {
      setSelectedImage(0)
    }
  }, [validImages.length, selectedImage])

  if (validImages.length === 0) {
    return (
      <div className='flex items-center justify-center w-full h-[500px] bg-gray-100 rounded-lg'>
        <p className='text-gray-500'>No images available</p>
      </div>
    )
  }

  return (
    <div className='flex gap-2'>
      {validImages.length > 1 && (
        <div className='flex flex-col gap-2 mt-8'>
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              onMouseOver={() => setSelectedImage(index)}
              className={`bg-white rounded-lg overflow-hidden ${
                selectedImage === index
                  ? 'ring-2 ring-blue-500'
                  : 'ring-1 ring-gray-300'
              }`}
            >
              <Image
                src={image}
                alt={`product thumbnail ${index + 1}`}
                width={48}
                height={48}
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </button>
          ))}
        </div>
      )}

      <div className='w-full'>
        <Zoom>
          <div className='relative h-[500px]'>
            <Image
              src={validImages[selectedImage]}
              alt={`product image ${selectedImage + 1}`}
              fill
              sizes='90vw'
              className='object-contain'
              priority
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
        </Zoom>
      </div>
    </div>
  )
}
