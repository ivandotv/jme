const path = require('path')

const fs = jest.genMockFromModule('fs')

const MOCK_FILES = {
  'path/to/files/test-1.json': JSON.stringify(
    require('../_fixtures_/test-1.json')
  ),
  'path/to/files/test-2.json': JSON.stringify(
    require('../_fixtures_/test-2.json')
  ),
  'path/to/files/test-3.json': JSON.stringify(
    require('../_fixtures_/test-3.json')
  ),
  'path/to/files/error.json': 'malformedJSon',
}

let mockFiles = Object.create(null)
function __setMockFiles(newMockFiles) {
  mockFiles = Object.create(null)
  for (const file in newMockFiles) {
    const dir = path.dirname(file)

    if (!mockFiles[dir]) {
      mockFiles[dir] = {}
    }
    mockFiles[dir][path.basename(file)] = newMockFiles[file]
  }
}

function readFileSync(filePath) {
  const r = mockFiles[filePath]
  const dir = path.dirname(filePath)
  const file = path.basename(filePath)
  if (mockFiles[dir] && mockFiles[dir][file]) return mockFiles[dir][file]
  throw new Error('file not found')
}

__setMockFiles(MOCK_FILES)

fs.__setMockFiles = __setMockFiles
fs.readFileSync = readFileSync
module.exports = fs
