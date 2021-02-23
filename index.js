const core = require('@actions/core')
const tc = require('@actions/tool-cache')
const path = require('path')

async function run() {
    try {
        const downloadUrl = 'https://static.dev.sifive.com/dev-tools/riscv64-unknown-elf-gcc-8.1.0-2019.01.0-x86_64-linux-ubuntu14.tar.gz'
        const binPath = ['riscv64-unknown-elf-gcc-8.1.0-2019.01.0-x86_64-linux-ubuntu14', 'bin']
        const cacheTag = '8.1.0-2019.01.0'
        const cacheKey = 'riscv-toolchain'
        let cachedPath = tc.find(cacheKey, cacheTag)
        if (cachedPath) {
            core.info(`Using cached version ${cacheKey}`)
        } else {
            core.info(`Downloading ${cacheKey} from ${downloadUrl}`)
            const downloadPath = await tc.downloadTool(downloadUrl)
            core.info(`Extracting version ${cacheKey}`)
            const extractedPath = await tc.extractTar(downloadPath)
            core.info(`Caching version ${cacheKey}`)
            cachedPath = await tc.cacheDir(extractedPath, cacheKey, cacheTag)
        }
        core.addPath(path.join(cachedPath, ...binPath))
    } catch (error) {
        core.setFailed(error.message)
    }
}

run()