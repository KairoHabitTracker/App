import {defaultConfig} from '@tamagui/config/v4'
import {createTamagui} from 'tamagui'

export const config = createTamagui(defaultConfig)

type CustomConfig = typeof config

// ensure types work
declare module 'tamagui' {
    interface TamaguiCustomConfig extends CustomConfig {
    }
}