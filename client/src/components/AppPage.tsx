import React, {FC} from 'react';
import logo from '../assets/logo.svg';
import '../styles/App.css';

interface Props {
	devices: Device[]
}
const AppRoutes: FC<Props> = ({devices}) => {
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
                    Edit <code>src/App.tsx</code> and save to reload.
				</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
                    Learn React
				</a>
				{/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
				{//@ts-ignore
					devices.map(device => (<p key={device.impl.id}>{device.impl.id}, {device.impl.name}, {device.impl.type}</p>))
				}
			</header>
		</div>
	);
};

export default AppRoutes;
