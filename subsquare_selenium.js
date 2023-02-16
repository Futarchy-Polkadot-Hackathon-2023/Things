/*
* USES eg: call getTallyStats('92') where 92 is the referenda id and it returns following object
*{
*  aye_percent: '97%',
*  nay_percent: '3%',
*  aye_ksm: '105.07K KSM',
*  nay_ksm: '3.3K KSM'
*}
*/
var webdriver = require("selenium-webdriver");
var chrome = require("selenium-webdriver/chrome");


async function getTallyStats(id) {
    let URL = "https://kusama.subsquare.io/referenda/referendum/" + id;
    let data = null
    const xpath_tally = '//*[@id="__next"]/div/div[1]/div[1]/div/div/div/div/div/div[3]/div[2]'
    const xpath_aye   =     '//*[@id="__next"]/div/div[1]/div[1]/div/div/div/div/div/div[3]/div[2]/div[2]/div[2]/div/div[1]/span[1]'
    const xpath_threshold = '//*[@id="__next"]/div/div[1]/div[1]/div/div/div/div/div/div[3]/div[2]/div[2]/div[2]/div/div[2]/span[1]'
    const xpath_nay   =     '//*[@id="__next"]/div/div[1]/div[1]/div/div/div/div/div/div[3]/div[2]/div[2]/div[2]/div/div[3]/span[1]'
    const xpath_aye_ksm = '//*[@id="__next"]/div/div[1]/div[1]/div/div/div/div/div/div[3]/div[2]/div[3]/span[2]/div/div[1]/span'
    const xpath_nay_ksm = '//*[@id="__next"]/div/div[1]/div[1]/div/div/div/div/div/div[3]/div[2]/div[4]/span[2]/div/div[1]/span'

    var chromeOptions = new chrome.Options();
    user_agent = 'user-agent=' + 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36'
    chromeOptions.addArguments(user_agent)
    chromeOptions.addArguments("--window-size=1920x1080")
    chromeOptions.addArguments("start-maximized");
    chromeOptions.addArguments("test-type");
    chromeOptions.addArguments("--js-flags=--expose-gc");
    chromeOptions.addArguments("--enable-precise-memory-info");
    chromeOptions.addArguments("--disable-popup-blocking");
    chromeOptions.addArguments("--disable-default-apps");
    chromeOptions.addArguments("--disable-infobars");
    chromeOptions.addArguments('--headless');
    try {
        driver = new webdriver.Builder()
        .forBrowser("chrome")
        .setChromeOptions(chromeOptions)
        .build();
        console.log('1')
    } catch (error) {
        
    }
    
    driver.get(URL)

    async function get_text_by_xpath(xpath) {
        let text = null
        try {
            text= await driver.findElement(webdriver.By.xpath(xpath)).getText()
        } catch (error) {
            console.log(error)
        }
        return text;
    }

    

    try {
        await driver.wait(webdriver.until.elementLocated(webdriver.By.xpath(xpath_tally)),5*1000);
        data = {
            'aye_percent': await get_text_by_xpath(xpath_aye),
            'nay_percent': await get_text_by_xpath(xpath_nay),
            // 'threshold_percent': await get_text_by_xpath(xpath_threshold),
            'aye_ksm': await get_text_by_xpath(xpath_aye_ksm),
            'nay_ksm': await get_text_by_xpath(xpath_nay_ksm)
        }
    }catch (error) {
        console.log(error)
    }

    await driver.close()
    return data
}

getTallyStats('92')
.then(data => console.log(data))
