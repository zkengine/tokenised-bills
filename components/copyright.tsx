import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';

export default function Copyright() {
  return (
    <Typography
      variant='body2'
      align='center'
      sx={{
        color: 'text.secondary',
        my: 1,
      }}
    >
      {'Copyright © '}
      <MuiLink color='inherit' href='#'>
        Tokenised Invoices
      </MuiLink>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
}
