import pyautogui as gui
from time import sleep

PREPARE_TIME = 5
INTERVAL = 1
TEXT = '1234'

def main():
    sleep(PREPARE_TIME)
    for ch in TEXT:
        gui.typewrite(ch)
        sleep(INTERVAL)

main()

