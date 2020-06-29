import { mergeFiles } from './mergeFiles'
import commander from 'commander'
import path from 'path'
import fs from 'fs'

/**
 * Entry point for the application
 *
 * @export
 * @param {string[]} args
 * @param {Command} program
 */
export function main(args: string[], program: commander.Command): void {
  program
    .version(
      JSON.parse(
        fs.readFileSync(path.resolve(__dirname, '../package.json')).toString()
      ).version
    )
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
    resolveFilePathOptions(program.args),
    program.path,
    program.allowUndefined,
    program.override
  )
  // write out the result
  console.log(result)
}

/**
 * Normalize partial path options
 *
 * @param {string} paths
 * @returns {string[]} Array of partial paths to be merged
 */
function parsePartialPathOptions(paths: string): string[] {
  return paths.split(',').map((path: string) => path.trim())
}

/**
 * Resolve file path options
 *
 * @export
 * @param {string[]} paths
 * @returns {string[]}
 */
export function resolveFilePathOptions(paths: string[]): string[] {
  return paths.map((p) => path.resolve(p))
}
