import { execa } from 'execa'
import { TEST_DOCKER_COMPOSE_FILE_NAME } from './tests-constants.js'

process.env.NODE_ENV = 'test'

// Here you can stop your database using docker-compose/removing data

// Adding the /user/local/bin as when running from WebStorm, some PATH variable may not be configured properly
// which would make WebStorm not pick them - meaning that your PATH won't be the same as the WebStorm Local PATH -
// So we're adding the place where docker-compose should be
const updatedPathEnv = { PATH: `${process.env.PATH}:/usr/local/bin` }

async function globalTeardown() {
  if (!process.env.CI) {
    // Stop the docker-compose and remove it's data
    await execa('docker-compose', ['-f', TEST_DOCKER_COMPOSE_FILE_NAME, 'down', '-v'], {
      cwd: import.meta.dirname,
      env: updatedPathEnv,

      // Make it output to this process stdout / stderr
      stdout: 'inherit',
      stderr: 'inherit',

      timeout: 60_000,
    })
  }
}

console.log('calling global teardown')
globalTeardown()
  .then(() => {
    console.log('global teardown completed')
    process.exit(0)
  })
  .catch((err) => {
    console.error('global teardown failed', err)
    process.exit(1)
  })
