// THIS IS A BOOTSTRAP TO HELP FIND CONFIG FILE WHEN BUILT IN THE `DIST` DIRECTORY

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Path = require('path')
process.env.NODE_CONFIG_DIR = Path.join(__dirname, './config')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const server = require('./server')

server.start().catch(console.error)
