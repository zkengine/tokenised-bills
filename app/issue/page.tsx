'use client';

import CreateInvoice from '@/components/part/issue';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

export default function IssuePage() {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();
  if (ready && !authenticated) {
    router.push('/');
  }

  return (
    <section className='h-[calc(100%-6rem)] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:absolute sm:w-[90%] [&::-webkit-scrollbar]:hidden'>
      <CreateInvoice />
    </section>
  );
}
