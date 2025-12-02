import ActionItemButton from '@/components/common/action-item-button';
import { DetailIcon } from '@/components/common/icons';
import { Receivable } from '@/typings';
import { useState } from 'react';
import ReceivableDetailsModal from './receivable-details-modal';

interface Props {
  receivable: Receivable | undefined;
}

const DetailsButton = ({ receivable }: Props) => {
  const [isPreview, setPreview] = useState(false);

  return (
    <>
      <ActionItemButton
        primaryText='Detail'
        secondaryText='Check your receivable details'
        startIcon={<DetailIcon />}
        disabled={false}
        actionHandler={() => setPreview(true)}
      />

      {isPreview && !!receivable && (
        <ReceivableDetailsModal
          receivable={receivable}
          isPreview={isPreview}
          handlePreviewClose={() => setPreview(false)}
        />
      )}
    </>
  );
};

export default DetailsButton;
