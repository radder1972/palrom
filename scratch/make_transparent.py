from PIL import Image

def make_transparent(img_path):
    img = Image.open(img_path)
    img = img.convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        # Check if the pixel is near-white or near-grey (checkerboard background)
        # The logo itself is very dark (35, 31, 32)
        # So we can threshold: if all of R, G, B are > 100, make it transparent
        if item[0] > 100 and item[1] > 100 and item[2] > 100:
            newData.append((255, 255, 255, 0)) # transparent
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(img_path, "PNG")
    print("Successfully processed and saved transparent image.")

if __name__ == '__main__':
    make_transparent('public/images/fsc_logo.png')
