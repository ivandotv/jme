import fs from 'fs'
import { mergeFiles } from '../src/mergeFiles'

jest.mock('fs')

let obj1: any, obj2: any, obj3: any

//mocked paths by fs
const path1 = 'path/to/files/test-1.json'
const path2 = 'path/to/files/test-2.json'
const path3 = 'path/to/files/test-3.json'
const errorJsonPath = 'path/to/files/error.json'

beforeEach(() => {
  //parse mocked paths to js objects
  obj1 = JSON.parse(fs.readFileSync(path1, 'utf8'))
  obj2 = JSON.parse(fs.readFileSync(path2, 'utf8'))
  obj3 = JSON.parse(fs.readFileSync(path3, 'utf8'))
})
describe('Full file merge', () => {
  test('merge two files', () => {
    const result = JSON.parse(mergeFiles([path1, path2]))

    expect(result.id).toBe(obj2.id)
    expect(result.p1.d1.dd1.pp1).toBe(obj2.p1.d1.dd1.pp1)
    expect(result.p1.d1.dd1.custom1).toBe(obj1.p1.d1.dd1.custom1)
    expect(result.p1.d1.dd1.custom2).toBe(obj2.p1.d1.dd1.custom2)
  })

  test('merge three files', () => {
    const result = JSON.parse(mergeFiles([path1, path2, path3]))

    expect(result.id).toBe(obj3.id)
    expect(result.p1.d1.dd1.pp1).toBe(obj3.p1.d1.dd1.pp1)
    expect(result.p1.d1.dd1.custom1).toBe(obj1.p1.d1.dd1.custom1)
    expect(result.p1.d1.dd1.custom2).toBe(obj2.p1.d1.dd1.custom2)
    expect(result.p1.d1.dd1.custom3).toBe(obj3.p1.d1.dd1.custom3)
  })
})
describe('Partial file merge', () => {
  test(' merge two files', () => {
    const result = JSON.parse(mergeFiles([path1, path2], ['p1.d1']))

    expect(result.id).toBe(obj1.id)
    expect(result.p1.d1.dd1.pp1).toBe(obj2.p1.d1.dd1.pp1)
    expect(result.p1.d1.dd1.custom1).toBe(obj1.p1.d1.dd1.custom1)
    expect(result.p1.d1.dd1.custom2).toBe(obj2.p1.d1.dd1.custom2)
  })

  test(' merge two files with multiple paths', () => {
    const result = JSON.parse(
      mergeFiles([path1, path2], ['p1.d1.p1', 'p1.d1.dd1'])
    )

    expect(result.id).toBe(obj1.id)
    expect(result.p1.d1.p1).toBe(obj2.p1.d1.p1)
    expect(result.p1.d1.dd1.pp1).toBe(obj2.p1.d1.dd1.pp1)
    expect(result.p1.d1.dd1.custom1).toBe(obj1.p1.d1.dd1.custom1)
    expect(result.p1.d1.dd1.custom2).toBe(obj2.p1.d1.dd1.custom2)
  })
  test('merge three files', () => {
    const result = JSON.parse(mergeFiles([path1, path2, path3], ['p1.d1']))

    expect(result.id).toBe(obj1.id)
    expect(result.p1.d1.dd1.pp1).toBe(obj3.p1.d1.dd1.pp1)
    expect(result.p1.d1.dd1.custom1).toBe(obj1.p1.d1.dd1.custom1)
    expect(result.p1.d1.dd1.custom2).toBe(obj2.p1.d1.dd1.custom2)
    expect(result.p1.d1.dd1.custom3).toBe(obj3.p1.d1.dd1.custom3)
  })
  test('merge three files - with multiple paths', () => {
    const result = JSON.parse(
      mergeFiles([path1, path2, path3], ['p1.d1.p1', 'p1.d1.dd1'])
    )

    expect(result.id).toBe(obj1.id)
    expect(result.p1.d1.p1).toBe(obj3.p1.d1.p1)
    expect(result.p1.d1.dd1.pp1).toBe(obj3.p1.d1.dd1.pp1)
    expect(result.p1.d1.dd1.custom1).toBe(obj1.p1.d1.dd1.custom1)
    expect(result.p1.d1.dd1.custom2).toBe(obj2.p1.d1.dd1.custom2)
    expect(result.p1.d1.dd1.custom3).toBe(obj3.p1.d1.dd1.custom3)
  })
})
describe('Partial file merge - with override', () => {
  test('merge two files', () => {
    const result = JSON.parse(
      mergeFiles([path1, path2], ['p1.d1'], false, true)
    )
    expect(result.id).toBe(obj1.id)
    expect(result.p1.d1.custom1).toBeUndefined()
    expect(result.p1.d1.dd1.custom1).toBeUndefined()
    expect(result.p1.d1.dd1.pp1).toBe(obj2.p1.d1.dd1.pp1)
    expect(result.p1.d1.dd1.custom2).toBe(obj2.p1.d1.dd1.custom2)
  })
  test('merge three files', () => {
    const result = JSON.parse(
      mergeFiles([path1, path2, path3], ['p1.d1'], false, true)
    )
    expect(result.id).toBe(obj1.id)
    expect(result.p1.d1.custom1).toBeUndefined()
    expect(result.p1.d1.dd1.custom1).toBeUndefined()
    expect(result.p1.d1.custom2).toBe(obj2.p1.d1.custom2)
    expect(result.p1.d1.dd1.custom2).toBe(obj2.p1.d1.dd1.custom2)
    expect(result.p1.d1.dd1.pp1).toBe(obj3.p1.d1.dd1.pp1)
    expect(result.p1.d1.custom3).toBe(obj3.p1.d1.custom3)
    expect(result.p1.d1.p1).toBe(obj3.p1.d1.p1)
  })

  test('two files - if path does not exist return the first file ', () => {
    const result = JSON.parse(mergeFiles([path1, path2], ['fake.path'], true))
    expect(result).toEqual(obj1)
  })
  test('three files - if path does not exist the return first file ', () => {
    const result = JSON.parse(
      mergeFiles([path1, path2, path3], ['fake.path'], true)
    )
    expect(result).toEqual(obj1)
  })
})

describe('Error conditions', () => {
  test('if merging only one file, throw error', () => {
    expect(() => {
      mergeFiles([obj1])
    }).toThrow(/2 files are needed/)
  })

  test('if path to file is wrong, throw error', () => {
    expect(() => {
      mergeFiles(['/wrong/path/file.json', path1])
    }).toThrow(/Can\'t read file/)
  })

  test('if malformed json throw error', () => {
    expect(() => {
      mergeFiles([path2, errorJsonPath, path3])
    }).toThrow(/not valid JSON/)
  })
})
