from PIL import Image

img = Image.open('tilesRaw.png')
img = img.convert('RGBA')

pixdata = img.load()

for y in range(img.size[1]):
    for x in range(img.size[0]):
        if pixdata[x, y] == (200, 191, 231, 255):
            pixdata[x, y] = (0, 0, 0, 0)
        if pixdata[x, y] == (163, 73, 164, 255):
            pixdata[x, y] = (0, 0, 0, 0)
        if pixdata[x, y] == (239, 228, 176, 255):
            pixdata[x, y] = (255, 230, 160, 255)

img.save('tiles.png')
