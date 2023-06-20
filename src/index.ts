export { If } from './types/misc/If.type'
export { ILoggerColors } from './types/misc/colors.interface'
export { IUpdateState } from './types/misc/updateState.interface'

export { IGiveawaysEvents } from './types/events.interface'
export { DatabaseType } from './types/databaseType.enum'

export {
    DatabaseConnectionOptions, IUpdateCheckerConfiguration,
    IGiveawaysConfiguration, IJSONDatabseConfiguration
} from './types/configurations'

export { checkUpdates } from './lib/util/checkUpdates.function'

export { Emitter } from './lib/util/Emitter'
export { Logger } from './lib/util/Logger'
export { GiveawaysError, GiveawaysErrorCodes, errorMessages } from './lib/util/GiveawaysError'

export { Giveaways } from './Giveaways'
