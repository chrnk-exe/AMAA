import React, {FC, useState} from 'react';
import Box from '@mui/material/Box';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import Typography from '@mui/material/Typography';
import {
	Button,
	Checkbox,
	FormControl, FormControlLabel,
	InputLabel,
	ListItemText,
	MenuItem,
	OutlinedInput,
	Select, SelectChangeEvent,
} from '@mui/material';
import { useAppSelector } from '../../hooks/typedReduxHooks'; //Example style, you can use another
import { useSpawnApplicationWithScriptsMutation } from '../../store/services/appApi';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

const FridaScripting: FC = () => {

	const apps = useAppSelector(state => state.apps.apps);
	const [selectedApp, setSelectedApp] = useState('');
	const [spawnApp] = useSpawnApplicationWithScriptsMutation();

	const bypasses = useAppSelector(state => state.scripts);
	console.log(bypasses);

	const [includeFollowingScript, setIncludeScript] = useState(false);
	const [selectedBypasses, setSelectedBypasses] = useState<string[]>([]);
	// code with default script
	const [code, setCode] = useState('Java.perform(function () {\n' +
		'  var currentActivity;\n' +
		'\n' +
		'  // Intercept the call to the \'onCreate\' method of all the Activities\n' +
		'  var Activity = Java.use(\'android.app.Activity\');\n' +
		'  Activity.onCreate.overload(\'android.os.Bundle\').implementation = function (savedInstanceState) {\n' +
		'\n' +
		'    // Save the reference to the current activity\n' +
		'    this.onCreate.overload(\'android.os.Bundle\').call(this, savedInstanceState);\n' +
		'\n' +
		'    currentActivity = this;\n' +
		'    console.log("The current Activity is: " + currentActivity.getClass().getName());\n' +
		'\n' +
		'    let bundle = currentActivity.getIntent().getExtras();\n' +
		'    console.log(\'intent:\', currentActivity.getIntent());\n' +
		'    if (bundle) {\n' +
		'      var keys = bundle.keySet()\n' +
		'      var iterator = keys.iterator()\n' +
		'      while (iterator.hasNext()) {\n' +
		'        var k = iterator.next().toString()\n' +
		'        var v = bundle.get(k)\n' +
		'        console.log("\\t" + v.getClass().getName())\n' +
		'        console.log("\\t" + k + \' : \' + v.toString())\n' +
		'      }\n' +
		'    }\n' +
		'  }\n' +
		'\n' +
		'});\n');

	const handleChangeBypasses = (event: SelectChangeEvent<typeof selectedBypasses>) => {
		const {
			target: { value },
		} = event;
		setSelectedBypasses(
			// On autofill we get a stringified value.
			typeof value === 'string' ? value.split(',') : value,
		);
	};

	const handleChangeApp = (event: SelectChangeEvent<string>) => {
		const {
			target: { value },
		} = event;

		setSelectedApp(value);
	};

	const handleStart = async () => {
		const currentCode = includeFollowingScript ? code : undefined;
		const currentScripts = selectedBypasses;
		const appPackageName = selectedApp;
		const result = await spawnApp({
			code: currentCode,
			scripts: currentScripts,
			appPackageName
		});
		console.log(result);
	};

	return (
		<Box p={1}>
			<Typography variant={'h3'}>JS Editor</Typography>
			<Box>
				<Typography>
					Вы можете написать свой скрипт и добавить его вместе с используемыми.
				</Typography>
			</Box>
			<Box display={'flex'} alignItems={'center'}>
				<FormControl sx={{ m: 1, width: 400, bgcolor: '#FFF' }}>
					<InputLabel>Default tests</InputLabel>
					<Select
						multiple
						value={selectedBypasses}
						onChange={handleChangeBypasses}
						input={<OutlinedInput label="Default tests" />}
						renderValue={(selected) => selected.join(', ')}
						MenuProps={MenuProps}
					>
						{bypasses.map((bypass) => (
							<MenuItem key={bypass} value={bypass}>
								<Checkbox checked={selectedBypasses.indexOf(bypass) > -1} />
								<ListItemText primary={bypass} />
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<FormControlLabel
					value="Включить ниженаписанный скрипт в запуск."
					control={<Checkbox
						checked={includeFollowingScript}
						onChange={() => setIncludeScript(!includeFollowingScript)}
						inputProps={{ 'aria-label': 'controlled' }}
					/>}
					label="Включить ниженаписанный скрипт в запуск."
					labelPlacement="end"
				/>

			</Box>
			<Box display={'grid'} gridTemplateColumns={'6fr 3fr'} gap={2}>
				<Box sx={{
					backgroundColor: '#FFFFFF'
				}}>
					<Editor
						value={code}
						onValueChange={code => setCode(code)}
						highlight={code => highlight(code, languages.js)}
						padding={10}
						style={{
							fontFamily: '"Fira code", "Fira Mono", monospace',
							fontSize: 14,
						}}
					/>
				</Box>
				<Box>
					<FormControl fullWidth sx={{bgcolor: '#FFF'}}>
						<InputLabel>Application</InputLabel>
						<Select
							value={selectedApp}
							label="Application"
							onChange={handleChangeApp}
						>
							{
								apps.map(app => (<MenuItem key={app.identifier} value={app.identifier}>{app.name}</MenuItem>))
							}
						</Select>
					</FormControl>
					<Box mt={1}>
						<Button variant={'contained'} onClick={handleStart}>
							Start application!
						</Button>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default FridaScripting;