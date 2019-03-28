import { create, exec } from 'commandpost'
import fs from 'fs'
import path from 'path'
import { Changelog } from './Changelog'
import { parse } from './parse'
import { stringify } from './stringify'

function getFilename() {
  if (!cmd.parsedOpts.changelog.length)
    throw new Error('Please specify a changelog file.')

  return path.resolve(process.cwd(), cmd.parsedOpts.changelog[0])
}

function readFile(filename: fs.PathLike): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, text) => {
      if (err)
        return reject(err)
      resolve(text)
    })
  })
}

function writeFile(filename: fs.PathLike, data: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, data, 'utf8', (err) => {
      if (err)
        return reject(err)
      resolve()
    })
  })
}

async function withChangelog(callbackfn: (changelog: Changelog) => Promise<void>): Promise<void> {
  const filename = getFilename()
  const input = await readFile(filename)
  const changelog = parse(input)

  await callbackfn(changelog)

  const output = stringify(changelog)
  await writeFile(filename, output)
}

const cmd = create<{ changelog: [string] }, {}>('protokollant')
  .option('--changelog [changelog]', 'Specifies the location of the CHANGELOG.md', 'CHANGELOG.md')
  .description('Manages CHANGELOG.md files')

cmd
  .subCommand<{}, { message: string[] }>('changed <message...>')
  .description('Adds a new unreleased change')
  .action(async (opts, args) => await withChangelog(async (changelog) => {
    changelog.changed(args.message.join(' '))
  }))

cmd
  .subCommand<{}, { message: string[] }>('added <message...>')
  .description('Adds a new unreleased addition')
  .action(async (opts, args) => await withChangelog(async (changelog) => {
    changelog.added(args.message.join(' '))
  }))

cmd
  .subCommand<{}, { message: string[] }>('fixed <message...>')
  .description('Adds a new unreleased fix')
  .action(async (opts, args) => await withChangelog(async (changelog) => {
    changelog.fixed(args.message.join(' '))
  }))

cmd
  .subCommand<{}, { message: string[] }>('removed <message...>')
  .description('Adds a new unreleased removal')
  .action(async (opts, args) => await withChangelog(async (changelog) => {
    changelog.removed(args.message.join(' '))
  }))

cmd
  .subCommand<{}, { version: string }>('release <version>')
  .description('Releases the current unreleased changes')
  .action(async (opts, args) => await withChangelog(async (changelog) => {
    changelog.release(args.version)
  }))

export function cli(argv: string[]): Promise<any> {
  return exec(cmd, argv)
}
