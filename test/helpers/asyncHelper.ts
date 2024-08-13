const assert = async (
  assertions: CallableFunction,
  timeout = 50,
): Promise<void> => {
  await new Promise<void>((resolve, reject) => {
    setTimeout(async () => {
      try {
        await assertions()
        resolve()
      } catch (error) {
        reject(error)
      }
    }, timeout)
  })
}

const wait = async (
  duration = 50,
): Promise<void> => {
  await new Promise<void>(resolve => {
    setTimeout(() => {
      resolve()
    }, duration)
  })
}

export default {
  assert,
  wait,
}
