import pytest
import time
import random
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

@pytest.fixture(scope="function")
def open_game():
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--window-size=1200,800")
    driver = webdriver.Chrome(options=options)
    driver.get("https://shahriar-nehal.github.io/SWE/")
    
    yield driver

    driver.quit()

def test_credit_modal(open_game):
    driver = open_game
    assert "Whack" in driver.title

    # Wait until credit button is visible
    credit_button = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.ID, "creditButton"))
    )
    time.sleep(0.5)  # give time for modal animations
    credit_button.click()

    # Now wait for modal to be displayed
    credit_modal = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.ID, "creditModal"))
    )
    assert credit_modal.is_displayed()

    # Assert information is present
    modal_text = credit_modal.text
    
    assert "Whack-a-Mole: Progressive Edition" in modal_text
    assert "Md. Asaf-uddowla Golap" in modal_text
    assert "2025" in modal_text
    assert "1.0.0" in modal_text
    assert "© 2025 Team Alpha. All rights reserved." in modal_text


def test_page_title(open_game):
    driver = open_game
    assert driver.title == "Whack-a-Mole Game"
    
def test_start_game(open_game):
    driver = open_game
    start_button = driver.find_element(By.ID, "startButton")
    start_button.click()
    time.sleep(2)
    
    timer_text = driver.find_element(By.ID, "timerDisplay").text
    assert "time: 43s" in timer_text.lower(), f"Timer text format incorrect: '{timer_text}'"

def test_exit_game_button(open_game):
    driver = open_game
    wait = WebDriverWait(driver, 15)

    # Click start game button
    start_button = wait.until(EC.element_to_be_clickable((By.ID, "startButton")))
    start_button.click()

    # Wait for the game canvas to appear
    canvas = wait.until(EC.visibility_of_element_located((By.TAG_NAME, "canvas")))
    assert canvas.is_displayed()

    # Let the game run
    time.sleep(5)

    # Click Exit Game
    exit_button = wait.until(EC.element_to_be_clickable((By.ID, "exitButton")))
    exit_button.click()
    
    #Wait for game over modal to appear
    game_over_modal = wait.until(EC.visibility_of_element_located((By.ID, "gameOverModal")))
    assert game_over_modal.is_displayed()


def test_game_over(open_game):
    driver = open_game
    wait = WebDriverWait(driver, 15)

    # Click start game button
    start_button = wait.until(EC.element_to_be_clickable((By.ID, "startButton")))
    start_button.click()

    # Wait for the game canvas to appear
    canvas = wait.until(EC.visibility_of_element_located((By.TAG_NAME, "canvas")))
    assert canvas.is_displayed()

    # Let the game run enough to finish
    time.sleep(45)

    
    #Wait for game over modal to appear
    game_over_modal = wait.until(EC.visibility_of_element_located((By.ID, "gameOverModal")))
    assert game_over_modal.is_displayed()
