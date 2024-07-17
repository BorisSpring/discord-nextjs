'use client';
import { UploadDropzone } from '@/lib/utils/uploadthing';
import { FileIcon, X } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

interface Props {
  onChange: (url?: string) => void;
  value: string;
  endpoint: 'messageFile' | 'serverImage';
}

const FileUpload = ({ endpoint, value, onChange }: Props) => {
  if (value && value?.endsWith('.pdf')) {
    return (
      <div className='relative flex items-center justify-center w-fit m-auto p-2 mt-2 rounded-md bg-background/10'>
        <FileIcon className='size-10 fill-indigo-200 stroke-indigo-400 ' />
        <a
          href={value}
          target='_blank'
          rel='noopener noreferrer'
          className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'
        >
          {value}
        </a>
        <button
          type='button'
          onClick={() => onChange('')}
          className='bg-rose-500 text-white size-6 flex items-center justify-center rounded-full absolute -top-2 -right-2 shadow-sm'
        >
          <X className='size-4' />
        </button>
      </div>
    );
  } else if (value) {
    return (
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
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res: any) => onChange(res?.[0].url)}
      onUploadError={(err: Error) => {
        console.error(err);
      }}
    />
  );
};

export default FileUpload;
