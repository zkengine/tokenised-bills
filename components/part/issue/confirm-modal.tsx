import InvoiceSvgABI from '@/abis/InvoiceSvg.json';
import { invoiceDelegateAbi } from '@/abis/invoice-delegate';
import CloseIcon from '@/assets/images/svg/ic_close.svg';
import { CheckIcon, CopyIcon } from '@/components/common/icons';
import Modal from '@/components/common/modal';
import TxHandlingModal from '@/components/common/tx-handling-modal';
import useCopyClipboard from '@/hooks/use-copy-clipboard';
import useWriteContractWithReceipt from '@/hooks/use-write-contract-with-receipt';
import { EMAIL_REGEX, getNetworkInfo } from '@/lib/constants';
import {
  dayJsAdapter,
  encodeUrlParams,
  formatABN,
  formatCurrency,
  shortenAddress,
  shortenTxHash,
  toBase64,
} from '@/lib/utils';
import { Item, Payable } from '@/typings';
import { Button } from '@mui/material';
import classNames from 'classnames';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScaleLoader } from 'react-spinners';
import { twMerge } from 'tailwind-merge';
import { Hex, encodeAbiParameters, parseUnits } from 'viem';
import { mantleSepoliaTestnet } from 'viem/chains';
import { useAccount, useReadContract } from 'wagmi';

interface IConfirmModalProps {
  isOpenConfirmModal: boolean;
  onModalClose: (succeed: boolean) => void;
  invoice: Payable;
  soldItems: Item[];
  subtotal: number;
  gst: number;
  total: number;
}

