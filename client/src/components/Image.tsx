import React, {useState, useEffect, FC} from 'react';
import * as buffer from 'buffer';
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

export default Image;