import { compile_solc, download_solc } from './modules/cmd.js';
import { contract_create_code, compare_code } from './modules/request.js';

verify_contract_code = async () => {
  const address = document.getElementById("contractadress");
  console.log("address", address);
  if (!address) throw new Error('Error address');

  await download_solc(document.getElementById("compilerversion"));
  const compiled_result = await compile_solc(document.getElementById("sourceCode"))
  const code_hex = await contract_create_code(address);
  const result = await compare_code(code_hex, compiled_result.code);
  if (!result) {
    console.log(`code compare filed`);
    throw new Error('Check failed!')
  }
  return 'Check passed!'
}

const main = async () => {
  await verify_contract_code();
}

document.getElementById("btnpost").onclick = main;