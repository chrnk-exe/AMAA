// todo: change declaration on

declare module '*.css';
// react xml viewer
declare module 'react-xml-viewer'
// prismjs for js editor
declare module 'prismjs/components/prism-core';

declare type Devices = Device[]

declare interface Process {
	pid: number;
	name: string;
	parameters: object;
}

declare interface Device {
	impl: Impl;
	bus: Bus;
	spawnAdded: NamedSignals<'spawn-added'>;
	spawnRemoved: NamedSignals<'spawn-removed'>;
	childAdded: NamedSignals<'child-added'>;
	childRemoved: NamedSignals<'child-removed'>;
	processCrashed: NamedSignals<'process-crashed'>;
	output: NamedSignals<'output'>;
	uninjected: NamedSignals<'uninjected'>;
	lost: NamedSignals<'lost'>;
}

declare interface NamedSignals<signalName> {
	signals: Signals;
	name: signalName;
}

declare interface Impl {
	id: string;
	name: string;
	icon?: Icon;
	type: string;
	bus: Bus;
	isLost: boolean;
	signals: Signals;
}

declare interface Icon {
	format: string;
	width: number;
	height: number;
	image: Image;
}

declare interface Image {
	type: string;
	data: number[];
}

declare interface Signals {
	any;
}

declare type Apps = App[]

declare interface App {
	identifier: string,
	name: string,
	pid: number,
	parameters: object
}

declare interface shell {
	pid: number; // id
	output: string[];
	deviceId: string;
}

declare interface CommandRequest {
	pid: number,
	cmd: string
}

declare interface KillShellRequest {
	pid: number;
}

declare interface CommandResultResponse {
	pid: number;
	commandOutput: string;
}

declare interface SpawnedShellsResponse {
	pid: number,
	deviceId: string,
	output: string
}

declare type ShellsListResponse = SpawnedShellsResponse[]

declare interface KillMessageResponse {
	pid?: number;
	message: string;
}

declare type objectType = 'directory' | 'link' | 'file'

declare interface Directory {
	objectType?: objectType;
	rules: string;
	numberOfLinksToTheContent: number;
	owner: string;
	ownerGroup: string;
	size: number;
	modifiedDate: string;
	modifiedTime: string;
	fileName: string;
	arrow?: string;
	link?: string;
}

declare interface DeviceFile {
	name: string;
	data: string;
}

declare interface DownloadLink {
	filename: string,
	link: string,
}