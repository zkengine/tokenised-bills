import { dayJsAdapter, formatCurrency, getDayDiffs } from '@/lib/utils';
import { uaTokenInfoAtom } from '@/states';
import { Payable, Receivable } from '@/typings';
import { Divider } from '@mui/material';
import classNames from 'classnames';
import { Dayjs } from 'dayjs';
import { useAtomValue } from 'jotai';
import { FC, HTMLAttributes, Ref } from 'react';
import { formatUnits } from 'viem';

interface Props extends HTMLAttributes<HTMLParagraphElement> {
  title: string;
  data: Payable | Receivable;
  state: string;
  innerRef?: Ref<HTMLParagraphElement>;
}

interface SVGProps {
  fillColour?: string;
  id?: string | number;
  h?: number;
  w?: number;
  height?: string;
}

const InvoiceFromToIcon = ({ fillColour = 'white', id }: SVGProps) => {
  return (
    <svg
      width='39'
      height='14'
      viewBox='0 0 39 14'
      xmlns='http://www.w3.org/2000/svg'
    >
      <defs>
        <linearGradient
          id={`paintlinear${id}`}
          x1='-2.56667'
          y1='7'
          x2='41.3'
          y2='7'
        >
          <stop stopColor={fillColour} stopOpacity='0.1' />
          <stop offset='0.493895' stopColor={fillColour} />
          <stop offset='1' stopColor={fillColour} stopOpacity='0.1' />
        </linearGradient>
      </defs>
      <path
        d='M19.1334 1.16666C15.9134 1.16666 13.3 3.77999 13.3 6.99999C13.3 10.22 15.9134 12.8333 19.1334 12.8333C22.3534 12.8333 24.9667 10.22 24.9667 6.99999C24.9667 3.77999 22.3534 1.16666 19.1334 1.16666ZM21.4842 7.30916L19.7342 9.05916C19.6467 9.14666 19.5359 9.18749 19.425 9.18749C19.3142 9.18749 19.2034 9.14666 19.1159 9.05916C18.9467 8.88999 18.9467 8.60999 19.1159 8.44082L20.1192 7.43749H17.0917C16.8525 7.43749 16.6542 7.23916 16.6542 6.99999C16.6542 6.76082 16.8525 6.56249 17.0917 6.56249H20.1192L19.1159 5.55916C18.9467 5.38999 18.9467 5.10999 19.1159 4.94082C19.285 4.77166 19.565 4.77166 19.7342 4.94082L21.4842 6.69082C21.6534 6.85999 21.6534 7.13999 21.4842 7.30916Z'
        fill={fillColour}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M9.33343 8.86667C10.3644 8.86667 11.2001 8.03093 11.2001 7C11.2001 5.96907 10.3644 5.13333 9.33343 5.13333C8.3025 5.13333 7.46677 5.96907 7.46677 7C7.46677 8.03093 8.3025 8.86667 9.33343 8.86667ZM4.19996 8.39999C4.97316 8.39999 5.59996 7.77319 5.59996 6.99999C5.59996 6.22679 4.97316 5.59999 4.19996 5.59999C3.42676 5.59999 2.79996 6.22679 2.79996 6.99999C2.79996 7.77319 3.42676 8.39999 4.19996 8.39999ZM1.4 7.23334C1.4 7.61994 1.0866 7.93334 0.7 7.93334C0.313401 7.93334 0 7.61994 0 7.23334C0 6.84674 0.313401 6.53334 0.7 6.53334C1.0866 6.53334 1.4 6.84674 1.4 7.23334ZM38.0332 7.93334C38.4198 7.93334 38.7332 7.61994 38.7332 7.23334C38.7332 6.84674 38.4198 6.53334 38.0332 6.53334C37.6466 6.53334 37.3332 6.84674 37.3332 7.23334C37.3332 7.61994 37.6466 7.93334 38.0332 7.93334ZM35.4666 6.99999C35.4666 7.77319 34.8398 8.39999 34.0666 8.39999C33.2934 8.39999 32.6666 7.77319 32.6666 6.99999C32.6666 6.22679 33.2934 5.59999 34.0666 5.59999C34.8398 5.59999 35.4666 6.22679 35.4666 6.99999ZM28.9333 8.86667C29.9643 8.86667 30.8 8.03093 30.8 7C30.8 5.96907 29.9643 5.13333 28.9333 5.13333C27.9024 5.13333 27.0667 5.96907 27.0667 7C27.0667 8.03093 27.9024 8.86667 28.9333 8.86667Z'
        fill={`url(#paintlinear${id})`}
      />
    </svg>
  );
};

