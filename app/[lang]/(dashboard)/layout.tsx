import DashBoardLayoutProvider from '@/provider/dashboard.layout.provider';

import { getSession } from '@/lib/session';

import { redirect } from 'next/navigation';

const layout = async ({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: any };
}) => {
  const session = await getSession();

  // console.log('session:', session);

  if (!session?.user?.name) {
    redirect('/auth/login');
  }

  return <DashBoardLayoutProvider>{children}</DashBoardLayoutProvider>;
};

export default layout;
