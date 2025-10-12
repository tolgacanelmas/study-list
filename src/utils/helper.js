export function formatPhone(phone) {
  return `+(90) ${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(
    6,
    10
  )}`;
}
