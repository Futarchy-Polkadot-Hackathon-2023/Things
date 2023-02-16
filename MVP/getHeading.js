/* Mock Data Input */
const dataInput = {
  url: "https://polkadot.polkassembly.io/treasury/",
  proposalIndex: "229",
};

/* Mock Data Output */
const dataOutput = {
  title:
    "#229 Treasury Proposal: Polkawatch, Decentralization Analytics, Continued Operation and Development",
};

/* Main function Declartion */
import puppeteer from "puppeteer";
async function getHeading(dataInput) {
  // Launch the browser
  const browser = await puppeteer.launch({ headless: true });

  // Create a page
  const page = await browser.newPage();

  // Go to your site
  await page.goto(dataInput.url + dataInput.proposalIndex);

  // Get Heading
  const h2InnerHTMl = await page.evaluate(
    () => document.querySelector("h2").innerHTML
  );
  // Create Object
  const heading = {
    title: h2InnerHTMl,
  };
  // Close Browser 
  browser.close();

  return heading;
}

async function getHeadingMock(dataInput) {
  console.log(dataInput);
  console.log("\x1b[1m", "... getHeading() ...", "\x1b[0m");

  // Launch the browser
  const browser = await puppeteer.launch({ headless: true });

  // Create a page
  const page = await browser.newPage();

  // Go to your site
  await page.goto(dataInput.url + dataInput.proposalId);

  // Get Heading
  const h2InnerHTMl = await page.evaluate(
    () => document.querySelector("h2").innerHTML
  );
  // Create Object
  const heading = {
    title: h2InnerHTMl,
  };
  // Close Browser 
  browser.close();

  console.log(heading);
  return heading;
}

/* Main function Calling */
// getHeading(dataInput)
// getHeadingMock(dataInput)

/* Export */
export { getHeading };
