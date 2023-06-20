import { DatabaseType, Giveaways } from './index'

const giveaways = new Giveaways(null as any, {
    database: DatabaseType.ENMAP,
    connection: {
        name: 'giveaways',
        dataDir: './data/enmap',
        wal: false
        // path: './data/json/giveaways.json'
    }
})

giveaways.on('ready', async () => {
    console.log('Giveaways module is ready!')

    await giveaways.database.set('test', 123)
    await giveaways.database.set('test123.testing', 'zzzzzzzzzzzz')
    await giveaways.database.set('test321.test.test1', 321)

    // console.log(
    // await giveaways.database.get('test'),
    // await giveaways.database.get('test123.testing'),
    // await giveaways.database.get('test321.test.test1')
    // )

    console.log(await giveaways.database.all())

})
