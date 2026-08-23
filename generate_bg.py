import os
from PIL import Image
import pjsk_background_gen_PIL as pjsk_bg

base_dir = "/data/data/com.termux/files/home/sonolus-express-server/source/levels"

for level_name in os.listdir(base_dir):
    level_path = os.path.join(base_dir, level_name)
    cover_path = os.path.join(level_path, "cover.png")

    if not os.path.isfile(cover_path):
        continue

    print(f"Processing {level_name}...")
    img = Image.open(cover_path)
    result = pjsk_bg.render_v3(img)
    result.save(cover_path)

print("All finished!")
