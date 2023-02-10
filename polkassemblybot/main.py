import logging

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import sys
import time

logger = logging.getLogger()
logger.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')

# fh = logging.FileHandler('log_filename.txt')
# fh.setLevel(logging.DEBUG)
# fh.setFormatter(formatter)
# logger.addHandler(fh)

ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)
ch.setFormatter(formatter)
logger.addHandler(ch)

logger.debug('This is a test log message.')


class Driver:
    """Class to hold selenium driver data"""
    login_x_path = "/html/body/div/section/header/nav/div/div[2]/div[5]/div/a"
    userid_xpath = "/html/body/div[1]/section/section/section/main/div/div/article/form/div[1]/div/div/div/div/div/input"
    password_xpath = "/html/body/div[1]/section/section/section/main/div/div/article/form/div[2]/div[1]/div/div/div/div/span/input"
    submit_login_xpath = "/html/body/div[1]/section/section/section/main/div/div/article/form/div[3]/button"
    rheader_xpath = '//*[@id="root"]/section/header/nav/div/div[2]'
    wait_period = 10

    def __init__(self, url: str = 'https://polkadot.polkassembly.io/', driver_path: str = './chromedriver', driver_logger: logging.Logger = logger) -> None:
        self.url = url
        self.driver_path = driver_path
        self.logger = driver_logger
        try:
            chrome_options = Options()
            chrome_options.add_argument("user-data-dir=chrome-data")
            # this parameter tells Chrome that it should be run without UI (Headless)
            # chrome_options.add_argument('--headless=new')
            self.driver = webdriver.Chrome(
            self.driver_path, options=chrome_options)
            self.wait = WebDriverWait(self.driver, Driver.wait_period)
            self.driver.get(self.url)
        except Exception as err:
            self.logger.debug("error in opening browser session. error is: " + str(err))
            if "please specify a unique value for --user-data-dir argument" in str(err):
                self.logger.info("browser already open")
            else:
                sys.exit()

    def get_dom_object(self, xpath: str):
        return self.wait.until(EC.presence_of_element_located((By.XPATH, xpath)))

    def is_logged_in(self) -> bool:
        try:
            is_looged_in = False
            txt = self.get_dom_object(Driver.rheader_xpath).text
            is_looged_in = False if 'Login' in txt else True
            return is_looged_in
        except Exception as err:
            self.logger.debug(err)
            return False

    def login(self) -> bool:
        try:
            self.driver.get(self.url)
            time.sleep(3)
            self.get_dom_object(Driver.login_x_path).click()
            self.get_dom_object(Driver.userid_xpath).send_keys('lopake')
            self.get_dom_object(Driver.password_xpath).send_keys('Hello-123')
            self.get_dom_object(Driver.submit_login_xpath).click()
            time.sleep(3)
            return True if self.is_logged_in() else False
        except Exception as err:
            self.logger.debug(err)
            return False


if __name__ == "__main__":
    d = Driver()
    d.login()
    print(d.is_logged_in())
