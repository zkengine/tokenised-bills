import { ArrowBackIcon } from '@/components/common/icons';
import { Global } from '@emotion/react';
import { Drawer, Typography, styled } from '@mui/material';
import List from '@mui/material/List';
import { grey } from '@mui/material/colors';
import { ReactNode } from 'react';

const drawerBleeding = 56;

const StyledBox = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
}));
const Puller = styled('div')(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 0.9375rem)',
}));

interface Props {
  open: boolean;
  actionItems: ReactNode;
  onCloseHandler: () => void;
}
const ActionDrawer = ({ open, onCloseHandler, actionItems }: Props) => {
  const DrawerList = (
    <StyledBox
      sx={{
        position: 'absolute',
        top: -drawerBleeding,
        borderTopLeftRadius: 47,
        borderTopRightRadius: 47,
        right: 0,
        left: 0,
        px: 4.2,
      }}
      className='max-h-[360px] min-h-[230px] bg-[#F6F6F6]'
      role='presentation'
    >
      <Puller />
      <div className='mt-3.75 flex w-full items-center py-5'>
        <Typography>
          <ArrowBackIcon
            className='w-fit'
            sx={{ height: '1rem', cursor: 'pointer' }}
            onClick={onCloseHandler}
          />
        </Typography>
        <Typography
          sx={{
            left: 'calc(50% - 1.625rem)',
            position: 'absolute',
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          Action
        </Typography>
        <Typography></Typography>
      </div>

      <List className='flex max-h-[360px] min-h-[230px] flex-col gap-4.75'>
        {actionItems}
      </List>
    </StyledBox>
  );

  return (
    <>
      {/* <CssBaseline /> */}
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: '20rem',
            overflow: 'visible',
            backgroundColor: '#F6F6F6',
          },
        }}
      />
      <Drawer
        open={open}
        anchor='bottom'
        onClose={() => {
          // if (reason === 'backdropClick') return;

          onCloseHandler();
        }}
      >
        {DrawerList}
      </Drawer>
    </>
  );
};

export default ActionDrawer;
