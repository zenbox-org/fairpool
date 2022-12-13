export function getAddressFromIndex(index: number) {
  return '0x' + index.toString(16).padStart(40, '0')
}
