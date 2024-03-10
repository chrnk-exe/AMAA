import React, {FC} from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Typography from '@mui/material/Typography';

interface props {
	drawerToggle: () => void,
	open: boolean
}


const Header: FC<props> = ({drawerToggle, open}) => {
	return (
		<Box
			sx={{ width: '100%' }}
			display="flex"
			justifyContent="space-between">
			<Box display="flex" alignItems='center' justifyContent='flex-start'>
				<IconButton
					size="large"
					edge="start"
					color="inherit"
					// aria-label="open drawer"
					onClick={drawerToggle}
					sx={{ mr: 2 }}>
					{open ? (
						<ChevronLeftIcon />
					) : (
						<ChevronRightIcon />
					)}
				</IconButton>
				<Typography
					variant="h5"
					noWrap
					component="div">
					Analyze your app!
				</Typography>
			</Box>
		</Box>
	);
};

export default Header;