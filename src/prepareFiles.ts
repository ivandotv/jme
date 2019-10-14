import fs from 'fs'

export type FileData = {
  fileContents: string
  filePath: string
  objData?: any
}

/**
 * Given the file paths return FileData objects to be used for merging
 *
 * @export
 * @param {string[]} filePaths file paths
 * @returns {FileData[]}
 */
export function prepareFiles(filePaths: string[]): FileData[] {
  if (filePaths.length < 2) {
    throw new Error(
      'At least 2 files are needed to perform the merge operation'
    )
  }
  const objectsToMerge: any[] = filePaths.map(readFiles).map(parseJSON)
  return objectsToMerge
}

/**
 * Read the file from the disk
 *
 * @param {string} filePath
 * @returns {FileData}
 */
function readFiles(filePath: string): FileData {
  let fileContents: string
  try {
    fileContents = fs.readFileSync(filePath, 'utf8')
  } catch (e) {
    throw new Error(`Can't read file at: ${filePath}`)
  }
  return { fileContents, filePath }
}

/**
 * Parse the FileData contents property in to JSON
 *
 * @param {FileData} fileData
 * @returns {FileData}
 */
function parseJSON(fileData: FileData): FileData {
  try {
    fileData.objData = JSON.parse(fileData.fileContents)
  } catch (e) {
    throw new Error(`File: ${fileData.filePath} is not valid JSON`)
  }
  return fileData
}
