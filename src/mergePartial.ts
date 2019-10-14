import setValue from 'set-value'
// @ts-ignore
import undefSafe from 'undefsafe'
import { FileData } from './prepareFiles'
import deepExtend = require('deep-extend')

//TODO -root array is not supported yet
//https://stackoverflow.com/questions/3833299/can-an-array-be-top-level-json-text

/**
 * Handle partially merging the files
 *
 * @export
 * @param {FileData[]} mergeTargets target objects to be merged
 * @param {string[]} mergePaths specific paths to be merged
 * @param {boolean} [allowUndefined=false] allow undefined paths on target objects
 * @param {boolean} [override=false] don't merge, override the paths on the target object (first object)
 * @returns {*} Return merged object
 */
export function mergeFilesPartial(
  mergeTargets: FileData[],
  mergePaths: string[],
  allowUndefined: boolean = false,
  override: boolean = false
): any {
  let result: any
  const firstTarget = mergeTargets[0]
  const rootProp = '_'

  override ? mergeTargets.splice(0, 1) : null

  const pathDataToMerge = setupPathData(
    mergeTargets,
    mergePaths,
    rootProp,
    allowUndefined,
    !override
  )

  result = mergePathData(firstTarget.objData, pathDataToMerge, rootProp)
  return result
}

/**
 * Merge all partial paths in the target object
 *
 * @export
 * @param {*} target
 * @param {*} pathData paths to merge
 * @param {string} rootProp  temp property name to hold the object
 * @returns {*} modified target with the merged paths
 */
export function mergePathData(
  target: any,
  pathData: any,
  rootProp: string
): any {
  for (const path in pathData) {
    let mergedObject: any
    if (pathData[path].length > 0) {
      mergedObject = deepExtend({}, ...(pathData[path] as [any, any]))
      setValue(target, path, mergedObject[rootProp])
    }
  }
  return target
}

/**
 * Setup paths to be merged
 *
 * @export
 * @param {FileData[]} objectsToMerge objects to merge
 * @param {string[]} objectPaths paths to merge
 * @param {string} rootProp temp path propertiy
 * @param {boolean} [allowUndefined=false] allow undefined paths
 * @param {boolean} [firstFileCheck=false] allow undefined path on the target (first) object
 * @returns {*}
 */
export function setupPathData(
  objectsToMerge: FileData[],
  objectPaths: string[],
  rootProp: string,
  /* istanbul ignore next */
  allowUndefined: boolean = false,
  /* istanbul ignore next */
  firstFileCheck: boolean = false
): any {
  const pathDataToMerge: any = {}
  objectPaths.forEach((path: string) => {
    let firstFile = true
    pathDataToMerge[path] = []
    objectsToMerge.forEach((fileData: FileData) => {
      const dataAtPath = undefSafe(fileData.objData, path)
      if (typeof dataAtPath !== 'undefined') {
        pathDataToMerge[path].push({ [rootProp]: dataAtPath })
      } else if (!allowUndefined && !firstFile && firstFileCheck) {
        throw new Error(`path: ${path} not found in file: ${fileData.filePath}`)
      }
      firstFile = false
    })
  })

  return pathDataToMerge
}
