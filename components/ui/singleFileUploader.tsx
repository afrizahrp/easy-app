'use client';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { Skeleton } from '@/components/ui/skeleton';

import Image from 'next/image';

interface FileWithPreview extends File {
  preview: string;
}

interface SingleFileUploaderProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const SingleFileUploader: React.FC<SingleFileUploaderProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [file, setFile] = useState<string | null>(
    value.length > 0 ? value[0] : null
  );

  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (value.length > 0) {
      setUploadedUrl(value[0]);
    } else {
      setUploadedUrl(null);
    }
  }, [value]);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    onDrop: (acceptedFiles) => {
      setUploadedUrl(null);
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        )
      );
    },
  });

  const closeTheFile = () => {
    setFiles([]);
    setUploadedUrl(null);
    setFile(null);
  };

  function extractPublicIdFromCloudinaryUrl(arg0: { url: string }): string {
    const { url } = arg0;
    if (!url) return '';
    const publicId = url.split('/').pop()?.split('.')[0];
    return publicId || '';
  }

  const handleUpload = async () => {
    if (files[0].size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB');
      setFiles([]);
      setUploadedUrl(null);
      return;
    }

    setUploading(true);

    const company_id = 'BIP';
    const module_id = 'CMS';
    const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/${module_id}/upload`;

    const formData = new FormData();
    formData.append('files', files[0]); // Mengirim file pertama

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();
      const uploadedUrl = result.urls[0];
      const content_id = extractPublicIdFromCloudinaryUrl({ url: uploadedUrl });

      setUploadedUrl(result.urls[0]);
      setFile(content_id);

      if (result.urls && result.urls.length > 0) {
        setUploadedUrl(result.urls[0]);
        setFiles([]); // Pindahkan ke sini agar tidak menghapus preview sebelum upload selesai
        setFile(content_id);
        onChange(result.urls[0]);
      } else {
        throw new Error('Upload response is invalid');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('something went wrong');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (content_id: string) => {
    if (content_id) {
      console.log('Deleting file with content_id:', content_id);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/BIP/CMS/upload/cloudinary/delete?publicId=${content_id}`,
          { method: 'DELETE' }
        );
        setFiles([]);
        setUploadedUrl(null);
        setFile(null);
        onRemove(content_id);
        if (!response.ok) throw new Error('Delete failed');
        const result = await response.json();
        setUploadedUrl(null);
        onChange('');
        return result;
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  };

  console.log('uploadedUrl', uploadedUrl);

  return (
    <div
      className={
        files.length
          ? 'h-[300px] w-full flex flex-col items-center justify-center'
          : ''
      }
    >
      {uploading ? (
        // Menampilkan Skeleton Loader saat proses upload berlangsung
        <Skeleton className='w-full h-[300px] rounded-md' />
      ) : uploadedUrl ? (
        <div className='w-full h-full relative'>
          <Button
            type='button'
            className='absolute top-4 right-4 h-8 w-8 rounded-full bg-red-600 hover:bg-background hover:text-default-900 z-20'
            onClick={() =>
              handleDelete(
                extractPublicIdFromCloudinaryUrl({ url: uploadedUrl })
              )
            }
            disabled={uploading}
          >
            <span className='text-xl'>
              <Icon icon='fa6-solid:xmark' />
            </span>
          </Button>
          {uploadedUrl ? (
            <Image
              alt='Uploaded Image'
              className='w-full h-full object-cover rounded-md'
              src={uploadedUrl}
              width={400}
              height={300}
              onError={(e) => {
                e.currentTarget.src = '/fallback-image.png'; // Gambar default jika gagal
              }}
            />
          ) : null}
        </div>
      ) : files.length > 0 ? (
        <div className='w-full h-full relative'>
          <Button
            type='button'
            className='absolute top-4 right-4 h-8 w-8 rounded-full bg-red-600 hover:bg-background hover:text-default-900 z-20'
            onClick={closeTheFile}
            disabled={uploading}
          >
            <span className='text-xl'>
              <Icon icon='fa6-solid:xmark' />
            </span>
          </Button>
          <Image
            key={files[0].name}
            alt={files[0].name}
            className='w-full h-full object-contain rounded-md'
            src={files[0].preview}
            width={400}
            height={300}
          />
          <Button
            type='button'
            className='absolute bottom-4 right-4 h-8 w-8 rounded-full bg-blue-600 hover:bg-background hover:text-default-900 z-20'
            onClick={handleUpload}
            disabled={uploading}
          >
            <span className='text-md'>
              {uploading ? (
                'Uploading...'
              ) : (
                <Upload className='text-default-300' />
              )}
            </span>
          </Button>
        </div>
      ) : (
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <div className='w-full text-center bg-slate-200 border-dashed border rounded-md py-[52px] flex items-center flex-col mb-20'>
            <div className='h-12 w-12 inline-flex rounded-md bg-muted items-center justify-center mb-3'>
              <Upload className='text-default-500' />
            </div>
            <h4 className='text-2xl font-medium mb-1 text-card-foreground/80'>
              Drop files here or click to upload.
            </h4>
            <div className='text-xs text-muted-foreground'>
              You can upload an image with PNG or JPG files format with 5MB max
              size
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleFileUploader;
