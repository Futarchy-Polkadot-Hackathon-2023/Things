/*
* USES eg: call commentOnRererendum('92', 'sweet comment') where 92 is the referenda id and it returns true after posting
*          call getTitle('92') to get the title or null (if fails)
*/
var webdriver = require("selenium-webdriver");
var chrome = require("selenium-webdriver/chrome");
const { text } = require("stream/consumers");

let URL = "https://kusama.polkassembly.io/referendum/";
const title_xpath = '//*[@id="root"]/section/section/section/main/div/div/div/div[1]/div/div[1]/h2'
const xpath_login_button = '//*[@id="root"]/section/header/nav/div/div[2]/div[5]/div/a'
const userid_xpath = "/html/body/div[1]/section/section/section/main/div/div/article/form/div[1]/div/div/div/div/div/input"
const password_xpath = "/html/body/div[1]/section/section/section/main/div/div/article/form/div[2]/div[1]/div/div/div/div/span/input"
const submit_login_xpath = "/html/body/div[1]/section/section/section/main/div/div/article/form/div[3]/button"
const rheader_xpath = '//*[@id="root"]/section/header/nav/div/div[2]'
const comment_area_xpath = '//*[@id="comment-content-form"]/div[1]/div/div/div/div/div/div/div/div[2]/div/textarea'
const commentsubmit_button = '//*[@id="comment-content-form"]/div[2]/div/div/div/div/div/button'

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

async function commentOnRererendum(refId, commentText) {

    URL = URL + refId;
    try {
        driver = new webdriver.Builder()
        .forBrowser("chrome")
        .setChromeOptions(chromeOptions)
        .build();
    } catch (error) {
        
    }
  
    try {
        driver.get(URL)
        await driver.findElement(webdriver.By.xpath(xpath_login_button)).click()
        await driver.wait(webdriver.until.elementLocated(webdriver.By.xpath(rheader_xpath)),5*1000);
        await driver.findElement(webdriver.By.xpath(userid_xpath)).sendKeys("demeg");
        await driver.findElement(webdriver.By.xpath(password_xpath)).sendKeys("Hello-123")
        await driver.findElement(webdriver.By.xpath(submit_login_xpath)).click()
        await driver.wait(webdriver.until.elementLocated(webdriver.By.xpath(comment_area_xpath)),5*1000);
        await driver.findElement(webdriver.By.xpath(comment_area_xpath)).sendKeys(commentText)
        await driver.findElement(webdriver.By.xpath(commentsubmit_button)).click()
        await driver.wait(webdriver.until.elementLocated(webdriver.By.xpath(comment_area_xpath)),5*1000);

        await driver.close()
        return true

    }catch (error) {
        console.log(error)
    }

    await driver.close()
    return false
}

async function getTitle(refId) {

    URL = URL + refId;
    try {
        driver = new webdriver.Builder()
        .forBrowser("chrome")
        .setChromeOptions(chromeOptions)
        .build();
    } catch (error) {
        
    }
  
    try {
        driver.get(URL)
        await driver.wait(webdriver.until.elementLocated(webdriver.By.xpath(title_xpath)),5*1000);
        let title_text = await driver.findElement(webdriver.By.xpath(title_xpath)).getText();
        title_text = title_text.split(' ').slice(1).join(' ') || null

        await driver.close()
        return title_text

    }catch (error) {
        console.log(error)
    }

    await driver.close()
    return null
}

commentOnRererendum('263', 'testing123')
.then(data => console.log(data))


getTitle('263')
.then(data => console.log(data))
