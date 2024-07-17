import ServerSidebar from '@/components/server/ServerSidebar';
import { currentProfle } from '@/lib/utils/current-profile';
import { redirect } from 'next/navigation';
import React from 'react';

interface Props {
  children: React.ReactNode;
  params: {
    serverId: string;
  };
}

const SingleServerLayout = async ({ children, params }: Props) => {
  const profile = await currentProfle();

  if (!profile) return redirect('/sign-in');
  return (
    <div className='h-full'>
      <div className='hidden md:flex h-full w-60  fixed z-20 flex-col inset-y-0'>
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className='h-full md:pl-60'>{children}</main>
    </div>
  );
};

export default SingleServerLayout;
