from PIL import Image

img = Image.open('images/levels.png')
img = img.convert('RGBA')

pixdata = img.load()

levels = []
levelCount = (img.size[1] + 1) // 21
print('Converting {} levels'.format(levelCount))

for lvl in range(levelCount):
	l = []
	for y in range(20):
		l.append(['.'] * 24)
		for x in range(24):
			imgx = x
			imgy = lvl * 21 + y
			tile = '.'
			if pixdata[imgx, imgy] == (255, 255, 255, 255):
				tile = '.'
			elif pixdata[imgx, imgy] == (0, 0, 0, 255):
				tile = '#'
			elif pixdata[imgx, imgy] == (0, 0, 255, 255):
				tile = '%'
			elif pixdata[imgx, imgy] == (0, 128, 255, 255):
				tile = '!'
			elif pixdata[imgx, imgy] == (255, 0, 255, 255):
				tile = '+'
			elif pixdata[imgx, imgy] == (255, 0, 0, 255):
				tile = '$'
			elif pixdata[imgx, imgy] == (0, 255, 0, 255):
				tile = '@'
			elif pixdata[imgx, imgy] == (255, 255, 0, 255):
				tile = '>'
			elif pixdata[imgx, imgy] == (255, 128, 0, 255):
				tile = 'X'
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
	for y in range(20):
		output += '      "' + ''.join(lvl[y])
		if y != 19:
			output += '",\n'
	output += '"\n    ]'
output += '\n  ]\n}\n'

with open('data/levels.json', 'w') as f:
	f.write(output)
print('saved')
