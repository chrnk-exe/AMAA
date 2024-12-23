import React, {FC} from 'react';
import logo from '../../assets/logo.svg';
import '../../styles/App.css';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import TerminalIcon from '@mui/icons-material/Terminal';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import { FormControl, InputLabel, List, ListItem, ListItemIcon, ListItemText, MenuItem, Select } from '@mui/material';


interface Props {
	devices: Device[]
}
const AppRoutes: FC<Props> = () => {
	return (
		<Box display={'flex'} alignItems={'flex-start'} justifyContent={'center'} height={'100%'} flexDirection={'column'} sx={{
			pl: 5,
			bgcolor: '#FFFFFF'
		}}>
			{/* Main title */}
			<Box>
				<Typography variant={'h4'}>
					Анализатор защищённости Android приложений.
				</Typography>
			</Box>
			{/* Instructions */}
			<Box>
				<Box>
					<Typography>1. Необходимо решить, в какой среде будет тестироваться приложение:</Typography>
					<List>
						<ListItem>
							<ListItemIcon><TerminalIcon/></ListItemIcon>
							<ListItemText><Link href={'https://github.com/LSPosed/MagiskOnWSALocal'}>WSA с Root-правами</Link>
								{' '}(Рекомендуется Windows 11)</ListItemText>
						</ListItem>
						<ListItem>
							<ListItemIcon><TerminalIcon/></ListItemIcon>
							<ListItemText><Link href={'https://www.genymotion.com/'}>Genymotion</Link></ListItemText>
						</ListItem>
						<ListItem>
							<ListItemIcon><TerminalIcon/></ListItemIcon>
							<ListItemText><Link href={'https://developer.android.com/studio'}>Android Studio</Link></ListItemText>
						</ListItem>
						<ListItem>
							<ListItemIcon><PhoneAndroidIcon/></ListItemIcon>
							<ListItemText>Зарутованное живое устройство (Рекомендуется)</ListItemText>
						</ListItem>
					</List>
				</Box>
			</Box>
			<Box>
				<Typography color={'textPrimary'}>
					2. Неоходимо с помощью <Link href={'https://developer.android.com/tools/releases/platform-tools'}>ADB</Link> установить
					на эмулятор/живое устройство <Link href={'https://github.com/frida/frida/releases'}>frida-server</Link>.
					Сервер необходимо подбирать под архитектуру своего устройства, узнать её можно командой <code>uname -m</code>
				</Typography>
				<Typography>
					Запустить сервер необходимо от прав суперпользователя. Пример последовательности комманд представлен ниже.
				</Typography>
				<Box display={'flex'} flexDirection={'column'} gap={1}>
					<code>adb push ./frida-server-16.2.1-android-arm /sdcard/frida-server</code>
					<code>adb shell</code>
					<code>su</code>
					<code>mv /sdcard/frida-server /data/local/tmp/frida-server</code>
					<code>chmod +x /data/local/tmp/frida-server</code>
					<code>./data/local/tmp/frida-server</code>
				</Box>
			</Box>
			<Box mt={1}>
				<Typography>
					Устройство выбирается в Select-меню во вкладке Analyze, далее в остальных вкладках выбирается именно оно.
				</Typography>
			</Box>
		</Box>
	);
};

export default AppRoutes;
