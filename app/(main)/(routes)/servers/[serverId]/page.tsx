import { findGeneralChannel } from '@/lib/actions/server.action';

interface Props {
  params: {
    serverId: string;
  };
}

const SingleServerPage = async ({ params }: Props) => {
  return await findGeneralChannel({ serverId: params.serverId });
};

export default SingleServerPage;
