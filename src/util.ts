export function random(len: number): string {
  const options = "qweqewqeqwqwerqwdcdfwffgavasfgavas1234567890";
  const max = options.length;
  let ans = "";

  for (let i = 0; i < len; i++) {
    const idx = Math.floor(Math.random() * max);
    ans += options[idx];
  }

  return ans;
}