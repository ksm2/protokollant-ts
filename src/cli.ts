import { create, exec } from 'commandpost'
import fs from 'fs'
import path from 'path'
import { Changelog } from './Changelog'
import { parseChangelog } from './parseChangelog'
import { printChangelog } from './printChangelog'

function getFilename(): string {
  if (!cmd.parsedOpts.changelog.length) {
    throw new Error('Please specify a changelog file.')
  }

  return path.resolve(process.cwd(), cmd.parsedOpts.changelog[0])
}

async function withChangelog(callbackfn: (changelog: Changelog) => Promise<void>): Promise<void> {
  const filename = getFilename()
  const input = await fs.promises.readFile(filename, 'utf8')
  const changelog = parseChangelog(input)

  await callbackfn(changelog)

  const output = printChangelog(changelog)
  await fs.promises.writeFile(filename, output)
}

const cmd = create<{ changelog: [string] }, {}>('protokollant')
  .option('--changelog [changelog]', 'Specifies the location of the CHANGELOG.md', 'CHANGELOG.md')
  .description('Manages CHANGELOG.md files')

cmd
  .subCommand<{}, { message: string[] }>('changed <message...>')
  .description('Adds a new unreleased change')
  .action(
    async (opts, args) =>
      await withChangelog(async (changelog) => {
        changelog.changed(args.message.join(' '))
      })
  )

cmd
  .subCommand<{}, { message: string[] }>('added <message...>')
  .description('Adds a new unreleased addition')
  .action(
    async (opts, args) =>
      await withChangelog(async (changelog) => {
        changelog.added(args.message.join(' '))
      })
  )

cmd
  .subCommand<{}, { message: string[] }>('fixed <message...>')
  .description('Adds a new unreleased fix')
  .action(
    async (opts, args) =>
      await withChangelog(async (changelog) => {
        changelog.fixed(args.message.join(' '))
      })
  )

cmd
  .subCommand<{}, { message: string[] }>('removed <message...>')
  .description('Adds a new unreleased removal')
  .action(
    async (opts, args) =>
      await withChangelog(async (changelog) => {
        changelog.removed(args.message.join(' '))
      })
  )

cmd
  .subCommand<{}, { version: string }>('release <version>')
  .description('Releases the current unreleased changes')
  .action(
    async (opts, args) =>
      await withChangelog(async (changelog) => {
        changelog.release(args.version)
      })
  )

export function cli(argv: string[]): Promise<any> {
  return exec(cmd, argv)
}
