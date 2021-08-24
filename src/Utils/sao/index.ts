import commander from 'commander'
import { SAO } from 'sao'

export async function runSao(
    sao: SAO,
    program: commander.CommanderStatic
): Promise<void> {
    await sao.run().catch((err) => {
        console.log(`${program.name()} has encountered an error.`)
        console.log()
        console.error('ERROR', err)
        process.exit(1)
    })
}
