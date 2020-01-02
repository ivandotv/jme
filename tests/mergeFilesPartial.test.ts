import { mergeFilesPartial } from '../src/mergePartial'
import { FileData } from '../src/prepareFiles'

let obj1: any, obj2: any, obj3: any

beforeEach(() => {
  obj1 = {
    objData: {
      prop1: 't1',
      p2: 't1',
      p3: {
        prop1: 'p3t1',
        p2: 'p3t1',
      },
    },
  }

  obj2 = {
    objData: {
      prop1: 't2',
      p2: 't2',
      p3: {
        prop1: 'p3t2',
        p2: 'p3t2',
      },
    },
  }
  obj3 = {
    objData: {
      prop1: 't3',
      p2: 't3',
      p3: {
        prop1: 'p3t3',
        p2: 'p3t3',
      },
    },
  }
})
describe('Merge objects partially', () => {
  test('two objects - one path', () => {
    const path = 'p2'

    const r = mergeFilesPartial([obj1 as FileData, obj2 as FileData], [path])

    expect(r[path]).toBe(obj2.objData[path])
  })
  test('two objects - two paths', () => {
    const path1 = 'p2'
    const path2 = 'p3.prop1'

    const r = mergeFilesPartial(
      [obj1 as FileData, obj2 as FileData],
      [path1, path2]
    )

    expect(r[path1]).toBe(obj2.objData[path1])
    expect(r[path2]).toBe(obj2.objData[path2])
  })
  test('three objects - two paths', () => {
    const path1 = 'p2'
    const path2 = 'p3.prop1'
    const path3 = 'newProp'
    obj2.objData[path3] = '2'

    const r = mergeFilesPartial(
      [obj1 as FileData, obj2 as FileData, obj3 as FileData],
      [path1, path2, path3],
      true
    )

    expect(r[path1]).toBe(obj3.objData[path1])
    expect(r[path2]).toBe(obj3.objData[path2])
    expect(r[path3]).toBe(obj2.objData[path3])
  })
  test('custom properties on the first object are not completely overwritten', () => {
    obj1 = {
      objData: {
        p3: {
          prop1: 'p3t1',
          p2: 'p3t1',
          customProp1: 't1',
        },
      },
    }
    obj2 = {
      objData: {
        prop1: 't2',
        p2: 't2',
        p3: {
          prop1: 'p3t2',
          p2: 'p3t2',
          customProp2: 't2',
        },
      },
    }
    const expectedResult = {
      p3: {
        prop1: obj2.objData.p3.prop1,
        p2: obj2.objData.p3.p2,
        customProp1: obj1.objData.p3.customProp1,
        customProp2: obj2.objData.p3.customProp2,
      },
    }
    const path = 'p3'

    const r = mergeFilesPartial([obj1 as FileData, obj2 as FileData], [path])

    expect(r).toEqual(expectedResult)
  })
  test('pass in empty objec as the first object', () => {
    const path1 = 'p2'
    const path2 = 'p3.prop1'
    const obj1 = {
      objData: {},
    }

    const r = mergeFilesPartial(
      [obj1 as FileData, obj2 as FileData],
      [path1, path2]
    )

    expect(r[path1]).toBe(obj2.objData[path1])
    expect(r[path2]).toBe(obj2.objData[path2])
  })
  test('first object does not have one of the paths', () => {
    const path1 = 'p2'
    const path2 = 'p3.prop1'
    const path3 = 'newProp'
    obj2.objData[path3] = '2'
    obj3.objData[path3] = '3'

    const r = mergeFilesPartial(
      [obj1 as FileData, obj2 as FileData, obj3 as FileData],
      [path1, path2, path3],
      undefined
    )

    expect(r[path1]).toBe(obj3.objData[path1])
    expect(r[path2]).toBe(obj3.objData[path2])
    expect(r[path3]).toBe(obj3.objData[path3])
  })
  test('if path does not exist, return the first object', () => {
    const path1 = 'data.fake.path'

    const r = mergeFilesPartial(
      [obj1 as FileData, obj2 as FileData],
      [path1],
      true
    )

    expect(r).toEqual(obj1.objData)
  })
  test('If one of the objects to be merged (execept first) does not have the path, throw', () => {
    //object 2 does not have path3
    const path1 = 'p2'
    const path2 = 'p3.prop1'
    const path3 = 'newProp'
    obj3.objData[path3] = '3'

    expect(() => {
      mergeFilesPartial(
        [obj1 as FileData, obj2 as FileData, obj3 as FileData],
        [path1, path2, path3],
        false
      )
    }).toThrow(/not found in file/)
  })
  test('If "allowUndefined" is true, do not throw when one of the objects to be merged does not have the path', () => {
    //object 2 does not have path3
    const path1 = 'p2'
    const path2 = 'p3.prop1'
    const path3 = 'newProp'
    obj3.objData[path3] = '3'

    expect(() => {
      mergeFilesPartial(
        [obj1 as FileData, obj2 as FileData, obj3 as FileData],
        [path1, path2, path3],
        true
      )
    }).not.toThrow()
  })
})
