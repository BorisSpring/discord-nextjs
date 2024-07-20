import InitialModal from '@/components/modals/InitialModal';
import { initialProfile } from '@/lib/initial-profile';
import { redirect } from 'next/navigation';
import React from 'react';
import prisma from '@/lib/prisma';

const SetupPage = async () => {
  const profile = await initialProfile();

  const server = await prisma.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return server ? redirect(`/servers/${server.id}`) : <InitialModal />;
};

export default SetupPage;
