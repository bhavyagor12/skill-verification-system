import { expect } from "chai";
import { ethers } from "hardhat";
import { SkillVerification } from "../typechain-types";

describe("SkillVerification", function () {
  let skillVerfication: SkillVerification;
  before(async () => {
    const skillVerficationFactory = await ethers.getContractFactory("SkillVerification");
    skillVerfication = (await skillVerficationFactory.deploy()) as SkillVerification;
    await skillVerfication.waitForDeployment();
  });
});
