process.env.NODE_ENV = 'test'

import { execa } from 'execa'
import isPortReachable from 'is-port-reachable'
import { POSTGRES_TEST_PORT, TEST_DOCKER_COMPOSE_FILE_NAME } from './tests-constants.ts'

// Adding the /user/local/bin as when running from WebStorm, some PATH variable may not be configured properly
// which would make WebStorm not pick them - meaning that your PATH won't be the same as the WebStorm Local PATH -
// So we're adding the place where docker-compose should be
const updatedPathEnv = { PATH: `${process.env.PATH}:/usr/local/bin` }

async function globalSetup() {
  if (!process.env.CI) {
    // TODO - get from config
    const dbPort = POSTGRES_TEST_PORT
    if (
      !dbPort ||
      !(await isPortReachable(dbPort, {
        host: '127.0.0.1',
      }))
    ) {
      // Start postgres only in local machine
      await execa('docker-compose', ['-f', TEST_DOCKER_COMPOSE_FILE_NAME, 'up', '-d'], {
        cwd: import.meta.dirname,
        env: updatedPathEnv,

        // Make it output to this process stdout / stderr
        stdout: 'inherit',
        stderr: 'inherit',

        timeout: 60_000,
      })
    }
  }

  // Seed the DB if needed
  // await seedDb();

  // Setup the any initial user
}

console.log('calling global setup')
globalSetup()
  .then(() => {
    console.log('global setup completed')

    return 0
  })
  .catch((err) => {
    console.error('global setup failed', err)

    return 1
  })
  .then((exitCode) => {
    // Exiting as there are can be some things that keeping the process alive...
    process.exit(exitCode)
  })
