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
	IconButton, Checkbox, FormControlLabel,
	TextField
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
	const [settings, setSettings] = useState({
		includeHighEntropy: true,
		includeKeywords: true,
		includeRegexes: true,
		includeAllStrings: false,
		entropyLevel: 4.6,
		threads: 4
	});

	const toggleHighEntropy = () => {
		setSettings(settings => ({
			...settings,
			includeHighEntropy: !settings.includeHighEntropy
		}));
	};

	const toggleKeywords = () => {
		setSettings(settings => ({
			...settings,
			includeKeywords: !settings.includeKeywords
		}));
	};

	const toggleRegexes = () => {
		setSettings(settings => ({
			...settings,
			includeRegexes: !settings.includeRegexes
		}));
	};

	const toggleAllStrings = () => {
		setSettings(settings => ({
			...settings,
			includeAllStrings: !settings.includeAllStrings
		}));
	};

	const setEntropyLevel = (newEntrypyLevel: number) => (
		setSettings(settings => ({
			...settings,
			entropyLevel: newEntrypyLevel
		}))
	);

	const setThreads = (threads: number) => (
		setSettings(settings => ({
			...settings,
			threads
		}))
	);


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
			formData.append('includeHighEntropy', settings.includeHighEntropy.toString());
			formData.append('includeKeywords', settings.includeKeywords.toString());
			formData.append('includeRegexes', settings.includeRegexes.toString());
			formData.append('includeAllStrings', settings.includeAllStrings.toString());
			formData.append('entropyLevel', settings.entropyLevel.toString());
			formData.append('threads', settings.threads.toString());
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
		<Box m={1} display={'flex'} justifyContent={'space-evenly'} alignItems={'flex-start'}>
			<Box
				display={'flex'}
				justifyContent={'space-evenly'}
				alignItems={'flex-start'}
				p={1}
				mr={1}
				gap={2}
				sx={{width: '100%', bgcolor:'#FFFFFF'}}
				flexDirection={'column'}>
				<Typography variant={'h5'}>
					Сканнеры
				</Typography>
				<Box display={'flex'} flexDirection={'column'} justifyContent={'flex-start'} alignItems={'flex-start'} gap={2}>
					<Typography>
						Статический анализатор
					</Typography>
					<Button variant={'contained'} startIcon={<CloudUploadIcon/>} component="label" >
						Загрузить .APK для статического анализа
						<VisuallyHiddenInput
							type="file"
							onChange={handleFileChange}
							multiple
						/>
					</Button>
					{
						staticState &&
						(<Typography>
							Состояние анализа: {staticState}
						</Typography>)
					}

				</Box>
				<Box display={'flex'} flexDirection={'column'} justifyContent={'flex-start'} alignItems={'center'} gap={2}>
					<Box display={'flex'} justifyContent={'flex-start'} alignItems={'flex-start'} gap={2} sx={{width: '100%'}}
						 flexDirection={'column'}>
						<Typography>
							Динамический анализатор
						</Typography>
						<FormControl fullWidth sx={{bgcolor: '#FFF'}}>
							<InputLabel>Выберите приложение </InputLabel>
							<Select
								value={selectedApp}
								label="Выберите приложение"
								onChange={handleChangeApp}
							>
								{
									apps.map(app => (<MenuItem key={app.identifier} value={app.identifier}>{app.name}</MenuItem>))
								}
							</Select>
						</FormControl>
						<Button variant={'contained'} onClick={() => startDynamicAnalyze(selectedApp)}>Начать динамический анализ</Button>
					</Box>
					{
						dynamicState &&
						(<Typography>
							Состояние анализа: {dynamicState}
						</Typography>)
					}

				</Box>
				<Box display={'flex'} flexDirection={'column'} gap={2}>
					<Typography variant={'h5'}>
						Настройки поиска секретов
					</Typography>
					<FormControlLabel
						control={<Checkbox
							checked={settings.includeHighEntropy}
							onChange={toggleHighEntropy}
						/>}
						label={'Сохранять строки с высокой энтропией'}/>
					<FormControlLabel
						control={<Checkbox
							checked={settings.includeKeywords}
							onChange={toggleKeywords}
						/>}
						label={'Сохранять строки с подходящими ключевыми словами'}/>
					<FormControlLabel
						control={<Checkbox
							checked={settings.includeRegexes}
							onChange={toggleRegexes}
						/>}
						label={'Сохранять подозрительные строки (regex)'}/>
					<FormControlLabel
						control={<Checkbox
							checked={settings.includeAllStrings}
							onChange={toggleAllStrings}
						/>}
						label={'Сохранять все строки'}/>
					<TextField
						type={'number'}
						label={'Уровень энтропии'}
						value={settings.entropyLevel}
						onChange={(e) => setEntropyLevel(+e.target.value)}
						inputProps={{
							step: '0.1'
						}}/>
					<TextField
						type={'number'}
						label={'Количество потоков'}
						value={settings.threads}
						onChange={(e) => setThreads(+e.target.value)}
						inputProps={{
							step: '1'
						}}/>


				</Box>
			</Box>
			<Box p={2} sx={{bgcolor: '#FFFFFF'}}>
				<Typography variant={'h6'}>
					Результаты сканирований
				</Typography>
				<Table>
					<TableHead>
						<TableCell>ID</TableCell>
						<TableCell>Название файла/приложения</TableCell>
						<TableCell>Имя пакета</TableCell>
						<TableCell>Версия</TableCell>
						<TableCell>Тип сканирования</TableCell>
						<TableCell>Отчёт</TableCell>
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