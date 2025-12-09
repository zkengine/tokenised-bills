import { erc3525Abi } from '@/abis/erc3525';
import { PackagingFacetAbi } from '@/abis/part';
import DefaultButton from '@/components/common/default-button';
import TxHandlingModal from '@/components/common/tx-handling-modal';
import useWriteContractWithReceipt from '@/hooks/use-write-contract-with-receipt';
import { NETWORK_CONFIG, QUERY_GC_TIME } from '@/lib/constants';
import { getErrorMessage } from '@/lib/helper';
import { Receivable } from '@/typings';
import classNames from 'classnames';
import { useMemo, useState } from 'react';
import { toHex } from 'viem';
import { useAccount, useChainId, useReadContracts } from 'wagmi';

interface Props {
  receivables: Receivable[];
  onSucceededHandler: (succeeded?: boolean) => void;
}
const SellConfirmationButton = ({ receivables, onSucceededHandler }: Props) => {
  const [openLoadingModal, setLoadingModal] = useState(false);
  const [requiredApprove, setRequiredApprove] = useState(false);

  const chainId = useChainId();
  const { address } = useAccount();
  const networkContracts = useMemo(
    () => NETWORK_CONFIG[chainId].contracts,
    [chainId]
  );

  const { data, isLoading, refetch } = useReadContracts({
    contracts: [
      {
        address: networkContracts.receivableAddress,
        abi: erc3525Abi,
        functionName: 'isApprovedForAll',
        args: [address!, networkContracts.diamondAddress!],
      },
    ],
    query: {
      enabled: !!address && !!networkContracts.diamondAddress,
      gcTime: QUERY_GC_TIME,
      refetchInterval: 3000,
    },
  });
  const [isApprovedForAll] = data || [];

  const hasApproved = useMemo(
    () =>
      isApprovedForAll?.status === 'success' &&
      isApprovedForAll.result === true,
    [isApprovedForAll]
  );

  const { write, txHash, isSuccess, failureReason, isError } =
    useWriteContractWithReceipt();

  const onPackAndSellHandler = () => {
    if (
      !networkContracts.diamondAddress ||
      !networkContracts.receivableAddress ||
      !address
    )
      return;

    setLoadingModal(true);
    setRequiredApprove(false);

    if (hasApproved) {
      const seed = Date.now();
      const bundlingInfo = {
        name: `PART Testing - ${seed}`,
        bundledAsset: networkContracts.receivableAddress,
        salt: toHex(`${seed}`, { size: 32 }),
        tokenIds: receivables.map((val) => BigInt(val.id!)) || [],
      };
      write({
        abi: PackagingFacetAbi,
        address: networkContracts.diamondAddress,
        functionName: 'pack',
        args: [bundlingInfo],
      });
    } else {
      setRequiredApprove(true);
      write({
        abi: erc3525Abi,
        address: networkContracts.receivableAddress,
        functionName: 'setApprovalForAll',
        args: [networkContracts.diamondAddress, true],
      });
    }
  };

  const onTxModalClose = () => {
    refetch();
    setLoadingModal(false);
    setRequiredApprove(false);

    if (!requiredApprove && isSuccess) {
      onSucceededHandler(true);
    }
  };

  return (
    <>
      <DefaultButton
        btnName={hasApproved ? 'Sell' : 'Approve to Sell'}
        className={classNames('w-full!')}
        variant='contained'
        onClick={onPackAndSellHandler}
        disabled={isLoading}
      />

      {openLoadingModal && (
        <TxHandlingModal
          tx={{
            txHash: txHash,
            isError,
            isSuccess,
            failureReason: getErrorMessage(failureReason, true),
            successText: `${
              isSuccess
                ? `You have successfully ${
                    requiredApprove ? 'approved' : 'sold'
                  } this receivable`
                : ''
            }`,
            defaultText: `${`You are ${
              requiredApprove ? 'approving' : 'selling'
            }...`}`,
          }}
          closeTxConfirmation={onTxModalClose}
          modalClassName='min-w-[256px]'
        />
      )}
    </>
  );
};

export default SellConfirmationButton;
