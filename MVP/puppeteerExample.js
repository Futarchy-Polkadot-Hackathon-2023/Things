// Import puppeteer
import puppeteer from 'puppeteer';

(async () => {
  // Launch the browser
  try{
  const browser = await puppeteer.launch({headless:false});

  // Create a page
  const page = await browser.newPage();

  // Go to your site
  await page.goto('https://polkadot.polkassembly.io/treasury/229');

  const html = await page.evaluate(()=> document.querySelector('h2').innerHTML)
    console.log(html)

    browser.close()
  }catch(e){
    console.log(e)
  }
})();
