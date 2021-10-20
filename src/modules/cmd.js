import child_process from 'child_process';
import util from 'util';

const exec = util.promisify(child_process.exec);


const exec_solc = async function (source_code) {
  exec(`echo ${source_code} > file.solpp`)
  const result = await exec(`./solppc --bin  --abi file.solpp > result.raw`);
  if (result.stderr) {
    throw new Error(`Check failed! err: ${result.stderr}`);
  }
}

const contract_compiled_code_hex = async function () {
  const result = await exec(`cat result.raw | grep -v "OffChain Binary" | grep Binary -A1 | grep -v "Binary"`);
  if (result.stderr) {
    throw new Error(`Check failed! err: ${result.stderr}`);
  }
  return result.stdout.trim();
}

const contract_compiled_abi = async function () {
  const result = await exec(`cat result.raw | grep -v "OffChain Binary"  | grep "Contract JSON ABI" -A1 | grep -v "Contract JSON ABI"`);
  if (result.stderr) {
    throw new Error(`Check failed! err: ${result.stderr}`);
  }
  return result.stdout.trim();
}


const download_solc = async function (version) {
  await exec(`wget -c https://github.com/vitelabs/soliditypp-bin/releases/download/${version}/solppc_linux.tar.gz && tar xvf solppc_linux.tar.gz`);

  const result = await exec(`./solppc --version`);
  if (result.stderr) {
    console.log(result.stderr);
    throw new Error(`Check failed! err: ${result.stderr}`);
  }
  console.log(result.stdout)
}

const compile_solc = async function (source_code) {
  await exec_solc(source_code);
  const code = await contract_compiled_code_hex();
  console.log(code);
  const abi = await contract_compiled_abi();
  console.log(abi);

  return { code: code, abi: abi };
}

module.exports = {
  compile_solc: compile_solc,
  download_solc: download_solc
}