const ConfirmModal = (props: IConfirmModalProps) => {
  const {
    invoice,
    soldItems,
    subtotal,
    gst,
    total,
    isOpenConfirmModal,
    onModalClose,
  } = props;
  const [isCopied, onCopy] = useCopyClipboard();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [successText, setSuccessText] = useState<string>('');
  const [failureText, setFailureText] = useState<string>('');
  const [copiedText, setCopiedText] = useState<string>('');
  const [buyerWalletAddress, setBuyerWalletAddress] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [params, setParams] = useState<any>();

  const { address: account, chainId } = useAccount();
  const networkConfig = getNetworkInfo(chainId);
  const tokenDecimals = 6;
  const invoiceDelegateAddress = networkConfig.contracts.invoiceAddress;

  const { write, txHash, isSuccess, failureReason, isError } =
    useWriteContractWithReceipt();

  const svgContract = useReadContract({
    address: networkConfig.contracts.invoiceSvgAddress,
    abi: InvoiceSvgABI,
    functionName: 'generateSVG',
    args: [params],
    query: {
      enabled: !!params,
    },
    chainId: mantleSepoliaTestnet.id,
  });
  const svg = useMemo(() => {
    if (!svgContract || !account || !svgContract.data) return '';
    return toBase64(svgContract.data as string);
  }, [svgContract, account]);

  const unixInvoiceDate = useMemo(() => {
    const currentTime = dayjs();
    const _invoiceDate = dayJsAdapter
      ?.date(invoice.invoiceDate)
      ?.hour(currentTime.hour())
      ?.minute(currentTime.minute())
      ?.second(currentTime.second());
    return _invoiceDate?.utc().startOf('day').unix();
  }, [invoice.invoiceDate]);
  const unixDueDate = useMemo(() => {
    const currentTime = dayjs();
    const _dueDate = dayJsAdapter
      ?.date(invoice.dueDate)
      ?.hour(currentTime.hour())
      ?.minute(currentTime.minute())
      ?.second(currentTime.second());
    return _dueDate?.utc().endOf('day').unix();
  }, [invoice.dueDate]);
  const getInvoiceInfo = useCallback(() => {
    return encodeAbiParameters(
      [
        {
          type: 'tuple',
          components: [
            {
              name: 'seller',
              type: 'tuple',
              components: [
                { name: 'name', type: 'string' },
                { name: 'abn', type: 'string' },
                { name: 'addr', type: 'address' },
              ],
            },
            {
              name: 'buyer',
              type: 'tuple',
              components: [
                { name: 'name', type: 'string' },
                { name: 'abn', type: 'string' },
                { name: 'addr', type: 'address' },
              ],
            },
            {
              name: 'items',
              type: 'tuple[]',
              components: [
                { name: 'description', type: 'string' },
                { name: 'quantity', type: 'string' },
                { name: 'unitPrice', type: 'string' },
                { name: 'gst', type: 'string' },
                { name: 'totalPrice', type: 'string' },
              ],
            },
            { name: 'invoiceLink', type: 'string' },
            { name: 'subtotal', type: 'string' },
            { name: 'totalGst', type: 'string' },
            { name: 'invoiceDate', type: 'uint64' },
            { name: 'dueDate', type: 'uint64' },
          ],
        },
      ],
      [
        {
          seller: {
            name: invoice.sellerName,
            abn: invoice.sellerAbn,
            addr: account as Hex,
          },
          buyer: {
            name: invoice.buyerName,
            abn: invoice.buyerAbn,
            addr: (buyerWalletAddress || invoice.buyerAddr) as Hex,
          },
          items: [...soldItems],
          invoiceLink: encodeUrlParams(invoice.invoiceLink),
          subtotal: formatCurrency(`${subtotal}`),
          totalGst: formatCurrency(`${gst}`),
          invoiceDate: BigInt(unixInvoiceDate ?? 0),
          dueDate: BigInt(unixDueDate ?? 0),
        },
      ]
    );
  }, [
    invoice.sellerName,
    invoice.sellerAbn,
    invoice.buyerName,
    invoice.buyerAbn,
    invoice.buyerAddr,
    invoice.invoiceLink,
    account,
    buyerWalletAddress,
    soldItems,
    subtotal,
    gst,
    unixInvoiceDate,
    unixDueDate,
  ]);

  useEffect(() => {
    async function getPreviewSvg() {
      if (!account) return;
      setBuyerWalletAddress('');

      let _buyerAddr = invoice.buyerAddr;
      if (EMAIL_REGEX.test(_buyerAddr)) {
        try {
          const response = await fetch(
            `${process.env.BACKEND_API_URL}/wallet`,
            {
              method: 'POST',
              body: JSON.stringify({ email: _buyerAddr }),
            }
          );
          const data = await response.json();
          setBuyerWalletAddress(data.user.wallet.address);
          _buyerAddr = data.user.wallet.address;
        } catch (err) {
          console.error('Error to get wallet address, error msg:', err);
          return;
        }
      }

      const _params = {
        invoiceAddress: networkConfig.contracts.invoiceSvgAddress,
        tokenId: '10100000',
        valueDecimals: tokenDecimals,
        slotInfo: {
          seller: {
            name: invoice.sellerName,
            abn:
              invoice.sellerAbn?.length === 11
                ? formatABN(invoice.sellerAbn)
                : invoice.sellerAbn,
            addr: account,
          },
          buyer: {
            name: invoice.buyerName,
            abn:
              invoice.buyerAbn?.length === 11
                ? formatABN(invoice.buyerAbn)
                : invoice.buyerAbn,
            addr: _buyerAddr,
          },
          items: [...soldItems],
          invoiceLink: encodeUrlParams(invoice.invoiceLink),
          subtotal: formatCurrency(`${subtotal}`),
          totalGst: formatCurrency(`${gst}`),
          totalValue: parseUnits(`${total}`, tokenDecimals),
          invoiceDate: unixInvoiceDate,
          confirmDate: 0,
          dueDate: unixDueDate,
          state: 0,
          isValid: true,
        },
      };
      setParams(_params);
    }

    getPreviewSvg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const isCopiedAddr = isCopied && copiedText === 'addr';
  const isCopiedHash = isCopied && copiedText === 'hash';
  const handleCopy = useCallback(
    (text: string, content: string) => {
      setCopiedText(text);
      onCopy(content);
      setTimeout(() => {
        setCopiedText('');
      }, 300);
    },
    [onCopy]
  );

  const onCreatingInvoice = useCallback(() => {
    if (!account) return;
    setSuccessText('');
    setFailureText('');

    try {
      setLoading(true);
      const invoiceInfo = getInvoiceInfo();
      write({
        abi: invoiceDelegateAbi,
        address: invoiceDelegateAddress,
        functionName: 'mint',
        args: [
          buyerWalletAddress || invoice.buyerAddr,
          parseUnits(`${total}`, tokenDecimals),
          invoiceInfo,
        ],
      });
    } catch (err) {
      console.error('Error to create invoice, error msg:', err);
      setFailureText('Hold up');
    }
  }, [
    account,
    getInvoiceInfo,
    write,
    invoiceDelegateAddress,
    buyerWalletAddress,
    invoice.buyerAddr,
    total,
  ]);

  const handleReset = useCallback(() => {
    const isSucceed = !!successText && !failureText;
    setLoading(false);
    setSuccessText('');
    setFailureText('');
    setBuyerWalletAddress('');
    onModalClose(isSucceed);
  }, [failureText, onModalClose, successText]);

  return (
    <>
      {!isLoading && (
        <Modal
          isOpen={isOpenConfirmModal}
          modalClassName='w-full min-w-[595px] h-full'
          onClose={() => handleReset()}
          title='Issue'
        >
          <div
            className={classNames(
              'flex h-[85%] min-h-122.5 justify-center pt-4'
            )}
          >
            {!!svg ? (
              <img src={svg} className='w-full' alt='sample invoice image' />
            ) : (
              <div role='status' className='flex items-center justify-center'>
                <ScaleLoader color='#FF5C00' />
              </div>
            )}
          </div>

          <div className='pt-6 text-center text-[#959A9F]'>
            I confirm that the contents of this invoice are correct.
          </div>

          <div className='my-4 flex w-full justify-between'>
            <Button
              onClick={() => onModalClose(false)}
              className='inline-flex w-[45%] items-center justify-center gap-2 bg-[#ECEDEE]! px-4 py-2 font-medium text-gray-700! hover:bg-gray-50!'
            >
              <Image src={CloseIcon} alt='close' /> Close
            </Button>
            <Button
              onClick={onCreatingInvoice}
              className={twMerge(
                'inline-flex w-[45%] items-center justify-center gap-2 bg-primary! fill-white! px-4 py-2 text-base font-medium text-white! hover:bg-primary/80!'
              )}
            >
              OK
            </Button>
          </div>
        </Modal>
      )}

      {isLoading && (
        <TxHandlingModal
          tx={{
            txHash: txHash,
            isError,
            isSuccess,
            failureReason: failureReason,
            successText: successText,
            defaultText: 'You are issuing...',
          }}
          closeTxConfirmation={handleReset}
          modalClassName='min-w-[256px]'
        >
          {successText && (
            <div className='mt-5'>
              <div className='mb-[8px] flex items-center justify-between'>
                <span className='text-[#6E747A]!'>Invoice ID</span>
                <span className='flex justify-center text-[14px] text-[#0D1821]!'>
                  #{invoice.id}
                </span>
              </div>
              <div className='mb-[8px] flex items-center justify-between'>
                <span className='text-[#6E747A]!'>Contract address</span>
                <div className='flex items-center justify-center gap-2'>
                  <span className='text-[14px] text-[#0D1821]!'>
                    {shortenAddress(invoiceDelegateAddress)}
                  </span>
                  {isCopiedAddr ? (
                    <CheckIcon />
                  ) : (
                    <span
                      className='cursor-pointer'
                      onClick={() => handleCopy('addr', invoiceDelegateAddress)}
                    >
                      <CopyIcon />
                    </span>
                  )}
                </div>
              </div>
              <div className='mb-[8px] flex items-center justify-between'>
                <span className='text-[#6E747A]!'>Hash</span>
                <div className='flex items-center justify-center gap-2'>
                  <a
                    href={`${networkConfig.blockExplorer.tx}/${txHash}`}
                    target={'_blank'}
                    className='text-[14px] text-[#0D1821]'
                  >
                    {shortenTxHash(txHash)}
                  </a>

                  {isCopiedHash ? (
                    <CheckIcon />
                  ) : (
                    <span
                      className='cursor-pointer'
                      onClick={() => handleCopy('hash', txHash ?? '')}
                    >
                      <CopyIcon />
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </TxHandlingModal>
      )}
    </>
  );
};

export default ConfirmModal;
