import ActionItemButton from '@/components/common/action-item-button';
import { DetailIcon } from '@/components/common/icons';
import ActionDrawer from '@/components/part/shared/action-drawer';
import { useState } from 'react';
import { Hex } from 'viem';
import DetailsModal from './details-modal';
import InvestButton from './invest-button';
import WithdrawButton from './withdraw-button';

interface Props {
  openActionDrawer: boolean;
  poolAddress: Hex;
  underlyAssetAddr: Hex | undefined;
  onDrawerCloseHandler: () => void;
}
const CardActions = ({
  openActionDrawer,
  onDrawerCloseHandler,
  poolAddress,
  underlyAssetAddr,
}: Props) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const ActionItems = (
    <>
      <InvestButton
        poolAddress={poolAddress}
        underlyAssetAddr={underlyAssetAddr}
        onDrawerCloseHandler={onDrawerCloseHandler}
      />

      <WithdrawButton
        poolAddress={poolAddress}
        underlyAssetAddr={underlyAssetAddr}
        onDrawerCloseHandler={onDrawerCloseHandler}
      />

      <ActionItemButton
        primaryText='Detail'
        secondaryText='Check the product detail'
        startIcon={<DetailIcon />}
        disabled={false}
        actionHandler={() => setShowDetailsModal(true)}
      />
    </>
  );

  return (
    <>
      <ActionDrawer
        open={openActionDrawer}
        onCloseHandler={onDrawerCloseHandler}
        actionItems={ActionItems}
      />

      {showDetailsModal && (
        <DetailsModal
          poolAddress={poolAddress}
          underlyAssetAddr={underlyAssetAddr}
          onDetailsModalClose={() => setShowDetailsModal(false)}
        />
      )}
    </>
  );
};

export default CardActions;
