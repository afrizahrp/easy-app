'use client';

import { FileImage } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface ImageCollectionProps {
  disabled?: boolean;
  value: string[];
  height?: number;
  width?: number;
}

const ImageCollection: React.FC<ImageCollectionProps> = ({
  disabled,
  value,
  height,
  width,
}) => {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const openZoomedImage = (imageUrl: string) => {
    setZoomedImage(imageUrl);
  };
  // Function to close zoomed image
  const closeZoomedImage = () => {
    setZoomedImage(null);
  };

  return (
    <div>
      <div className='mb-4 flex items-center gap-4 flex-wrap'>
        {value.length > 0 ? (
          value.map((imageURL: string) => (
            <div
              key={imageURL}
              className='relative w-[300px] h-[300px] rounded-md justify-center items-center bg-gray-100 border border-gray-200 cursor-zoom-in'
              onClick={() => openZoomedImage(imageURL)}
            >
              <Image
                fill
                className='object-contain'
                objectPosition='center'
                alt='Image'
                src={imageURL}
                height={height}
                width={width}
              />
            </div>
          ))
        ) : (
          <div className='text-center'>
            <FileImage className='w-32 h-32 text-slate-200' size='lg' />
            <div className='text-slate-400 text-sm mt-2'>
              No image available
            </div>
          </div>
        )}
      </div>

      {zoomedImage && (
        <div className='zoomed-image-container' onClick={closeZoomedImage}>
          <Image
            src={zoomedImage}
            alt='zoomed-image'
            layout='fill'
            objectFit='contain'
          />
        </div>
      )}
    </div>
  );
};

export default ImageCollection;
