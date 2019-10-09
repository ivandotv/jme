import deepExtend from 'deep-extend'
import { mergeFilesPartial } from './mergePartial'
import { prepareFiles, FileData } from './prepareFiles'

export function mergeFiles(
  filePaths: string[],
  objectPaths: string[] | undefined = undefined,
  allowUndefined: boolean = false,
  override: boolean = false
): string {
  const objectsToMerge = prepareFiles(filePaths)

  let result = ''
  if (typeof objectPaths !== 'undefined') {
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

export function mergeFilesFull(objectsToMerge: FileData[]): string {
  const result = deepExtend(
    ...(objectsToMerge.map((obj: any) => {
      return obj.objData
    }) as [any, any])
  )
  return result
}
