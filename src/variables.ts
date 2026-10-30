import type ModuleInstance from './main.js'

export type VariablesSchema = {
    selected_input: string
    input_1_active: string
    input_2_active: string
    input_3_active: string
    input_4_active: string
}

export function UpdateVariableDefinitions(self: ModuleInstance): void {
    self.setVariableDefinitions({
        selected_input: { name: 'Selected Input' },
        input_1_active: { name: 'Input 1 Active' },
        input_2_active: { name: 'Input 2 Active' },
        input_3_active: { name: 'Input 3 Active' },
        input_4_active: { name: 'Input 4 Active' },
    })

    self.setVariableValues({
        selected_input: '0',
        input_1_active: 'false',
        input_2_active: 'false',
        input_3_active: 'false',
        input_4_active: 'false',
    })
}