import type { FullContext, Sdk } from "@zeitgeistpm/sdk";
import { create, batterystation } from "@zeitgeistpm/sdk";

async function initaliseSDK() {
  try {
    const sdk: Sdk<FullContext> = await create(batterystation());
    console.log(sdk);
  } catch (e) {
    console.warn(e);
  }
}

initaliseSDK();
