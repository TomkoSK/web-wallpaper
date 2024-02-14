from PIL import Image
import time
import os
import random

while True:
    img = Image.open('canvas.png')
    img = img.convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        if item[3] == 0:
            newData.append((255, 255, 255, 255))
        else:
            newData.append(item)

    img.putdata(newData)
    name = ""
    for i in range(12):
        name += str(random.randint(0, 9))
    img.save(f"./images/img{name}.png", "PNG")
    os.system(f"plasma-apply-wallpaperimage /home/tomas/Desktop/website/images/img{name}.png")
    time.sleep(5)