import fs from 'fs'

export type FileData = {
  fileContents: string
  filePath: string
  objData?: any
}
export function prepareFiles(filePaths: string[]): FileData[] {
  if (filePaths.length < 2) {
    throw new Error(
      'At least 2 files are needed to perform the merge operation'
    )
  }
  const objectsToMerge: any[] = filePaths.map(readFiles()).map(parseJSON())
  return objectsToMerge
}

function readFiles(): (T: string) => FileData {
  return (filePath: string): FileData => {
    let fileContents: string
    try {
      fileContents = fs.readFileSync(filePath, 'utf8')
    } catch (e) {
      throw new Error(`Can't read file at: ${filePath}`)
    }
    return { fileContents, filePath }
  }
}

function parseJSON(): (T: FileData) => FileData {
  return (fileData: FileData): FileData => {
    try {
      fileData.objData = JSON.parse(fileData.fileContents)
    } catch (e) {
      throw new Error(`File: ${fileData.filePath} is not valid JSON`)
    }
    return fileData
  }
}
