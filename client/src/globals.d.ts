// todo: change declaration on

declare module '*.css';

declare type Devices = Device[]
declare interface Process {
    pid: number
    name: string
    parameters: object
}

declare interface Device {
    impl: Impl
    bus: Bus
    spawnAdded: NamedSignals<'spawn-added'>
    spawnRemoved: NamedSignals<'spawn-removed'>
    childAdded: NamedSignals<'child-added'>
    childRemoved: NamedSignals<'child-removed'>
    processCrashed: NamedSignals<'process-crashed'>
    output: NamedSignals<'output'>
    uninjected: NamedSignals<'uninjected'>
    lost: NamedSignals<'lost'>
}

declare interface NamedSignals<signalName> {
    signals: Signals
    name: signalName
}
declare interface Impl {
    id: string
    name: string
    icon?: Icon
    type: string
    bus: Bus
    isLost: boolean
    signals: Signals
}

declare interface Icon {
    format: string
    width: number
    height: number
    image: Image
}

declare interface Image {
    type: string
    data: number[]
}

declare interface Signals {any}

declare type Apps = App[]

declare interface App {
    identifier: string,
    name: string,
    pid: number,
    parameters: object
}

declare interface shell {
    pid: number // id
    output: string[]
    deviceId: string
}

declare interface CommandRequest {
    pid: number,
    cmd: string
}

declare interface KillShellRequest {
    pid: number
}

declare interface CommandResultResponse {
    pid: number
    commandOutput: string
}

declare interface SpawnedShellsResponse {
    pid: number,
    deviceId: string,
    output: string
}

declare type ShellsListResponse = SpawnedShellsResponse[]

declare interface KillMessageResponse {
    pid?: number
    message: string
}

