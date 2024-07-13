import { joinServer } from '@/lib/actions/server.action';

interface Props {
  params: {
    inviteCode: string;
  };
}

const page = async ({ params }: Props) => {
  return await joinServer({ inviteCode: params?.inviteCode });
};

export default page;
