import { DropDownIcon } from '@/components/common/icons';
import { IMenuItem } from '@/typings';
import { Button, Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react';

interface Props {
  label: string;
  value: string;
  changeHandler: (val: string) => void;
  menuItems: IMenuItem[];
}

const QuerySelect = ({ label, value, changeHandler, menuItems }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (value: string) => {
    changeHandler(value);
    handleClose();
  };

  return (
    <>
      <Button
        aria-controls='simple-menu'
        aria-haspopup='true'
        onClick={handleClick}
        endIcon={
          <DropDownIcon
            style={{ fontSize: '0.75rem', marginLeft: '-0.25rem' }}
          />
        }
        sx={{
          textTransform: 'none',
          color: '#0D1821',
          fontSize: '0.85rem',
          fontWeight: '600',
        }}
      >
        {menuItems.find((item) => item.value === value)?.label || label}
      </Button>
      <Menu
        id='simple-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '0.375rem',
            border: '1px solid #e0e0e0',
            zIndex: 10,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          },
        }}
        onClose={handleClose}
      >
        {menuItems.map((item) => (
          <MenuItem
            key={item.label}
            selected={item.value === value}
            onClick={() => handleMenuItemClick(item.value)}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default QuerySelect;
