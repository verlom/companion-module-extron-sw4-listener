import {
    InstanceBase,
    InstanceStatus,
    TCPHelper,
    type SomeCompanionConfigField,
} from '@companion-module/base'

import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpdateVariableDefinitions, type VariablesSchema } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions, type ActionsSchema } from './actions.js'
import { UpdateFeedbacks, type FeedbacksSchema } from './feedbacks.js'
import { UpdatePresets } from './presets.js'

export type ModuleSchema = {
    config: ModuleConfig
    secrets: undefined
    actions: ActionsSchema
    feedbacks: FeedbacksSchema
    variables: VariablesSchema
}

export { UpgradeScripts }

export default class ModuleInstance extends InstanceBase<ModuleSchema> {
    config!: ModuleConfig
    private tcp: TCPHelper | undefined
    private receiveBuffer = ''

    constructor(internal: unknown) {
        super(internal)
    }

    async init(config: ModuleConfig): Promise<void> {
        this.config = config
        this.updateActions()
        this.updateFeedbacks()
        this.updatePresets()
        this.updateVariableDefinitions()
        this.connectToExtron()
    }

    private connectToExtron(): void {
        this.tcp?.destroy()
        this.updateStatus(InstanceStatus.Connecting)
        this.tcp = new TCPHelper(this.config.host, this.config.port)

        this.tcp.on('connect', () => {
            this.receiveBuffer = ''
            this.updateStatus(InstanceStatus.Ok)
            this.log('info', 'Connected to Extron serial listener')
        })

        this.tcp.on('data', (data: Buffer) => {
            this.receiveBuffer += data.toString('utf8')
            this.processReceivedData()
        })

        this.tcp.on('error', (error: Error) => {
            this.log('error', 'TCP error: ' + error.message)
        })

        this.tcp.on('status_change', (status, message) => {
            this.updateStatus(status, message)
        })
    }

    private processReceivedData(): void {
        const lines = this.receiveBuffer.split('\n')
        this.receiveBuffer = lines.pop() ?? ''

        for (const line of lines) {
            const message = line.trim()
            const match = message.match(/^Chn([1-4])$/)
            if (!match) continue

            const selected = match[1]

            this.setVariableValues({
                selected_input: selected,
                input_1_active: selected === '1' ? 'true' : 'false',
                input_2_active: selected === '2' ? 'true' : 'false',
                input_3_active: selected === '3' ? 'true' : 'false',
                input_4_active: selected === '4' ? 'true' : 'false',
            })

            this.log('info', 'Extron selected input ' + selected)
        }
    }

    async destroy(): Promise<void> {
        this.tcp?.destroy()
        this.tcp = undefined
        this.log('debug', 'destroy')
    }

    async configUpdated(config: ModuleConfig): Promise<void> {
        this.config = config
        this.connectToExtron()
    }

    getConfigFields(): SomeCompanionConfigField[] {
        return GetConfigFields()
    }

    updateActions(): void {
        UpdateActions(this)
    }

    updateFeedbacks(): void {
        UpdateFeedbacks(this)
    }

    updatePresets(): void {
        UpdatePresets(this)
    }

    updateVariableDefinitions(): void {
        UpdateVariableDefinitions(this)
    }
}