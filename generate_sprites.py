#!/usr/bin/env python3
"""
Priva-city 2000 — SimCity-2000-style isometric sprite pack generator
Produces: game/assets/tiles/, controls/, gaps/, icons/, contact-sheet.png
"""
from PIL import Image, ImageDraw, ImageFont
import os, math

GAME_ROOT = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(GAME_ROOT, "game", "assets")

for d in ["tiles", "controls", "gaps", "icons"]:
    os.makedirs(os.path.join(ASSETS, d), exist_ok=True)

# ── Color utilities ──────────────────────────────────────────────────────────
def h2r(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def dim(c, f):
    return tuple(max(0, min(255, int(x * f))) for x in c)

def add(c, d):
    return tuple(max(0, min(255, x + d)) for x in c)

def blend(c1, c2, t):
    return tuple(int(c1[i] * (1 - t) + c2[i] * t) for i in range(3))

# ── Sprite canvas constants ──────────────────────────────────────────────────
SW, SH = 64, 80      # sprite canvas (building sprites)
CX, CY = 32, 62     # tile diamond anchor
TW2, TH2 = 28, 14   # diamond half-dims (56px wide = tile fill with 4px margin each side)

def new_img(w=SW, h=SH):
    return Image.new("RGBA", (w, h), (0, 0, 0, 0))

# ── Isometric geometry ───────────────────────────────────────────────────────
def box_polys(cx=CX, cy=CY, w2=TW2, h2=TH2, ht=32):
    top   = [(cx, cy-h2-ht), (cx+w2, cy-ht), (cx, cy+h2-ht), (cx-w2, cy-ht)]
    left  = [(cx-w2, cy-ht), (cx, cy+h2-ht), (cx, cy+h2),   (cx-w2, cy)]
    right = [(cx+w2, cy-ht), (cx, cy+h2-ht), (cx, cy+h2),   (cx+w2, cy)]
    return top, left, right

def left_pt(u, v, cx=CX, cy=CY, w2=TW2, h2=TH2, ht=32):
    """(u,v) ∈ [0,1]² → pixel on left parallelogram face"""
    x = (cx - w2) + u * w2
    y = cy - ht + ht * v + h2 * u
    return (int(round(x)), int(round(y)))

def right_pt(u, v, cx=CX, cy=CY, w2=TW2, h2=TH2, ht=32):
    """(u,v) ∈ [0,1]² → pixel on right parallelogram face"""
    x = cx + u * w2
    y = cy + h2 * (1 - u) - ht * (1 - v)
    return (int(round(x)), int(round(y)))

# ── Core box renderer ────────────────────────────────────────────────────────
def draw_box(draw, color, ht=32, cx=CX, cy=CY, w2=TW2, h2=TH2, grime=0):
    """Draw isometric box. grime=0..1 makes it look run-down."""
    top_c  = dim(color, 1.0 - grime * 0.35)
    left_c = dim(color, (0.58 - grime * 0.12))
    right_c = dim(color, (0.74 - grime * 0.10))
    border_c = (*dim(color, 0.30), 220)

    top, left, right = box_polys(cx, cy, w2, h2, ht)
    draw.polygon(left,  fill=(*left_c,  255))
    draw.polygon(right, fill=(*right_c, 255))
    draw.polygon(top,   fill=(*top_c,   255))

    # Outline edges
    segs = [
        (left[0],  left[1]),  (left[1],  left[2]),
        (left[2],  left[3]),  (left[3],  left[0]),
        (right[0], right[1]), (right[1], right[2]),
        (right[2], right[3]),
        (top[0],   top[1]),   (top[3],   top[0]),
    ]
    for a, b in segs:
        draw.line([a, b], fill=border_c, width=1)

    return top, left, right

# ── Window grid renderer ─────────────────────────────────────────────────────
def draw_windows(img, color, ht=32, cx=CX, cy=CY, w2=TW2, h2=TH2,
                 rows=3, cols=2, grime=0):
    """Stamp window pixels on both side faces in isometric space."""
    draw = ImageDraw.Draw(img)
    win_c   = dim(color, 0.22 + grime * 0.05)
    shine_c = add(color, 80)

    for face in ("left", "right"):
        fn = left_pt if face == "left" else right_pt
        for row in range(rows):
            v = (row + 0.75) / rows
            for col in range(cols):
                u = (col + 0.75) / (cols + 0.3)
                wx, wy = fn(u, v, cx, cy, w2, h2, ht)
                # 2×2 window
                for dx, dy in [(0,0),(1,0),(0,1),(1,1)]:
                    px, py = wx + dx - 1, wy + dy - 1
                    if 0 <= px < img.width and 0 <= py < img.height:
                        if img.getpixel((px, py))[3] > 10:   # only on building
                            c = win_c if (dx+dy) < 2 else dim(win_c, 0.7)
                            draw.point((px, py), fill=(*c, 255))

# ── Floor band (horizontal stripe between floors) ────────────────────────────
def draw_floor_band(img, color, ht, cx=CX, cy=CY, w2=TW2, h2=TH2, floors=2):
    """Draw subtle horizontal band(s) dividing building into floors."""
    band_c = dim(color, 0.45)
    for f in range(1, floors):
        v = f / floors
        # Sweep x range and stamp band pixel if already on building
        for px in range(cx - w2, cx + w2 + 1):
            # Left face: y at x = ? parametric
            u_l = (px - (cx - w2)) / w2  # 0..1
            if 0 <= u_l <= 1:
                py_l = int(round(cy - ht + ht * v + h2 * u_l))
                if 0 <= px < img.width and 0 <= py_l < img.height:
                    if img.getpixel((px, py_l))[3] > 10:
                        img.putpixel((px, py_l), (*dim(band_c, 0.85), 255))
            # Right face
            u_r = (px - cx) / w2
            if 0 <= u_r <= 1:
                py_r = int(round(cy + h2 * (1 - u_r) - ht * (1 - v)))
                if 0 <= px < img.width and 0 <= py_r < img.height:
                    if img.getpixel((px, py_r))[3] > 10:
                        img.putpixel((px, py_r), (*dim(band_c, 0.85), 255))

# ── Rooftop feature functions ────────────────────────────────────────────────
def roof_satellite(draw, cx, cy, ht):
    """Satellite dish — Data Inventory"""
    ry = cy - TH2 - ht - 2
    # Mast
    for my in range(ry, ry+6):
        draw.point((cx, my), fill=(190, 215, 255, 255))
    # Wide dish bowl
    for dx in range(-6, 7):
        if dx*dx <= 30:
            draw.point((cx+dx, ry-2), fill=(210, 235, 255, 240))
            draw.point((cx+dx, ry-3), fill=(180, 210, 255, 180))
    # Tip
    draw.point((cx, ry-5), fill=(255, 255, 255, 255))
    draw.point((cx-1, ry-4), fill=(255, 255, 255, 200))
    draw.point((cx+1, ry-4), fill=(255, 255, 255, 200))
    # Base dish mounting
    draw.line([(cx-3, ry), (cx+3, ry)], fill=(160, 190, 230, 255), width=1)

def roof_lock(draw, cx, cy, ht):
    """Padlock — Access Control"""
    ry = cy - TH2 - ht - 1
    gold = (255, 215, 45)
    dk   = (80, 55, 0)
    brn  = (200, 160, 20)
    # Shackle arch (wider)
    for dx in range(-3, 4):
        draw.point((cx+dx, ry-6), fill=(*gold, 255))
    for dy in range(0, 5):
        draw.point((cx-3, ry-6+dy), fill=(*gold, 255))
        draw.point((cx+3, ry-6+dy), fill=(*gold, 255))
    # Body (taller)
    draw.rectangle([cx-5, ry-2, cx+5, ry+3], fill=(*gold, 255))
    draw.rectangle([cx-4, ry-1, cx+4, ry+2], fill=(*brn, 255))
    draw.point((cx, ry+1), fill=(*dk, 255))
    draw.point((cx, ry),   fill=(*dk, 255))

def roof_check(draw, cx, cy, ht):
    """Checkmark — Consent Manager"""
    ry = cy - TH2 - ht - 1
    grn  = (55, 245, 105)
    grn2 = (30, 180, 70)
    # Thick checkmark (2px wide)
    pts = [(cx-5,ry+2),(cx-4,ry+3),(cx-3,ry+4),(cx-2,ry+3),
           (cx-1,ry+2),(cx,ry+1),(cx+1,ry),(cx+2,ry-1),(cx+3,ry-2),(cx+4,ry-3),(cx+5,ry-4)]
    for i in range(len(pts)-1):
        draw.line([pts[i], pts[i+1]], fill=(*grn, 255), width=2)
    # Shadow
    for p in pts:
        draw.point((p[0]+1, p[1]+1), fill=(*grn2, 150))

def roof_envelope(draw, cx, cy, ht):
    """Envelope — DSAR Rights Desk"""
    ry = cy - TH2 - ht - 1
    org = (255, 170, 60)
    drk = (160, 80, 10)
    wht = (255, 245, 220)
    # Envelope body (larger)
    draw.rectangle([cx-6, ry-3, cx+6, ry+3], fill=(*org, 255))
    # Flap fold lines
    draw.line([(cx-6,ry-3),(cx,ry+1),(cx+6,ry-3)], fill=(*drk, 255), width=1)
    # Bottom seal
    draw.line([(cx-6,ry+3),(cx,ry-1),(cx+6,ry+3)], fill=(*dim(org,0.75), 200), width=1)
    # Stamp corner
    draw.rectangle([cx+3, ry-2, cx+5, ry], fill=(*wht, 200))

def roof_handshake(draw, cx, cy, ht):
    """Handshake / chain link — Vendor Risk Office"""
    ry = cy - TH2 - ht - 1
    pur  = (200, 160, 255)
    pur2 = (150, 100, 220)
    # Left node
    draw.ellipse([cx-8, ry-3, cx-3, ry+3], fill=(*pur, 255))
    # Right node
    draw.ellipse([cx+3, ry-3, cx+8, ry+3], fill=(*pur, 255))
    # Connecting bridge
    draw.rectangle([cx-3, ry-1, cx+3, ry+1], fill=(*pur2, 255))
    # Link dots
    draw.point((cx, ry), fill=(255, 255, 255, 200))

def roof_clipboard(draw, cx, cy, ht):
    """Clipboard — DPIA Assessment Center"""
    ry = cy - TH2 - ht - 1
    blu  = (145, 220, 255)
    drk  = (55, 130, 210)
    clip = (110, 180, 225)
    # Clipboard board
    draw.rectangle([cx-5, ry-4, cx+5, ry+3], fill=(*blu, 255))
    # Top clip
    draw.rectangle([cx-2, ry-6, cx+2, ry-4], fill=(*clip, 255))
    draw.rectangle([cx-1, ry-7, cx+1, ry-5], fill=(*dim(clip,0.8), 255))
    # Lines (3 data lines)
    for i, dy in enumerate([-3, -1, 1]):
        lc = drk if i < 2 else dim(drk, 0.7)
        draw.line([(cx-3, ry+dy), (cx+3, ry+dy)], fill=(*lc, 220), width=1)

def roof_server(draw, cx, cy, ht):
    """Server rack — AI Model Registry"""
    ry = cy - TH2 - ht - 1
    casing = (30, 20, 55)
    lit    = [(0, 255, 110), (80, 40, 255), (0, 200, 255), (255, 100, 0)]
    # Server cabinet body
    draw.rectangle([cx-6, ry-7, cx+6, ry+3], fill=(*casing, 255))
    # Server rows with blinky lights
    for i, ly in enumerate(range(ry-6, ry+4, 2)):
        draw.line([(cx-5, ly), (cx+3, ly)], fill=(55, 45, 90, 200), width=1)
        draw.rectangle([cx+4, ly-1, cx+6, ly+1],
                       fill=(*lit[i % len(lit)], 255))
    # Logo strip at top
    draw.line([(cx-5, ry-7), (cx+5, ry-7)], fill=(100, 80, 180, 200), width=1)

def roof_cross(draw, cx, cy, ht):
    """Red cross — Incident Response"""
    ry = cy - TH2 - ht - 1
    wht = (255, 255, 255)
    red = (255, 35, 60)
    drk = (180, 10, 30)
    # White background square
    draw.rectangle([cx-5, ry-5, cx+5, ry+3], fill=(*wht, 255))
    # Red cross (thick)
    draw.rectangle([cx-2, ry-5, cx+2, ry+3], fill=(*red, 255))  # vertical
    draw.rectangle([cx-5, ry-2, cx+5, ry+1], fill=(*red, 255))  # horizontal
    # Outline
    draw.rectangle([cx-5, ry-5, cx+5, ry+3], outline=(*drk, 200))

ROOFTOPS = {
    "inventory": roof_satellite,
    "access":    roof_lock,
    "consent":   roof_check,
    "dsar":      roof_envelope,
    "vendor":    roof_handshake,
    "dpia":      roof_clipboard,
    "registry":  roof_server,
    "incident":  roof_cross,
}

# ── Ground tiles ─────────────────────────────────────────────────────────────
DISTRICT_TILES = [
    ("hr-district",       "#3b78d8"),
    ("customer-district", "#1fa99a"),
    ("ai-district",       "#8a6bf0"),
    ("neutral",           "#2a3650"),
]

def make_ground_tile(filename, color_hex):
    W, H = 64, 48
    img = new_img(W, H)
    draw = ImageDraw.Draw(img)
    c = h2r(color_hex)
    c2 = dim(c, 0.78)
    c3 = dim(c, 0.55)
    cx, cy, w2, h2 = 32, 24, TW2, TH2

    diamond = [(cx, cy-h2), (cx+w2, cy), (cx, cy+h2), (cx-w2, cy)]
    draw.polygon(diamond, fill=(*c, 255))

    # Checkerboard sub-texture (3px cells)
    for px in range(W):
        for py in range(H):
            if abs(px-cx)/w2 + abs(py-cy)/h2 <= 1.0:
                if ((px//3) + (py//3)) % 2 == 1:
                    img.putpixel((px, py), (*c2, 255))

    # Re-fill outline
    draw.polygon(diamond, outline=(*c3, 255))

    # Light edge highlights (top-left edges = lit direction)
    # Top-left edge of diamond: from left-mid to top
    for i in range(w2):
        lx = cx - w2 + i
        ly = cy - int(i * h2 / w2)
        if 0 <= lx < W and 0 <= ly < H:
            img.putpixel((lx, ly), (*add(c, 25), 255))

    path = os.path.join(ASSETS, "tiles", filename + ".png")
    img.save(path)
    print(f"  tiles/{filename}.png")
    return path

# ── Control buildings ─────────────────────────────────────────────────────────
CONTROLS = [
    {"id": "inventory", "color": "#3fb0ff", "ht": 38, "label": "Data Inventory & Mapping"},
    {"id": "access",    "color": "#ffd34d", "ht": 26, "label": "Access Control"},
    {"id": "consent",   "color": "#54d68a", "ht": 34, "label": "Consent Manager"},
    {"id": "dsar",      "color": "#ff9d5c", "ht": 24, "label": "DSAR / Rights Desk"},
    {"id": "vendor",    "color": "#c0a3ff", "ht": 30, "label": "Vendor Risk Office"},
    {"id": "dpia",      "color": "#7bd0ff", "ht": 36, "label": "DPIA / Assessment Center"},
    {"id": "registry",  "color": "#b388ff", "ht": 42, "label": "AI Model Registry"},
    {"id": "incident",  "color": "#ff7a90", "ht": 28, "label": "Incident Response (DPO)"},
]

def add_top_face_detail(img, color, ht, cx=CX, cy=CY, w2=TW2, h2=TH2):
    """Add a lighter crown edge + subtle cross-hatch to the top face."""
    crown_c = add(color, 45)
    # Top edge of top diamond (the ridge facing the light)
    # Left-top edge: from (cx, cy-h2-ht) to (cx-w2, cy-ht)
    steps = w2
    for i in range(steps + 1):
        t = i / steps
        px = int(round(cx - t * w2))
        py = int(round(cy - h2 - ht + t * h2))
        for off in range(2):
            nx, ny = px + off, py + off
            if 0 <= nx < img.width and 0 <= ny < img.height:
                cur = img.getpixel((nx, ny))
                if cur[3] > 10:
                    img.putpixel((nx, ny), (*crown_c, 255))

def make_control(ctrl):
    img = new_img()
    draw = ImageDraw.Draw(img)
    c   = h2r(ctrl["color"])
    ht  = ctrl["ht"]
    rows = 3 if ht >= 34 else 2

    # Main box
    draw_box(draw, c, ht)
    # Top-face crown highlight (SimCity 2000 edge gleam)
    add_top_face_detail(img, c, ht)
    # Floor bands (more for taller buildings)
    draw_floor_band(img, c, ht, floors=2 if ht >= 32 else 1)
    # Windows
    draw_windows(img, c, ht, rows=rows)
    # Rooftop feature
    ROOFTOPS[ctrl["id"]](draw, CX, CY, ht)

    # Subtle glow at base
    draw.ellipse([CX-5, CY+TH2-1, CX+5, CY+TH2+3], fill=(*c, 45))

    path = os.path.join(ASSETS, "controls", ctrl["id"] + ".png")
    img.save(path)
    print(f"  controls/{ctrl['id']}.png")
    return path

# ── Gap buildings ─────────────────────────────────────────────────────────────
GAPS = [
    ("unmapped",  "#806040", "Unmapped Data Store"),
    ("access",    "#707060", "No Access Controls"),
    ("consent",   "#6a5080", "Missing Consent"),
    ("dsar",      "#7a5030", "No Rights Path"),
    ("vendor",    "#506070", "Vendor w/o DPA"),
    ("breach",    "#7a3030", "Breach Exposed"),
    ("dpia",      "#606070", "AI w/o Assessment"),
    ("shadowai",  "#303050", "Shadow / Undocumented AI"),
]

def draw_warning_marker(draw, cx, cy, ht):
    """⚠ triangle above building"""
    my = cy - ht - TH2 - 9
    pts = [(cx, my-5), (cx-5, my+3), (cx+5, my+3)]
    draw.polygon(pts, fill=(255, 190, 0, 255))
    draw.point((cx, my),   fill=(30, 20, 0, 255))
    draw.point((cx, my+1), fill=(30, 20, 0, 255))
    draw.point((cx, my+2), fill=(30, 20, 0, 255))

def draw_resolved_marker(draw, cx, cy, ht):
    """✓ checkmark above building"""
    my = cy - ht - TH2 - 7
    grn = (50, 230, 100)
    pts = [(cx-5,my+2),(cx-3,my+4),(cx-1,my+3),(cx+1,my+1),(cx+3,my-2),(cx+5,my-4)]
    for i in range(len(pts)-1):
        draw.line([pts[i], pts[i+1]], fill=(*grn, 255), width=1)

def make_gap(gap_id, color_hex, resolved=False):
    img = new_img()
    draw = ImageDraw.Draw(img)
    c   = h2r(color_hex)
    ht  = 20

    if resolved:
        c = blend(c, (180, 210, 160), 0.35)   # green-ish clean tint

    draw_box(draw, c, ht, grime=0 if resolved else 0.4)
    draw_windows(img, c, ht, rows=2, cols=2, grime=0 if resolved else 0.5)

    if not resolved:
        # Cracks on left face (ominous detail)
        crack_c = (*dim(c, 0.3), 180)
        lx = CX - TW2 // 2
        base_y = int(CY - ht * 0.5 + TH2 * 0.3)
        draw.line([(lx, base_y), (lx+2, base_y+4)], fill=crack_c, width=1)
        draw.line([(lx+2, base_y+4), (lx+1, base_y+8)], fill=crack_c, width=1)
        draw_warning_marker(draw, CX, CY, ht)
    else:
        draw_resolved_marker(draw, CX, CY, ht)

    state = "resolved" if resolved else "warning"
    path = os.path.join(ASSETS, "gaps", f"{gap_id}-{state}.png")
    img.save(path)
    print(f"  gaps/{gap_id}-{state}.png")
    return path

# ── Palette icons (32×32) ────────────────────────────────────────────────────
ICONS = [
    ("inventory", "#3fb0ff"),
    ("access",    "#ffd34d"),
    ("consent",   "#54d68a"),
    ("dsar",      "#ff9d5c"),
    ("vendor",    "#c0a3ff"),
    ("dpia",      "#7bd0ff"),
    ("registry",  "#b388ff"),
    ("incident",  "#ff7a90"),
    ("heatmap",   "#ff6040"),
    ("bulldoze",  "#d0a050"),
]

def make_icon(name, color_hex):
    img = new_img(32, 32)
    draw = ImageDraw.Draw(img)
    c = h2r(color_hex)

    # Rounded square bg
    draw.rounded_rectangle([1, 1, 30, 30], radius=5, fill=(*dim(c, 0.28), 255))
    draw.rounded_rectangle([2, 2, 29, 29], radius=4, fill=(*c, 255))

    # Mini isometric building
    mc, mcy = 16, 20
    mw2, mh2, mht = 10, 5, 10
    top, left, right = box_polys(mc, mcy, mw2, mh2, mht)
    draw.polygon(left,  fill=(*dim(c, 0.52), 255))
    draw.polygon(right, fill=(*dim(c, 0.68), 255))
    top_c = add(c, 25) if max(c) < 230 else c
    draw.polygon(top,   fill=(*top_c, 255))

    # Dark outline
    oc = (*dim(c, 0.25), 200)
    for pts in [left, right, top]:
        draw.polygon(pts, outline=oc)

    path = os.path.join(ASSETS, "icons", name + ".png")
    img.save(path)
    print(f"  icons/{name}.png")
    return path

# ── Contact sheet ─────────────────────────────────────────────────────────────
def make_contact_sheet(all_files):
    BG  = (18, 26, 46, 255)
    PAD = 10
    LABEL_H = 18
    GAP     = 6

    sections = [
        ("Ground Tiles",               [p for p in all_files if "/tiles/" in p],          64, 48),
        ("Control Buildings",          [p for p in all_files if "/controls/" in p],       64, 80),
        ("Gap Buildings — Unresolved", [p for p in all_files if "warning" in p],          64, 80),
        ("Gap Buildings — Resolved",   [p for p in all_files if "resolved" in p],         64, 80),
        ("Palette Icons",              [p for p in all_files if "/icons/" in p],          32, 32),
    ]

    row_widths  = [PAD*2 + len(imgs)*(w+GAP) - GAP for _, imgs, w, _ in sections]
    row_heights = [LABEL_H + h + PAD for _, _, _, h in sections]
    total_w = max(row_widths) + PAD
    total_h = PAD + sum(row_heights) + PAD * len(sections)

    sheet = Image.new("RGBA", (total_w, total_h), BG)
    draw  = ImageDraw.Draw(sheet)

    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 11)
    except Exception:
        font = ImageFont.load_default()

    y = PAD
    for label, imgs, w, h in sections:
        draw.text((PAD, y), label, fill=(180, 200, 240, 255), font=font)
        y += LABEL_H
        for i, path in enumerate(sorted(imgs)):
            try:
                spr = Image.open(path).convert("RGBA")
                spr = spr.resize((w, h), Image.NEAREST)
                sheet.alpha_composite(spr, (PAD + i*(w+GAP), y))
            except Exception as e:
                print(f"  Warning: could not load {path}: {e}")
        y += h + PAD * 2

    out = os.path.join(ASSETS, "contact-sheet.png")
    sheet.save(out)
    print(f"\nContact sheet: {out}")
    return out

# ── Main ──────────────────────────────────────────────────────────────────────
all_files = []

print("=== Ground tiles ===")
for name, color in DISTRICT_TILES:
    all_files.append(make_ground_tile(name, color))

print("\n=== Control buildings ===")
for ctrl in CONTROLS:
    all_files.append(make_control(ctrl))

print("\n=== Gap buildings ===")
for gap_id, color, label in GAPS:
    all_files.append(make_gap(gap_id, color, resolved=False))
    all_files.append(make_gap(gap_id, color, resolved=True))

print("\n=== Palette icons ===")
for name, color in ICONS:
    all_files.append(make_icon(name, color))

print("\n=== Contact sheet ===")
all_files.append(make_contact_sheet(all_files))

print(f"\nTotal sprites generated: {len(all_files)-1}")
print("Done.")
