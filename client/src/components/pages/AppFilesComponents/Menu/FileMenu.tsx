import React, {FC} from 'react';
import Box from '@mui/material/Box';
import {List, ListItemButton, ListItemIcon, ListItemText} from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ClearIcon from '@mui/icons-material/Clear';
import DownloadIcon from '@mui/icons-material/Download';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import {useParams} from 'react-router';
import {useGetFileMutation} from '../../../../store/services/fileApiWs';
import {useAppSelector} from '../../../../hooks/typedReduxHooks';


// * modify file (rm + echo {content} >> file)
// * delete file (rm )
// * create file (touch)
// * download file

interface props {
	filename: string;
	onClose: () => void;
}

const FileMenu: FC<props> = ({filename, onClose}) => {

	const {path} = useParams();
	const fileContents = useAppSelector(state => state.fileContents);
	const [getFileContent] = useGetFileMutation();


	const onOpenFileHandler = () => {
		alert('Open file');
	};

	const onRemoveFileHandler = () => {
		alert('Remove file');
	};

	const onDownloadFileHandler = () => {
		alert('Download file');
	};

	const onRenameFileHandler = () => {
		alert('Rename file');
	};

	const menuItems = [{
		onClickFunction: onOpenFileHandler,
		text: 'Open',
		icon: <FolderOpenIcon/>
	}, {
		onClickFunction: onRemoveFileHandler,
		text: 'Remove',
		icon: <ClearIcon sx={{color: 'red'}}/>,
		color: 'red'
	}, {
		onClickFunction: onDownloadFileHandler,
		text: 'Download',
		icon: <DownloadIcon/>
	}, {
		onClickFunction: onRenameFileHandler,
		text: 'Rename',
		icon: <DriveFileRenameOutlineIcon/>
	}];

	return (
		<Box p={1} onClick={onClose}>
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

export default FileMenu;