// todo: change declaration on
declare interface Device {
    id: string
    name: string
    type: string
    icon: null | Icon
}

declare interface Icon {
    format: string
    width: number
    height: number
    image: Buffer
}