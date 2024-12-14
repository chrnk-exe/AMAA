import React, {type FC, useEffect, useState} from 'react';
import {
	Box,
	Button,
	Modal,
	TableHead,
	TextField,
	Typography,
	Table,
	TableCell,
	TableRow,
	TableBody
} from '@mui/material';
import { useDbQueryMutation } from '../../../store/services/javaFileApiHttp';
import SendIcon from '@mui/icons-material/Send';
import RestoreIcon from '@mui/icons-material/Restore';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '80%',
	height: '80%',
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

const SQLQueries = {
	getTables: 'SELECT * FROM sqlite_master;'
};

interface props {
	open: boolean,
	handleClose: () => void,
	filename: string,
	identifier: string | undefined
}


const DbView: FC<props> = ({open, handleClose, filename, identifier}) => {
	const [SQLRequest] = useDbQueryMutation();
	const [header, setHeader] = useState<Array<string>>([]);
	const [rows, setRows] = useState<Array<Array<string>>>([[]]);
	const [SQLQuery, setSQLQuery] = useState('SELECT * FROM sqlite_master;');

	useEffect(() => {
		const getData = async (appIdentifier: string) => {
			const result = await SQLRequest({identifier: appIdentifier, dbFile: filename, dbQuery: SQLQueries.getTables});
			if ('data' in result) {
				const {data} = result;
				const header = data.data[0];
				const rows = data.data.slice(1);
				setHeader(header);
				setRows(rows);
			}
		};

		if(identifier) {
			getData(identifier);
		}

	}, [open]);

	const sendSQLQuery = async (query?: string) => {
		if (identifier) {
			const result = await SQLRequest({identifier, dbFile: filename, dbQuery: query ? query : SQLQuery});
			if ('data' in result) {
				const {data} = result;
				const header = data.data[0];
				const rows = data.data.slice(1);
				setHeader(header);
				setRows(rows);
			}
		}
	};


	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<Box sx={style} display={'flex'} flexDirection={'column'}>
				<Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'} gap={2}>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						Имя файла: {filename}
					</Typography>
				</Box>
				<Box display={'flex'} gap={1} >
					<TextField
						value={SQLQuery}
						onChange={e => setSQLQuery(e.target.value)}
						sx={{
							width: '75%'
						}}
					/>
					<Button onClick={() => sendSQLQuery()} startIcon={<SendIcon/>}/>
					<Button onClick={() => sendSQLQuery(SQLQueries.getTables)} startIcon={<RestoreIcon/>}/>
				</Box>
				<Table>
					<TableHead>
						{
							header.map(columnName => (
								<TableCell key={columnName}>{columnName}</TableCell>
							))
						}
					</TableHead>
					<TableBody>
						{
							rows.map((row, index) => (
								<TableRow key={index}>
									{
										row.map((item, index) => (
											<TableCell key={index}>{item}</TableCell>
										))
									}
								</TableRow>
							))
						}
					</TableBody>
				</Table>

			</Box>
		</Modal>
	);
};

export default DbView;