const InvoiceCard: FC<Props> = ({ title, data, state, innerRef, ...props }) => {
  const uaTokenInfo = useAtomValue(uaTokenInfoAtom);

  const invoice: Payable =
    title === 'receivable' ? (data as Receivable)?.invoice : (data as Payable);

  const lState = state.toLowerCase();
  const stateTextColor =
    lState === 'tbc'
      ? '#597EFF'
      : lState === 'finalised'
      ? '#6E747A'
      : lState === 'overdue'
      ? '#EC364C'
      : lState === 'paid'
      ? '#13C57B'
      : '#FFAD32';

  const totalPrice =
    title === 'receivable' ? (data as Receivable)?.amount : invoice?.totalValue;

  return (
    <>
      <div
        {...props}
        ref={innerRef}
        className='3xl:w-[24.5rem] flex h-60 w-full flex-col items-center rounded-md bg-white'
      >
        <div className='h-[14.928571428571429rem] w-full cursor-pointer rounded-md bg-[#F8F8F9]'>
          <div
            className={classNames(
              'flex h-[0.92857rem] items-center justify-end rounded-t-md bg-[#FFAD32] align-middle',
              lState === 'tbc' && `bg-[#597EFF]!`,
              lState === 'finalised' && `bg-[#6E747A]!`,
              lState === 'paid' && `bg-[#13C57B]!`,
              lState === 'overdue' && `bg-[#EC364C]!`
            )}
          >
            <span className='pr-[0.85714rem] text-[0.64286rem] font-semibold text-white uppercase'>
              {state}
            </span>
          </div>

          <div className='px-4'>
            <div className='flex items-center pt-[1.14286rem]'>
              <span className='h-[0.64286rem] text-[0.785712rem] font-semibold text-black uppercase'>
                {title === 'receivable' ? `Receivable of Tax Invoice` : title}{' '}
                <span className='font-normal'>#{invoice.id || data.id}</span>
              </span>
            </div>

            <div className='flex items-center justify-start pt-[1.14286rem] font-semibold'>
              <div className='w-[40%]'>
                <div className='mb-[0.285712rem] h-[0.785712rem] text-[0.64286rem] tracking-[0.5px] text-[#BCC1C5]'>
                  Invoice from
                </div>
                <p
                  className='line-clamp-2 h-[2.285712rem] text-[0.785712rem] text-black'
                  title={invoice.sellerName}
                >
                  {invoice.sellerName}
                </p>
                <div className='mt-[0.57143rem] h-[0.785712rem] text-[0.64286rem] tracking-[-1px] text-[#BCC1C5] uppercase'>
                  ABN: {invoice.sellerAbn}
                </div>
              </div>

              <div className='px-[0.3rem] sm:px-[0.8rem]'>
                <InvoiceFromToIcon fillColour={stateTextColor} id={data.id} />
              </div>

              <div className='w-[40%]'>
                <div className='mb-[0.285712rem] h-[0.785712rem] text-[0.64286rem] tracking-[0.5px] text-[#BCC1C5]'>
                  Invoice to
                </div>
                <div
                  className='line-clamp-2 h-[2.285712rem] text-[0.785712rem] text-black'
                  title={invoice.buyerName}
                >
                  {invoice.buyerName}
                </div>
                <div className='mt-[0.57143rem] h-[0.785712rem] text-[0.64286rem] tracking-[-0.5px] text-[#BCC1C5] uppercase'>
                  ABN: {invoice.buyerAbn}
                </div>
              </div>
            </div>

            <div className='mt-[1.42857rem] flex h-[0.92857rem] min-w-[10.7143rem] items-center font-semibold'>
              <span className='w-24 text-[0.64286rem] leading-[0.785711rem] tracking-[-0.5px] text-[#BCC1C5]'>
                Invoice date
              </span>

              <span className='pl-8 text-[0.785712rem] leading-[0.9286rem] font-semibold text-black'>
                {dayJsAdapter?.format(
                  dayJsAdapter.date(
                    new Date(Number(invoice.invoiceDate) * 1000)
                  ) as Dayjs,
                  'normalDate'
                )}
              </span>
            </div>

            <div className='mt-[0.64286rem] flex h-[0.92857rem] items-center font-semibold'>
              <span className='w-24 text-[0.64286rem] leading-[0.785711rem] tracking-[-0.5px] text-[#BCC1C5]'>
                Due date
              </span>

              <span className='flex items-center pl-8 text-[0.785712rem] text-black'>
                {dayJsAdapter?.format(
                  dayJsAdapter.date(
                    new Date(Number(invoice.dueDate) * 1000)
                  ) as Dayjs,
                  'normalDate'
                )}

                {lState === 'finalised' || lState === 'paid' ? (
                  ''
                ) : getDayDiffs(invoice.dueDate) > 0 ? (
                  <>
                    <Divider
                      flexItem
                      orientation='vertical'
                      sx={{ height: 12, mx: 1, mt: 0.3 }}
                    />
                    <span>due in {getDayDiffs(invoice.dueDate)}d</span>
                  </>
                ) : (
                  lState !== 'tbc' && (
                    <>
                      <Divider
                        flexItem
                        orientation='vertical'
                        sx={{ height: 12, mx: 1, mt: 0.3 }}
                      />
                      <span className='text-[#EC364C]!'>
                        Overdue {`${-getDayDiffs(invoice.dueDate)}`}d
                      </span>
                    </>
                  )
                )}
              </span>
            </div>

            <div className='mt-[0.64286rem] flex h-[0.92857rem] items-center font-semibold'>
              <span className='w-24 text-[0.64286rem] leading-[0.785711rem] tracking-[-0.5px] text-[#BCC1C5]'>
                {title === 'receivable' ? 'Amount' : 'Total price'}
              </span>

              <span className='pl-8 text-[0.785712rem] text-black'>
                {`${formatCurrency(
                  formatUnits(BigInt(totalPrice || '0'), uaTokenInfo.decimals)
                )}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceCard;
