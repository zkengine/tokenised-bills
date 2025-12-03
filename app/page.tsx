'use client';

import Invest from '@/components/part/invest';
import Payables from '@/components/part/payables';
import Receivables from '@/components/part/receivables';
import { Container } from '@mui/material';
import classNames from 'classnames';
import { useState } from 'react';

type Tab = 'payables' | 'receivables' | 'funding pools';
const tabs = ['payables', 'receivables', 'funding pools'];

// Programmable Accounts Receivable Tokenisation
const PART = () => {
  const [selectedTab, setSelectedTab] = useState<Tab>('payables');

  const handleTabClick = (tab: Tab) => {
    setSelectedTab(tab);
  };

  return (
    <>
      <nav className='z-10'>
        <div className='flex justify-center'>
          <div className='bg-secondary flex h-9.25 w-full justify-between rounded-[10px] px-2'>
            {tabs.map((tab) => {
              return (
                <div
                  key={tab}
                  className={classNames(
                    'inline-flex h-full w-26.25 cursor-pointer items-center justify-center gap-2 rounded-[10px]',
                    {
                      'bg-primary': selectedTab === tab,
                    }
                  )}
                  onClick={() => handleTabClick(tab as Tab)}
                >
                  <span
                    className={classNames(
                      'text-normal text-center text-[0.875rem] leading-snug font-semibold capitalize',
                      {
                        'text-white!': selectedTab === tab,
                      }
                    )}
                  >
                    {tab}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      <section className='h-[calc(100%-6rem)] flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
        <Container disableGutters className='flex flex-col items-center h-full'>
          {selectedTab === 'payables' && <Payables />}
          {selectedTab === 'receivables' && <Receivables />}
          {selectedTab === 'funding pools' && <Invest />}
        </Container>
      </section>
    </>
  );
};

export default PART;
