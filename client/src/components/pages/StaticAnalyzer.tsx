import React, { ChangeEvent, useState, FormEvent } from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { Typography, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useStartStaticAnalyzeMutation } from '../../store/services/staticAnalyzeApi';

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

	const [startStaticAnalyze] = useStartStaticAnalyzeMutation();

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



	return (
		<Box m={1} display={'flex'} justifyContent={'center'} alignItems={'center'}>
			<Box>
				<Typography variant={'h3'}>
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
			</Box>
		</Box>
	);
}

export default StaticAnalyzer;