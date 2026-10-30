import type { SomeCompanionConfigField } from '@companion-module/base'

export type ModuleConfig = {
    host: string
    port: number
}

export function GetConfigFields(): SomeCompanionConfigField[] {
    return [
        {
            type: 'textinput',
            id: 'host',
            label: 'Generic TCP Serial IP Address',
            width: 8,
            default: '127.0.0.1',
        },
        {
            type: 'number',
            id: 'port',
            label: 'Generic TCP Serial Port',
            width: 4,
            min: 1,
            max: 65535,
            default: 32101,
        },
    ]
}