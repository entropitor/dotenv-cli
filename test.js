const assert = require('assert')
const path = require('path')
const { spawn, spawnSync } = require('child_process')

const cli = path.join(__dirname, 'cli.js')

function childArgs (script) {
  return [cli, '--no-expand', '--', process.execPath, '-e', script]
}

function runChild (script) {
  const result = spawnSync(process.execPath, childArgs(script), {
    encoding: 'utf8',
    timeout: 10000
  })
  assert.ifError(result.error)
  return result
}

function forwardSignal () {
  const script = `
    setTimeout(() => process.exit(99), 5000)
    process.on('SIGTERM', () => {
      console.log('stopping')
      setTimeout(() => {
        console.log('cleanup complete')
        process.exit(42)
      }, 100)
    })
    console.log('ready')
  `

  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, childArgs(script))
    let stdout = ''
    let stderr = ''
    let signalled = false
    const timer = setTimeout(() => {
      child.kill('SIGKILL')
      reject(new Error('Timed out waiting for the forwarded signal'))
    }, 10000)

    child.on('error', (error) => {
      clearTimeout(timer)
      reject(error)
    })
    child.stdout.on('data', (data) => {
      stdout += data
      if (!signalled && stdout.includes('ready\n')) {
        signalled = true
        child.kill('SIGTERM')
      }
    })
    child.stderr.on('data', (data) => {
      stderr += data
    })
    child.on('close', (status, signal) => {
      clearTimeout(timer)
      resolve({ status, signal, stdout, stderr })
    })
  })
}

async function main () {
  for (const status of [0, 42]) {
    const result = runChild(`process.exit(${status})`)
    assert.strictEqual(result.status, status)
    assert.strictEqual(result.signal, null)
  }

  // Windows does not implement POSIX signal termination semantics.
  if (process.platform !== 'win32') {
    for (const signal of ['SIGTERM', 'SIGINT', 'SIGHUP', 'SIGALRM']) {
      const result = runChild(`process.kill(process.pid, '${signal}')`)
      assert.strictEqual(result.signal, signal, `Child termination by ${signal} should be preserved`)
      assert.strictEqual(result.status, null)
    }

    const result = await forwardSignal()
    assert.strictEqual(result.status, 42, result.stderr)
    assert.strictEqual(result.signal, null)
    assert.strictEqual(result.stdout, 'ready\nstopping\ncleanup complete\n')
  }

  console.log('Exit status and signal tests passed')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
