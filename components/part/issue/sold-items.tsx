import TrashIcon from '@/assets/images/trash.png';
import { BigNumberInstance, formatCurrency, unmaskValue } from '@/lib/utils';
import { Item } from '@/typings';
import Image from 'next/image';
import { ChangeEvent } from 'react';
import { FaPlus } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';
import './table.css';

const MAXITEMS = 3;

interface Props {
  soldItems: Item[];
  setSoldItems: (items: Item[]) => void;
  subtotal: number;
  gst: number;
  total: number;
}

const SoldItems = ({
  soldItems,
  setSoldItems,
  subtotal,
  gst,
  total,
}: Props) => {
  const handleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    const data = [...soldItems];
    if (event && event.target && event.target.validity.valid) {
      const idx = event.target.dataset['idx'];
      const name = event.target.name;
      const value = event.target.value;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      data[idx][name] = value; //name === 'unitPrice' ? maskedCurrency.resolve(value) : value;
      setSoldItems(data);
    }
  };

  const formatUnitPrice = (event: ChangeEvent<HTMLInputElement>) => {
    const data = [...soldItems];
    if (event && event.target) {
      const idx = event.target.dataset['idx'];
      const name = event.target.name;
      const value = event.target.value;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      data[idx][name] = formatCurrency(value);
      setSoldItems(data);
    }
  };

  const caculateItemTotalPrice = (
    item: Item,
    idx: number,
    event?: ChangeEvent<HTMLInputElement>
  ) => {
    if (event) {
      formatUnitPrice(event);
    }

    const data = [...soldItems];
    data[idx].totalPrice = `$${
      item.quantity && item.unitPrice
        ? BigNumberInstance(item.quantity)
            .times(unmaskValue(item.unitPrice))
            .toFormat(2)
        : '0.00'
    }`;
    setSoldItems(data);
  };

  const addItems = () => {
    const newItem: Item = {
      description: '',
      quantity: '',
      unitPrice: '',
      gst: '',
      totalPrice: '$0.00',
    };
    setSoldItems([...soldItems, newItem]);
  };

  const removeItems = (idx: number) => {
    const data = [...soldItems];
    data.splice(idx, 1);
    setSoldItems(data);
  };

  return (
    <div className='grid grid-cols-2 gap-4'>
      <div className='col-span-2'>
        <table className='mt-5 w-full border-separate border-spacing-0 rounded border border-solid border-[#ECEDEE] text-[0.85714rem] tracking-[0.0357rem] text-[#6E747A]'>
          <thead className='table-header-group items-center py-4'>
            <tr className='py-4 text-right'>
              <th
                className='w-[50%] py-4 pl-3 text-left font-normal'
                colSpan={2}
              >
                Items
              </th>
              <th className='w-[10%] pr-3 font-normal'>Qty</th>
              <th className='w-[20%] pr-3 font-normal'>Unit price (inc GST)</th>
              <th colSpan={2} className='w-[20%] pr-8 font-normal'>
                Total (inc GST)
              </th>
            </tr>
          </thead>
          <tbody className='text-right'>
            {soldItems.map((item, idx) => {
              return (
                <tr
                  key={idx}
                  className='group hover:bg-opacity-5 hover:bg-[#7918F50D]'
                >
                  <td colSpan={2} className='w-[50%]'>
                    <input
                      type='text'
                      className='text-md block w-full appearance-none border border-b-0 border-l-0 border-solid border-[#ECEDEE] bg-transparent px-3 pt-4 pb-3.5 text-[#0D1821] outline-none'
                      value={item.description}
                      name='description'
                      data-idx={idx}
                      autoComplete='new-off'
                      placeholder='Item description'
                      onChange={(e) => handleFormChange(e)}
                    />
                  </td>

                  <td className='w-[10%]'>
                    <input
                      type='number'
                      className='text-md block w-full appearance-none border border-x-0 border-b-0 border-solid border-[#ECEDEE] bg-transparent px-3 pt-4 pb-3.5 text-right text-[#0D1821] outline-none'
                      value={item.quantity || ''}
                      name='quantity'
                      pattern='[1-9]*'
                      data-idx={idx}
                      autoComplete='new-off'
                      min={1}
                      step='1'
                      placeholder='Min 1'
                      onChange={(e) => handleFormChange(e)}
                      onBlur={() => caculateItemTotalPrice(item, idx)}
                    />
                  </td>
                  <td className='w-[20%]'>
                    <input
                      type='text'
                      className='text-md block w-full appearance-none border border-r-0 border-b-0 border-solid border-[#ECEDEE] bg-transparent px-3 pt-4 pb-3.5 text-right text-[#0D1821] focus:outline-none'
                      value={item.unitPrice || ''}
                      name='unitPrice'
                      data-idx={idx}
                      min={0}
                      autoComplete='new-off'
                      step='0.25'
                      placeholder={`USDC`}
                      onChange={(e) => handleFormChange(e)}
                      onBlur={(e) => caculateItemTotalPrice(item, idx, e)}
                    />
                  </td>
                  <td
                    colSpan={2}
                    className='static w-[20%] border border-r-0 border-b-0 border-solid border-[#ECEDEE] pr-3 text-[#0D1821]'
                  >
                    <div className='flex items-center justify-end gap-2'>
                      <span>{item.totalPrice}</span>

                      <div
                        className={twMerge(
                          'invisible',
                          idx > 0 && 'group-hover:visible'
                        )}
                      >
                        <Image
                          src={TrashIcon}
                          alt='trash'
                          className='cursor-pointer'
                          onClick={() => removeItems(idx)}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>

          {soldItems.length < MAXITEMS && (
            <tfoot className='text-center'>
              <tr>
                <td colSpan={5}>
                  <span className='flex items-center justify-center py-4'>
                    <span
                      className='flex cursor-pointer items-center gap-2 text-[#7918F5]'
                      onClick={addItems}
                    >
                      <FaPlus /> Add a new item
                    </span>
                  </span>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
        {soldItems.length === MAXITEMS && (
          <div className='pt-3 text-[#959A9F]'>
            * Only three items are supported for now.
          </div>
        )}
      </div>
      <div className='col-span-1'></div>
      <div className='col-span-1 md:pl-5'>
        <div className='flex justify-between text-[#959A9F]'>
          <span>Subtotal</span>
          <span>{formatCurrency(`${subtotal}`)}</span>
        </div>

        <div className='mt-2 flex justify-between text-[#959A9F]'>
          <span>GST (10%)</span>
          <span>{formatCurrency(`${gst}`)}</span>
        </div>

        <div className='mt-2 flex justify-between text-xl font-semibold text-[#0D1821]'>
          <span>Total</span>
          <span>{formatCurrency(`${total}`)}</span>
        </div>
      </div>
    </div>
  );
};

export default SoldItems;
