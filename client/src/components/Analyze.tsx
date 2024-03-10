import React, { FC, useState, useEffect } from 'react';
import { Box, FormControl, SelectChangeEvent } from '@mui/material';
import { useGetDeviceListQuery, useLazySelectDeviceQuery } from '../store/services/deviceApi';
import { InputLabel, MenuItem, Select, Icon } from '@mui/material';
import * as buffer from 'buffer';
import { useAppSelector } from '../hooks/typedReduxHooks';
import {setDevice} from '../store/slices/currentDeviceReducer';
import { useGetAppsQuery } from '../store/services/appApi';
window.Buffer = buffer.Buffer;


interface ImageProps {
	image?: number[]
	deviceId: string
	w: number
	h: number
}

const Image: FC<ImageProps> = ({image, deviceId, w, h}) => {
	const [imageData, setImageData] = useState<string>('');

	useEffect(() => {
		if (image){
			// console.log(image);
			const arrayBufferView = new Uint8Array( image );
			// console.log(arrayBufferView);
			const blob = new Blob( [ arrayBufferView ], { type: 'image/jpeg' } );
			// console.log(blob);
			setImageData(Buffer.from(arrayBufferView).toString('base64'));
			// const url = URL.createObjectURL( blob );
			// const img = document.getElementById( `deviceIcon_${deviceId}` ) as HTMLImageElement | null;
			// if (img){
			// 	img.src = url;
			// 	img.onload = () => URL.revokeObjectURL( url );
			// }
		}
	}, []);

	return (<img id={`deviceIcon_${deviceId}`} src={`data:image/png;base64,${imageData}`} width={w} height={h} alt={''}/>);
};


const Analyze: FC = () => {
	const { data } = useGetDeviceListQuery();
	const [selectDevice, selectedDevice] = useLazySelectDeviceQuery();
	const [deviceLabel, setDeviceLabel] = useState<string>('');
	const device = useAppSelector(state => state.device);



	const onSelectDevice = async (e: SelectChangeEvent<string>) => {
		const deviceId = e.target.value as string;
		if (data){
			const deviceToSet = data.find(device => device.impl.id === deviceId);
			if(deviceToSet){
				setDevice(deviceToSet);
				setDeviceLabel(deviceId);
				const apps = (await selectDevice(deviceId)).data;
				console.log(apps);
			}
		}
	};


	return (
		<Box sx={{m: 2}}>
			<FormControl sx={{minWidth: '180px'}}>
				<InputLabel id="SelectDevice">Select Device</InputLabel>
				<Select
					labelId="SelectDevice"
					id="SelectDevice"
					value={deviceLabel}
					label="Select device"
					onChange={onSelectDevice}
					sx={{bgcolor: '#FFFFFF'}}
				>
					{
						data && data.map(device =>
							(<MenuItem key={device.impl.id} value={device.impl.id}>
								<Image image={device.impl.icon?.image.data} deviceId={device.impl.id} w={16} h={16}/>
								{device.impl.name}
							</MenuItem>)
						)
					}
				</Select>
			</FormControl>
		</Box>
	);
};

export default Analyze;