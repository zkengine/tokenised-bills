import CalendarIcon from '@/assets/images/svg/date.svg';
import InvoiceFromIcon from '@/assets/images/svg/invoiceFrom.svg';
import InvoiceToIcon from '@/assets/images/svg/invoiceTo.svg';
import ItemSoldIcon from '@/assets/images/svg/itemSold.svg';
import RecipientIcon from '@/assets/images/svg/recipient.svg';
import { EMAIL_REGEX } from '@/lib/constants';
import {
  BigNumberInstance,
  currDate,
  dayJsAdapter,
  defaultDate,
  formatABN,
  unmaskValue,
} from '@/lib/utils';
import { Item, Payable } from '@/typings';
import { Button, Input } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { isAddress } from 'viem';
import ConfirmModal from './confirm-modal';
import SoldItems from './sold-items';

const initSoldItems = [
  {
    description: '',
    quantity: '',
    unitPrice: '',
    gst: '',
    totalPrice: '$0.00',
  },
];
const initInvoice: Payable = {
  invoiceDate: dayJsAdapter?.format(currDate as Dayjs, 'normalDate'),
  dueDate: dayJsAdapter?.format(defaultDate, 'normalDate'),
  sellerName: '',
  sellerAbn: '',
  buyerName: '',
  buyerAbn: '',
  buyerAddr: '',
  invoiceLink: '',
  items: [] as Item[],
};

