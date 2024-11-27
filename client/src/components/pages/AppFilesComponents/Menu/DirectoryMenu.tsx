import React, {FC} from 'react';
import Box from '@mui/material/Box';
import {ListItemButton, List, ListItemText, ListItemIcon} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import DownloadIcon from '@mui/icons-material/Download';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import {useParams, useNavigate} from 'react-router';
import {useDeleteDirectoryMutation} from '../../../../store/services/fileApiWs';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import {deleteFileOrDirectory} from '../../../../store/slices/lsFS/dirSlice';
import {useAppDispatch} from '../../../../hooks/typedReduxHooks';
import generateFilename from '../../../../utils/genFilename';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

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
	const [deleteRemoteDirectory] = useDeleteDirectoryMutation();
	const dispatch = useAppDispatch();

	const onOpenDirHandler = () => {
		navigate(`/filesystem/${encodeURIComponent(path && path[path.length - 1] !== '/' ? path + '/' + filename : path + filename)}`);
	};

	// Также сделать warning, если удаляется важная папка и что пользователь берёт все риски на себя
	const onRemoveFolderHandler = () => {
		dispatch(deleteFileOrDirectory(filename));
		deleteRemoteDirectory(generateFilename(path, filename));
	};

	// Также сделать warning, если качается большая папка и что пользователь берёт все риски на себя
	const onDownloadFolderHandler = () => {
		alert('Downloading folder...');
	};


	const onRenameFolderHandler = () => {
		alert('Renaming folder...');
	};

	const onCopyNameHandler = () => {
		alert(filename);
	};

	const menuItems = [
		{
			onClickFunction: onOpenDirHandler,
			text: 'Open',
			icon: <FolderOpenIcon/>
		},
		{
			onClickFunction: onCopyNameHandler,
			text: 'Copy name',
			icon: <ContentCopyIcon/>
		},
		{
			onClickFunction: onRemoveFolderHandler,
			text: 'Remove',
			icon: <ClearIcon sx={{color: 'red'}}/>,
			color: 'red'
		},
		{
			onClickFunction: onDownloadFolderHandler,
			text: 'Download (tar.gz)',
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