export { If, Optional, FindCallback, MapCallback } from './types/misc/utils'
export { ILoggerColors } from './types/misc/colors.interface'

export { IGiveawaysEvents } from './types/giveawaysEvents.interface'
export { DatabaseType } from './types/databaseType.enum'

export {
    DatabaseConnectionOptions, IUpdateCheckerConfiguration,
    IGiveawaysConfiguration, IJSONDatabseConfiguration
} from './types/configurations'

export { checkUpdates } from './lib/util/functions/checkUpdates.function'

export { Emitter } from './lib/util/classes/Emitter'
export { Logger } from './lib/util/classes/Logger'
export { GiveawaysError, GiveawaysErrorCodes, errorMessages } from './lib/util/classes/GiveawaysError'

export { Giveaways } from './Giveaways'
