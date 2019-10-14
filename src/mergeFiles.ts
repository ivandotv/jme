import deepExtend from 'deep-extend'
import { mergeFilesPartial } from './mergePartial'
import { prepareFiles, FileData } from './prepareFiles'

/**
 * Handle merging of files or particular paths
 *
 * @export
 * @param {string[]} filePaths paths to files
 * @param {(string[] | undefined)} [objectPaths=undefined] partial object paths
 * @param {boolean} [allowUndefined=false] allow non existent paths on objects
 * @param {boolean} [override=false] override, don't merge the paths in the target object
 * @returns {string} JSON string
 */
export function mergeFiles(
  filePaths: string[],
  objectPaths: string[] | undefined = undefined,
  allowUndefined: boolean = false,
  override: boolean = false
): string {
  const objectsToMerge = prepareFiles(filePaths)

  let result = ''
  if (typeof objectPaths !== 'undefined') {
    //merge partial paths
    result = mergeFilesPartial(
      objectsToMerge,
      objectPaths,
      allowUndefined,
      override
    )
  } else {
    result = mergeFilesFull(objectsToMerge)
  }

  return JSON.stringify(result, undefined, 2)
}

/**
 * Merge files fully
 *
 * @export
 * @param {FileData[]} objectsToMerge
 * @returns {string}
 */
export function mergeFilesFull(objectsToMerge: FileData[]): string {
  const result = deepExtend(
    ...(objectsToMerge.map((obj: any) => {
      return obj.objData
    }) as [any, any])
  )
  return result
}
