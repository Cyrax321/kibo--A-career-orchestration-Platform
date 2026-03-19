from PIL import Image
import sys
from collections import deque

img = Image.open(sys.argv[1]).convert("RGBA")
pixels = img.load()
w, h = img.size

# Track which pixels to make transparent via flood-fill from edges
visited = [[False]*h for _ in range(w)]
queue = deque()

def is_near_white(r, g, b):
    return r > 235 and g > 235 and b > 235

# Seed from all edge pixels that are near-white
for x in range(w):
    for y in [0, h-1]:
        r, g, b, a = pixels[x, y]
        if is_near_white(r, g, b):
            queue.append((x, y))
            visited[x][y] = True

for y in range(h):
    for x in [0, w-1]:
        r, g, b, a = pixels[x, y]
        if is_near_white(r, g, b) and not visited[x][y]:
            queue.append((x, y))
            visited[x][y] = True

# BFS flood-fill — only spread to neighboring near-white pixels
while queue:
    cx, cy = queue.popleft()
    pixels[cx, cy] = (255, 255, 255, 0)  # Make transparent
    for dx, dy in [(-1,0),(1,0),(0,-1),(0,1)]:
        nx, ny = cx+dx, cy+dy
        if 0 <= nx < w and 0 <= ny < h and not visited[nx][ny]:
            r, g, b, a = pixels[nx, ny]
            if is_near_white(r, g, b):
                visited[nx][ny] = True
                queue.append((nx, ny))

img.save(sys.argv[2], "PNG")
print("Done — flood-fill background removal (edges only)")
