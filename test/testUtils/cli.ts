/**
 * Delay is taken from https://github.com/infinitered/gluegun/pull/450/files#diff-d03b0d27090e08fffa642ad09c9b8c0fR1
 * @param ms
 */
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
export const sendKeystrokes = keysFuncAsync => {
  return setTimeout(() => keysFuncAsync().then(), 5)
}
export const KEYS = {
  Up: "\x1B\x5B\x41",
  Down: "\x1B\x5B\x42",
  Enter: "\x0D",
  Space: "\x20",
}
