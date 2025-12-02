import ActionDrawer from '@/components/part/shared/action-drawer';
import { Payable } from '@/typings';
import ConfirmButton from './confirm-button';
import DetailsButton from './details/details-button';
import PayButton from './pay-button';

interface Props {
  payable: Payable | undefined;
  openActionDrawer: boolean;
  onDrawerCloseHandler: () => void;
}
const CardActions = ({
  openActionDrawer,
  payable,
  onDrawerCloseHandler,
}: Props) => {
  const handleDrawerClose = () => {
    onDrawerCloseHandler();
  };

  const ActionItems = (
    <>
      {!payable?.paidAt && payable?.state === '1' && (
        <PayButton payable={payable} onPaidHandler={handleDrawerClose} />
      )}

      {payable?.state === '0' && (
        <ConfirmButton
          payable={payable}
          onConfirmedHandler={handleDrawerClose}
        />
      )}

      <DetailsButton payable={payable} />
    </>
  );

  return (
    <>
      <ActionDrawer
        open={openActionDrawer}
        onCloseHandler={handleDrawerClose}
        actionItems={ActionItems}
      />
    </>
  );
};

export default CardActions;
