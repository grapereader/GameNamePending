from tkinter import *
from tkinter.ttk import *
import json
import math

types = {
    "Empty": "#FFF",
    "Wall": "#F00",
    "Path": "#0F0",
    "Chest": "#00F",
    "Torch": "#FB0",
    "Door": "#000"
}

for k, v in types.items():
    print(k + ": " + v)

def menu():
    print("0 - Quit")
    print("1 - Load JSON")
    print("2 - New")
    return input("Select: ")

def draw_at(xPos, yPos, tile):
    if yPos >= len(grid[0]):
        for x in grid:
            for y in range(0, yPos - len(x) + 1):
                x.append("Empty")
    if xPos >= len(grid):
        for x in range(0, xPos - len(grid) + 1):
            ap = []
            for y in range(0, len(grid[0])):
                ap.append("Empty")
            grid.append(ap)
    grid[xPos][yPos] = tile

def draw_grid():
    canvas.delete("all")
    for x in range(0, len(grid)):
        for y in range(0, len(grid[x])):
            tx = x * 64
            ty = y * 64
            canvas.create_rectangle(tx, ty, tx + 64, ty + 64, fill=types[grid[x][y]])

def mouse(event):
    tx = math.floor(event.x / 64)
    ty = math.floor(event.y / 64)
    draw_at(tx, ty, type)
    draw_grid()

def set_type(t):
    global type
    print("Drawing " + t + "s")
    type = t

def create_button(root, t):
    button = Button(root, text=t, command=lambda: set_type(t))
    button.pack(side=LEFT, padx=5, pady=5)

def load_finished(root, text):
    contents = text.get(1.0, END)
    root.destroy()
    grid = json.loads(contents)
    create_editor(grid)

def load_room():
    root = Tk()
    root.title("JSON input")
    root.geometry("600x415")
    root.resizable(0,0)
    root.wm_attributes("-topmost", 1)

    text = Text(root)
    text.pack()
    Button(root, text="Okay", command=lambda: load_finished(root, text)).pack()
    root.mainloop()

def export_room():
    root = Tk()
    root.title("JSON export")
    root.geometry("600x390")
    root.resizable(0,0)
    root.wm_attributes("-topmost", 1)

    text = Text(root)
    text.pack()
    json_string = json.dumps(grid)
    text.insert(END, json_string)
    root.mainloop()

def create_editor(g):
    global type, grid, canvas
    type = "Empty"
    grid = g
    
    root = Tk()
    root.title("GameNamePending Room editor")
    root.minsize(500, 500)
    root.geometry("1024x1024")
    
    menubar = Menu(root)
    file = Menu(menubar)
    file.add_command(label="Export", command=export_room)
    menubar.add_cascade(label="File", menu=file)
    root.config(menu=menubar)

    frame = Frame(root, relief=RAISED, borderwidth=1)
    frame.pack(fill=BOTH, expand=1)
    
    canvas = Canvas(frame)
    canvas.create_rectangle(10, 10, 50, 50, fill="#000")
    canvas.pack(fill=BOTH, expand=1)

    canvas.bind("<B1-Motion>", mouse)
    
    for t in types:
        create_button(root, t)
    
    draw_grid()
    
    root.mainloop()

while True:
    op = menu()
    if op == "0":
        break
    elif op == "1":
        load_room()
    elif op == "2":
        create_editor([["Empty"]])
    else:
        print("Wat?")
