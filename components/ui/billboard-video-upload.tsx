'use client';

import { CldUploadWidget } from 'next-cloudinary';
// import { CldVideoPlayer } from 'next-cloudinary';
import { Video } from 'cloudinary-react';
// import { CldVideoPlayer } from 'next-cloudinary';
import { useEffect, useState } from 'react';
// mtzlseemkuydulx0wbn0

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { PlayCircleIcon, Trash } from 'lucide-react';

interface BillboardVideoUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const BillboardVideoUpload: React.FC<BillboardVideoUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className='mb-4 flex items-center gap-4'>
        {value.map((url) => (
          <div key={url} className='relative w-full h-auto rounded-md'>
            <div className='z-10 absolute top-2 right-2'>
              <Button
                type='button'
                onClick={() => onRemove(url)}
                variant='soft'
                color='destructive'
                size='sm'
              >
                <Trash className='h-4 w-4' />
              </Button>
            </div>
            {/* <Image fill className='object-cover' alt='video' src={url} /> */}
            {/* <CldVideoPlayer src={url} width='auto' controls autoPlay /> */}

            <Video
              cloudName='biwebapp-live'
              objectFit='cover'
              publicId={url}
              width='100%'
              height='auto'
              crop='scale'
              controls
              autoPlay
              loop
            />
          </div>
        ))}
      </div>
      <CldUploadWidget
        onUpload={onUpload}
        options={{
          sources: ['local', 'google_drive', 'url'],
          resourceType: 'video',
          multiple: false,
          clientAllowedFormats: ['mp4', 'webm', 'ogg'],
        }}
        // signatureEndpoint='/api/cms/billboardURLS'

        // signatureEndpoint={
        //   process.env.NEXT_PUBLIC_CLOUDINARY_SIGNATURE_ENDPOINT
        // }
        uploadPreset='uploadBiwebapp'
      >
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button
              type='button'
              disabled={disabled}
              variant='outline'
              onClick={onClick}
            >
              <PlayCircleIcon className='h-4 w-4 mr-2' />
              Upload Video
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default BillboardVideoUpload;
