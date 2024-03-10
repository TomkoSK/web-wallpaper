from PIL import Image
import requests
import time
import os
import random

url = "http://127.0.0.1:8080/download"

while True:
    response = requests.get(url)
    if(response.status_code == 200):
        with open("download.png", "wb") as f:
            f.write(response.content)
        img = Image.open('download.png')
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
        command = f"qdbus org.kde.plasmashell /PlasmaShell org.kde.PlasmaShell.evaluateScript \'string:desktops().forEach(d => {{ d.wallpaperPlugin = \"org.kde.image\"; d.currentConfigGroup = Array(\"Wallpaper\", \"org.kde.image\", \"General\"); d.writeConfig(\"Image\", \"file:///home/tomas/Repos/web-wallpaper/images/img{name}.png\") }})\'"
        os.system(command)
    else:
        print("Image failed to download:", response.status_code)
    time.sleep(5)