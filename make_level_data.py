from PIL import Image

img = Image.open('images/levels.png')
img = img.convert('RGBA')

pixdata = img.load()

levels = []
levelCount = (img.size[1]) // 11
print('Converting {} levels'.format(levelCount))

for lvl in range(levelCount):
    l = []
    for y in range(10):
        l.append(['.'] * 12)
        for x in range(12):
            imgx = x
            imgy = img.size[1] - lvl * 11 - y - 1
            tile = '.'
            if pixdata[imgx, imgy] == (255, 255, 255, 255):
                tile = '.'
            elif pixdata[imgx, imgy] == (0, 0, 0, 255):
                tile = '#'
            elif pixdata[imgx, imgy] == (128, 128, 128, 255):
                tile = '$'
            elif pixdata[imgx, imgy] == (0, 38, 255, 255):
                tile = 'G'
            elif pixdata[imgx, imgy] == (127, 0, 0, 255):
                tile = 'X'
            elif pixdata[imgx, imgy] == (255, 0, 0, 255):
                tile = 'x'
            elif pixdata[imgx, imgy] == (178, 0, 255, 255):
                tile = ' '
            # elif pixdata[imgx, imgy] == (255, 0, 0, 255):
            #     tile = '$'
            # elif pixdata[imgx, imgy] == (0, 255, 0, 255):
            #     tile = '@'
            # elif pixdata[imgx, imgy] == (255, 255, 0, 255):
            #     tile = '>'
            # elif pixdata[imgx, imgy] == (255, 128, 0, 255):
            #     tile = 'X'
            else:
                print('Bad color: {}'.format(pixdata[imgx, imgy]))
            l[y][x] = tile
    levels.append(l)

output = '{\n  "levels": ['
needComma = False
for lvl in levels:
    if needComma:
        output += ',\n'
    else:
        output += '\n'
        needComma = True
    output += '    [\n'
    for y in range(10):
        output += '      "' + ''.join(lvl[y])
        if y != 9:
            output += '",\n'
    output += '"\n    ]'
output += '\n  ]\n}\n'

with open('data/levels.json', 'w') as f:
    f.write(output)
print('saved')
