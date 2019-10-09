import { mergeFiles } from './mergeFiles'
import { Command } from 'commander'
import path from 'path'

export function main(args: string[], program: Command): void {
  program
    .version('1.0.0')
    .option(
      '-p, --path [paths]',
      'Partial merging by using specific object paths. Separate paths by comma.',
      parsePartialPathOptions
    )
    .option('-u, --allow-undefined', 'Allow undefined paths.')
    .option('-o, --override', 'Override paths instead of merging.')

  program.parse(args)

  // show help if there are no args
  if (args.length < 3) {
    program.help()
  }

  // do the work
  const result = mergeFiles(
    parseFilePathOptions(program.args),
    program.path,
    program.allowUndefined,
    program.override
  )
  console.log(result)
}

function parsePartialPathOptions(paths: string): string[] {
  return paths.split(',').map((path: string) => path.trim())
}

export function parseFilePathOptions(paths: string[]): string[] {
  return paths.map(p => path.resolve(p))
}
