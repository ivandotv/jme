#!/usr/bin/env node

import { main } from './main'
import commander from 'commander'
import chalk from 'chalk'

process.on('uncaughtException', (e) => {
  if (typeof e.message !== 'undefined') {
    console.error(chalk.bold.red(e.message))
  } else {
    console.error(e)
  }
  process.exit(1)
})

main(process.argv, new commander.Command())
