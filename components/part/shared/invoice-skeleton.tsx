import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

interface Props {
  count?: number;
}
const InvoiceSkeleton = ({ count = 6 }: Props) => {
  return (
    <>
      {Array.from(new Array(count)).map((_, idx) => {
        return (
          <Box
            key={idx}
            sx={{
              width: '100%',
              mx: 0.5,
              my: 2,
              borderWidth: '1px',
              borderColor: '#E0E0E0',
              borderRadius: '5px',
            }}
          >
            <Skeleton variant='rectangular' />
            <Box sx={{ p: 1.5, gap: 2 }}>
              <Skeleton width='60%' />
              {[...new Array(3)].map((_, idx) => {
                return (
                  <div key={idx} className='mt-2 flex flex-row justify-between'>
                    <Skeleton width='40%' />
                    <Skeleton width='40%' />
                  </div>
                );
              })}

              <div className='mt-2 flex flex-row gap-3'>
                <Skeleton width='20%' />
                <Skeleton width='40%' />
                <Skeleton width='10%' />
              </div>
              <div className='mt-2 flex flex-row justify-between'>
                <Skeleton width='20%' />
                <Skeleton width='70%' />
              </div>
            </Box>
          </Box>
        );
      })}
    </>
  );
};

export default InvoiceSkeleton;
