import React, { ChangeEvent, useState, FormEvent } from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import {
	Typography,
	Button,
	SelectChangeEvent,
	InputLabel,
	Select,
	MenuItem,
	FormControl,
	Table,
	TableHead,
	TableBody,
	TableCell,
	TableRow,
	IconButton
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
	useLazyGetScansQuery,
	useStartStaticAnalyzeMutation,
	useLazyStartDynamicAnalyzeQuery,
	useLazyGetDynamicAnalyzeReportQuery,
	useLazyGetStaticAnalyzeReportQuery, useGetScansQuery,
} from '../../store/services/scanApi';
import { useAppSelector } from '../../hooks/typedReduxHooks';
import DownloadIcon from '@mui/icons-material/Download';

const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1,
});



function StaticAnalyzer() {
	const [file, setFile] = useState<File | null>(null);
	const [selectedApp, setSelectedApp] = useState('');

	const {data} = useGetScansQuery();
	const [getDynamicReport] = useLazyGetDynamicAnalyzeReportQuery();
	const [getStaticReport] = useLazyGetStaticAnalyzeReportQuery();


	const savePdf = (pdfBlob: Blob, scanId: number) => {
		if (!pdfBlob) return;

		const url = window.URL.createObjectURL(pdfBlob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `report_${scanId}.pdf`;
		a.click();
		window.URL.revokeObjectURL(url);
	};

	const handleChangeApp = (event: SelectChangeEvent<string>) => {
		const {
			target: { value },
		} = event;

		setSelectedApp(value);
	};

	const apps = useAppSelector(state => state.apps.apps);
	const {dynamicState, staticState} = useAppSelector(state => state.scans);

	const [startStaticAnalyze] = useStartStaticAnalyzeMutation();
	const [startDynamicAnalyze] = useLazyStartDynamicAnalyzeQuery();

	const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0];
		setFile(selectedFile || null);
		console.log(selectedFile);

		const formData = new FormData();
		if (selectedFile) {
			formData.append('file', selectedFile);
			try {
				const response = await startStaticAnalyze(formData);
			} catch (error) {
				console.error('Ошибка загрузки файла:', error);
			}
		}
	};

	const handleDownloadDynamicReport = async (scanId: number) => {
		const blob = await getDynamicReport(scanId).unwrap();
		savePdf(blob, scanId);
	};

	const handleDownloadStaticReport = async (scanId: number) => {
		const blob = await getStaticReport(scanId).unwrap();
		savePdf(blob, scanId);
	};


	return (
		<Box m={1} display={'flex'} justifyContent={'space-evenly'} alignItems={'center'} flexDirection={'column'}>
			<Box display={'flex'} justifyContent={'space-evenly'} alignItems={'center'} sx={{width: '100%'}}>
				<Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} gap={2}>
					<Typography variant={'h4'}>
						Static analyzer
					</Typography>
					<Button variant={'contained'} startIcon={<CloudUploadIcon/>} component="label" >
						Upload your apk
						<VisuallyHiddenInput
							type="file"
							onChange={handleFileChange}
							multiple
						/>
					</Button>
					<Typography>
						{staticState}
					</Typography>
				</Box>
				<Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} gap={2}>
					<Typography variant={'h4'}>
						Dynamic analyzer
					</Typography>
					<Box display={'flex'} justifyContent={'center'} alignItems={'center'} gap={2} sx={{width: '100%'}}>
						<FormControl fullWidth sx={{bgcolor: '#FFF'}}>
							<InputLabel>Application</InputLabel>
							<Select
								value={selectedApp}
								label="Select application"
								onChange={handleChangeApp}
							>
								{
									apps.map(app => (<MenuItem key={app.identifier} value={app.identifier}>{app.name}</MenuItem>))
								}
							</Select>
						</FormControl>
						<Button variant={'contained'} onClick={() => startDynamicAnalyze(selectedApp)}>Start Analyze </Button>
					</Box>
					<Typography>
						{dynamicState}
					</Typography>
				</Box>
			</Box>
			<Box>
				<Table>
					<TableHead>
						<TableCell>ID</TableCell>
						<TableCell>Application/filename</TableCell>
						<TableCell>Package name</TableCell>
						<TableCell>Version</TableCell>
						<TableCell>Scan type</TableCell>
						<TableCell>Report</TableCell>
					</TableHead>
					<TableBody>
						{
							data && data.map(scanItem => (
								<TableRow key={scanItem.id}>
									<TableCell>{scanItem.id}</TableCell>
									<TableCell>{scanItem.appName}</TableCell>
									<TableCell>{scanItem.packageName}</TableCell>
									<TableCell>{scanItem.version}</TableCell>
									<TableCell>{scanItem.scanType}</TableCell>
									<TableCell>
										<IconButton size={'large'} onClick={() => {
											if (scanItem.scanType === 'static') handleDownloadStaticReport(scanItem.id);
											if (scanItem.scanType === 'dynamic') handleDownloadDynamicReport(scanItem.id);
										}}>
											<DownloadIcon/>
										</IconButton>
									</TableCell>
								</TableRow>
							))
						}
					</TableBody>
				</Table>
			</Box>
		</Box>
	);
}

export default StaticAnalyzer;