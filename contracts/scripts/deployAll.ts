import {ethers} from "hardhat";


const AGENT_PROMPT = "You are a helpful assistant";
const DALLE_PROMPT = "make an image of: \"solarpunk oil painting "

async function main() {
  const oracleAddress: string = await deployOracle();
  console.log()
  await deployAgent(oracleAddress);
  await deployDalle(oracleAddress);
  console.log()
  await deployChatGptWithKnowledgeBase("ChatGpt", oracleAddress, "");
  for (let contractName of ["OpenAiChatGpt", "GroqChatGpt", "OpenAiChatGptVision"]) {
    await deployChatGpt(contractName, oracleAddress)
  }
}

async function deployOracle(): Promise<string> {
  const oracle = await ethers.deployContract("ChatOracle", [], {});

  await oracle.waitForDeployment();

  console.log(
    `Oracle deployed to ${oracle.target}`
  );
  // only for local dev
  // await oracle.updateWhitelist((await ethers.getSigners())[0].address, true)

  return oracle.target as string;
}

async function deployAgent(oracleAddress: string) {
  const agent = await ethers.deployContract(
    "Agent",
    [
      oracleAddress,
      AGENT_PROMPT
    ], {});

  await agent.waitForDeployment();

  console.log(
    `Agent deployed to ${agent.target}`
  );
}

async function deployDalle(oracleAddress: string) {
  const agent = await ethers.deployContract(
    "DalleNft",
    [
      oracleAddress,
      DALLE_PROMPT,
    ], {});

  await agent.waitForDeployment();

  console.log(
    `Dall-e deployed to ${agent.target}`
  );
}



async function deployChatGpt(contractName: string, oracleAddress: string) {
  const agent = await ethers.deployContract(contractName, [oracleAddress], {});

  await agent.waitForDeployment();

  console.log(
    `${contractName} deployed to ${agent.target}`
  );
}

async function deployChatGptWithKnowledgeBase(contractName: string, oracleAddress: string, knowledgeBaseCID: string) {
  const agent = await ethers.deployContract(contractName, [oracleAddress, knowledgeBaseCID], {});

  await agent.waitForDeployment();

  console.log(
    `${contractName} deployed to ${agent.target} with knowledge base "${knowledgeBaseCID}"`
  );
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
