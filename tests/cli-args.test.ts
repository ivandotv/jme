import { main } from '../src/main'
import commander from 'commander'
import { mergeFiles } from '../src/mergeFiles'
import path from 'path'
import fs from 'fs'

global.console.log = () => {}
jest.mock('../src/mergeFiles')

let args: string[], program: commander.Command

beforeEach(() => {
  jest.clearAllMocks()
  args = ['node_exec', 'path_to_file']
  program = new commander.Command()
})

describe('CLI args', () => {
  test('pass and parse all arguments', () => {
    const filePath1 = 'path/to/files/test-1.json'
    const filePath2 = 'path/to/files/test-2.json'
    const mergePaths = 'data.p2.title,data.p3.tags'
    args.push(filePath1)
    args.push(filePath2)
    args.push('-p', mergePaths)
    args.push('-u')
    args.push('-o')

    main(args, program)

    expect(mergeFiles).toBeCalledTimes(1)
    expect(mergeFiles).toBeCalledWith(
      [path.resolve(filePath1), path.resolve(filePath2)],
      mergePaths.split(','),
      true,
      true
    )
  })
  test('if no arguments are passed, show program help', () => {
    // @ts-ignore
    program.help = jest.fn()

    main(args, program)

    expect(program.help).toBeCalled()
  })
  test('Version number is the same as the package.json version number', () => {
    const version = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../package.json')).toString()
    ).version

    program.exitOverride()

    args.push('--version')

    expect(() => {
      main(args, program)
    }).toThrow(version)
  })
})
