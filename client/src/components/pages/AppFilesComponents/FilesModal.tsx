import React, {useState, useEffect, FC} from 'react';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Fade from '@mui/material/Fade';
import DirectoryMenu from './Menu/DirectoryMenu';
import FileMenu from './Menu/FileMenu';
import LinkMenu from './Menu/LinkMenu';


interface props {
	coords: {
		x: number
		y: number
	};
	isOpen: boolean;
	objectType?: objectType;
	onClose: () => void;
	filename: string;
}

const FilesPopover: FC<props> = ({coords, isOpen, objectType, onClose, filename}) => {
	const [localCoords, setLocalCoords] = useState({
		x: coords.x,
		y: coords.y
	});

	const MenuComponents = {
		'directory': <DirectoryMenu filename={filename} onClose={onClose}/>,
		'file': <FileMenu filename={filename} onClose={onClose}/>,
		'link': <LinkMenu/>
	};

	useEffect(() => {
		setLocalCoords({
			y: coords.y,
			x: coords.x,
		});
	}, [coords]);

	if (!objectType) {
		return null;
	} else {
		return (
			<Popover open={isOpen} onClose={onClose} anchorPosition={{top: localCoords.y, left: localCoords.x}}
					 anchorReference="anchorPosition"
			>
				<Fade in={isOpen}>
					<Box>
						{
							MenuComponents[objectType]
						}
					</Box>
				</Fade>
			</Popover>);
	}
};

export default FilesPopover;