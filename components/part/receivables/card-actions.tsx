import ActionDrawer from '@/components/part/shared/action-drawer';
import { Receivable } from '@/typings';
import DetailsButton from './details/details-button';
import SplitButton from './split-button';
import WithdrawButton from './withdraw-button';

interface Props {
  receivable: Receivable | undefined;
  openActionDrawer: boolean;
  onDrawerCloseHandler: () => void;
}
const CardActions = ({
  openActionDrawer,
  receivable,
  onDrawerCloseHandler,
}: Props) => {
  const handleActionDrawerClose = () => {
    onDrawerCloseHandler();
  };

  const ActionItems = (
    <>
      {receivable?.state === '0' && (
        <SplitButton
          receivable={receivable}
          onDrawerCloseHandler={onDrawerCloseHandler}
        />
      )}

      {receivable?.state === '1' && (
        <WithdrawButton
          receivable={receivable}
          onDrawerCloseHandler={onDrawerCloseHandler}
        />
      )}

      <DetailsButton receivable={receivable} />
    </>
  );

  return (
    <>
      <ActionDrawer
        open={openActionDrawer}
        onCloseHandler={handleActionDrawerClose}
        actionItems={ActionItems}
      />
    </>
  );
};

export default CardActions;
