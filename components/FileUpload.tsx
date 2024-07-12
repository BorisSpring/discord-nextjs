'use client';
import { UploadDropzone } from '@/lib/utils/uploadthing';
import { X } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

interface Props {
  onChange: (url?: string) => void;
  value: string;
  endpoint: 'messageFile' | 'serverImage';
}

const FileUpload = ({ endpoint, value, onChange }: Props) => {
  return (
    <div>
      {!value?.endsWith('.pdf') && value && (
        <div className='relative size-[80px] m-auto my-4'>
          <Image
            fill
            src={value}
            alt='Upload Image'
            className='rounded-full size-[80px]'
          />
          <button
            type='button'
            onClick={() => onChange('')}
            className='bg-rose-500 text-white size-6 flex items-center justify-center rounded-full absolute right-0 top-0 shadow-sm'
          >
            <X className='size-4' />
          </button>
        </div>
      )}
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res: any) => onChange(res?.[0].url)}
        onUploadError={(err: Error) => {
          console.error(err);
        }}
      />
    </div>
  );
};

export default FileUpload;
