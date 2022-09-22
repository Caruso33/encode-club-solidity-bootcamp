import { ethers } from "ethers";

function main() {
  const proposals = process.argv.slice(2);

  const bytes = [];
  for (const proposal of proposals) {
    const word = ethers.utils.formatBytes32String(proposal);

    bytes.push(word);
  }

  console.log(bytes);

  return bytes;
}

main();