const CreateInvoice = () => {
  const [items, setSoldItems] = useState<Item[]>(
    initSoldItems.map((item) => ({ ...item }))
  );
  const [invoice, setInvoice] = useState<Payable>(initInvoice);
  const [isOpenConfirmModal, setOpenConfirmModal] = useState(false);

  const router = useRouter();

  const {
    invoiceDate,
    dueDate,
    sellerName,
    sellerAbn,
    buyerName,
    buyerAbn,
    buyerAddr,
  } = invoice;
  const formattedSellerABN = formatABN(sellerAbn);
  const formattedBuyerABN = formatABN(buyerAbn);

  const onChangeInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      if ((name === 'sellerAbn' || name === 'buyerAbn') && value.length > 14) {
        return;
      }
      setInvoice({ ...invoice, [name]: value });
    },
    [invoice]
  );

  const totalInGst = items
    .map((item) => {
      return item.quantity && item.unitPrice
        ? BigNumberInstance(item.quantity)
            .times(unmaskValue(item.unitPrice))
            .toNumber()
        : 0;
    })
    .reduce((a, b) => a + b, 0);
  const subtotal = BigNumberInstance(totalInGst).div(1.1).toNumber();
  const gst = BigNumberInstance(totalInGst).div(11).toNumber();
  const total = BigNumberInstance(subtotal).plus(gst).toNumber();
  const soldItems = items.map((item) => ({ ...item }));

  const handleDateChange = (_selectedDate: Date) => {
    const formattedDate = dayJsAdapter?.format(
      dayJsAdapter.date(_selectedDate) as Dayjs,
      'normalDate'
    );
    setInvoice({ ...invoice, dueDate: formattedDate });
  };

  const onModalClose = (succeeded?: boolean) => {
    if (succeeded) {
      setInvoice(initInvoice);
      setSoldItems(() => initSoldItems.map((item) => ({ ...item })));
      router.push('/');
    }
    setOpenConfirmModal(false);
  };

  const isValidAbn = (abn: string) =>
    abn.includes(' ') ? abn.length === 14 : abn.length === 11; // formatted abn length is 14
  const isValidWalletAddress =
    !buyerAddr ||
    (!!buyerAddr && isAddress(buyerAddr)) ||
    EMAIL_REGEX.test(buyerAddr);
  const isValidItems = items.every(
    (item) => !!item.description?.trim() && !!item.quantity && !!item.unitPrice
  );
  const isValidInvoiceForm =
    !!invoiceDate &&
    !!dueDate &&
    !!sellerName &&
    !!sellerAbn &&
    isValidAbn(sellerAbn) &&
    !!buyerName &&
    !!buyerAddr &&
    !!buyerAbn &&
    isValidAbn(buyerAbn) &&
    isValidWalletAddress &&
    isValidItems;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='min-h-[calc(100vh-150px)] w-full px-12'>
      <div className='my-12 flex flex-wrap justify-between gap-4'>
        <div className='w-[58.35714rem]'>
          <main className='container'>
            <div
              className='flex h-6 items-center justify-end bg-[#D8DCDE] font-semibold text-black'
              style={{
                background:
                  'linear-gradient(90deg, #B659FF 0%, #1ADA89 33.97%, #FFAD32 66.99%, #EC364C 99.16%)',
              }}
            >
              <span className='px-3 text-[12px] text-white uppercase'>
                issuing
              </span>
            </div>

            <div className='bg-white p-[37px] text-[#0D1821] lg:px-0'>
              <div className='pb-[3.35714rem] text-[2.57143rem] font-semibold'>
                Tax Invoice
              </div>
              <div className='flex h-[1.142855rem] items-center gap-1'>
                <Image src={CalendarIcon} alt='calendar' />
                <span className='font-medium'>Due date</span>
              </div>

              <div className='mt-2 grid grid-cols-4 gap-4'>
                <div className='col-span-2'>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      disablePast
                      format='DD MMM YYYY'
                      views={['year', 'month', 'day']}
                      value={dayJsAdapter.date(invoice.dueDate) as Dayjs}
                      onChange={(val) => {
                        if (!val) return;
                        const currentTime = dayjs();
                        const mergedDateTime = (dayJsAdapter.date(val) as Dayjs)
                          .hour(currentTime.hour())
                          .minute(currentTime.minute())
                          .second(currentTime.second());
                        handleDateChange(mergedDateTime.toDate());
                      }}
                      maxDate={
                        dayJsAdapter.date(new Date('2030-01-01')) as Dayjs
                      }
                    />
                  </LocalizationProvider>
                </div>
                <div className='col-span-2'>
                  <div className='flex h-[1.142855rem] items-center gap-1'>
                    <Image src={RecipientIcon} alt='recipient' />
                    <span className='font-medium'>
                      Recipient wallet address
                    </span>
                  </div>

                  <Input
                    type='text'
                    name='buyerAddr'
                    // label="Recipient"
                    // hasError={!isValidWalletAddress}
                    // errorMsg="Invalid wallet or email address"
                    onChange={onChangeInput}
                    value={buyerAddr}
                    className='mt-2 w-full'
                  />
                </div>

                <div className='col-span-2 mt-12'>
                  <div className='flex h-[1.142855rem] items-center gap-1'>
                    <Image src={InvoiceFromIcon} alt='invoice from' />
                    <span className='font-medium'>Invoice from</span>
                  </div>

                  <Input
                    type='text'
                    name='sellerName'
                    placeholder='Legal entity'
                    onChange={onChangeInput}
                    value={sellerName}
                    className='mt-2 w-full'
                  />
                  <Input
                    type='text'
                    name='sellerAbn'
                    placeholder='ABN'
                    onChange={onChangeInput}
                    value={formattedSellerABN}
                    className='mt-2 w-full'
                  />
                </div>

                <div className='col-span-2 mt-12'>
                  <div className='flex h-[1.142855rem] items-center gap-1'>
                    <Image src={InvoiceToIcon} alt='invoice to' />
                    <span className='font-medium'>Invoice to</span>
                  </div>

                  <Input
                    type='text'
                    name='buyerName'
                    placeholder='Legal entity'
                    onChange={onChangeInput}
                    value={buyerName}
                    className='mt-2 w-full'
                  />
                  <Input
                    type='text'
                    name='buyerAbn'
                    placeholder='ABN'
                    onChange={onChangeInput}
                    value={formattedBuyerABN}
                    className='mt-2 w-full'
                  />
                </div>

                <div className='col-span-4 mt-12'>
                  <div className='flex h-[1.142855rem] items-center gap-1'>
                    <Image src={ItemSoldIcon} alt='item sold' />
                    <span className='font-medium'>Items sold</span>
                  </div>

                  <SoldItems
                    setSoldItems={setSoldItems}
                    soldItems={items}
                    subtotal={subtotal}
                    gst={gst}
                    total={total}
                  />
                </div>
              </div>
            </div>

            <div className='flex w-full flex-col items-end justify-end'>
              <Button
                className={twMerge(
                  'h-12 w-[11.85714rem] rounded border-none bg-primary! text-[1rem] font-semibold text-[#FBFAFC]!',
                  !isValidInvoiceForm && 'cursor-not-allowed opacity-50'
                )}
                onClick={() => setOpenConfirmModal(true)}
                disabled={!isValidInvoiceForm}
              >
                Issue
              </Button>
            </div>
          </main>
        </div>
      </div>

      {isOpenConfirmModal && (
        <ConfirmModal
          isOpenConfirmModal={isOpenConfirmModal}
          onModalClose={onModalClose}
          subtotal={subtotal}
          gst={gst}
          total={total}
          invoice={invoice}
          soldItems={soldItems}
        />
      )}
    </div>
  );
};

export default CreateInvoice;
