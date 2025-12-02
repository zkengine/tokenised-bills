import ActionItemButton from '@/components/common/action-item-button';
import { DetailIcon } from '@/components/common/icons';
import { Payable } from '@/typings';
import { useState } from 'react';
import PayableDetailsModal from './payable-details-modal';

interface Props {
  payable: Payable | undefined;
}
const DetailsButton = ({ payable }: Props) => {
  const [isPreview, setPreview] = useState(false);

  return (
    <>
      <ActionItemButton
        primaryText='Detail'
        secondaryText='Check your invoice details'
        startIcon={<DetailIcon />}
        actionHandler={() => setPreview(true)}
      />

      {isPreview && !!payable && (
        <PayableDetailsModal
          invoice={payable}
          isPreview={isPreview}
          handlePreviewClose={() => setPreview(false)}
        />
      )}
    </>
  );
};

export default DetailsButton;
