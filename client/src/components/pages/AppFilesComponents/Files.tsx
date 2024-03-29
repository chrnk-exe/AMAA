import React, {useEffect} from 'react';
import {Box, List, ListItemButton, ListItemIcon, ListItemText} from '@mui/material';
import {useNavigate, useParams} from 'react-router';
import Typography from '@mui/material/Typography';
import {useGetFileMutation, useGetDirectoriesMutation} from '../../../store/services/fileApiWs';
import {useAppSelector, useAppDispatch} from '../../../hooks/typedReduxHooks';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import FolderIcon from '@mui/icons-material/Folder';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import {clearFilesystem} from '../../../store/slices/dirSlice';

const icons = {
	'link': <ArrowRightAltIcon/>,
	'directory': <FolderIcon/>,
	'file': <FileOpenIcon/>
};

const Files = () => {
	const {path} = useParams();
	const dispatch = useAppDispatch();

	const [getDirectories] = useGetDirectoriesMutation();
	const [getFileContent] = useGetFileMutation();
	const files = useAppSelector(state => state.files);
	const lastFile = useAppSelector(state => state.fileContents[state.fileContents.length - 1]);
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(clearFilesystem());
		getDirectories(path ? path : '/');
	}, [path]);

	const clickHandler = (objType: objectType | undefined, filename: string) => {
		if (objType && path) {
			const resultPath = encodeURIComponent(path[path.length - 1] !== '/' ? path + '/' + filename : path + filename);
			if (objType === 'directory') {
				navigate(`/filesystem/${resultPath}`);
			} else if (objType === 'file') {
				console.log(decodeURIComponent(resultPath));
				getFileContent(decodeURIComponent(resultPath));
			} else {
				alert('Not implemented!');
			}
		}
	};


	return (
		<Box display={'grid'} gridTemplateColumns={'3fr 8fr'} p={1}>
			<Box sx={{borderRight: 1, borderColor: 'divider'}}>
				<Box>
					<Typography>
						Current path: {path}
					</Typography>
				</Box>
				<Box>
					<List>
						{files.map((file, index) => (
							<ListItemButton key={index} onClick={() => clickHandler(file?.objectType, file.fileName)}>
								<ListItemIcon>
									{
										file?.objectType && icons[file?.objectType]
									}
								</ListItemIcon>
								<ListItemText>{file.fileName} {file?.link && `(${file?.link})`}</ListItemText>
							</ListItemButton>
						))}
					</List>
				</Box>
			</Box>
			<Box ml={1}>
				File content
				<pre>
					{atob(lastFile.data)}
				</pre>
			</Box>
		</Box>
	);
};

export default Files;