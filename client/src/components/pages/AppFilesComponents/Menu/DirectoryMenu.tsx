import React, {FC} from 'react';
import Box from '@mui/material/Box';
import {ListItemButton, List, ListItemText, ListItemIcon} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import DownloadIcon from '@mui/icons-material/Download';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import {useParams, useNavigate} from 'react-router';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

// * Remove (rm -rf)
// * zip and download (!)
// * rename (mv)
// * create directory (mkdir)

interface props {
	filename: string;
	onClose: () => void;
}

const DirectoryMenu: FC<props> = ({filename, onClose}) => {
	const {path} = useParams();
	const navigate = useNavigate();

	const onOpenDirHandler = () => {
		navigate(`/filesystem/${encodeURIComponent(path && path[path.length - 1] !== '/' ? path + '/' + filename : path + filename)}`);
	};

	// Также сделать warning, если удаляется важная папка и что пользователь берёт все риски на себя
	const onRemoveFolderHandler = () => {
		alert('Remove Folder');
	};

	// Также сделать warning, если качается большая папка и что пользователь берёт все риски на себя
	const onDownloadFolderHandler = () => {
		alert('Downloading folder...');
	};


	const onRenameFolderHandler = () => {
		alert('Renaming folder...');
	};

	const menuItems = [
		{
			onClickFunction: onOpenDirHandler,
			text: 'Open',
			icon: <FolderOpenIcon/>
		},
		{
			onClickFunction: onRemoveFolderHandler,
			text: 'Remove',
			icon: <ClearIcon sx={{color: 'red'}}/>,
			color: 'red'
		},
		{
			onClickFunction: onDownloadFolderHandler,
			text: 'Download (zip)',
			icon: <DownloadIcon/>,
		},
		{
			onClickFunction: onRenameFolderHandler,
			text: 'Rename',
			icon: <DriveFileRenameOutlineIcon/>
		}
	];


	return (
		<Box p={1} onClick={() => onClose()}>
			<List>
				{
					menuItems.map((menuItem, index) => (
						<ListItemButton key={index} sx={{color: menuItem.color}} onClick={menuItem.onClickFunction}>
							<ListItemIcon>{menuItem.icon}</ListItemIcon>
							<ListItemText>{menuItem.text}</ListItemText>
						</ListItemButton>
					))
				}
			</List>
		</Box>
	);
};

export default DirectoryMenu;