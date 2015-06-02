#!/usr/bin/env python

#Formats all code using js-beautify to enforce a standard style

from subprocess import call
import os

include = {
    "dir": ["src"]
}

exclude = {
    "dir": ["lib", "pixi"],
    "file": ["require.js"]
}

def is_exclude(root, file):
    for d in include["dir"]:
        if d not in root:
            return True
    for d in exclude["dir"]:
        if d in root:
            return True
    for f in exclude["file"]:
        if f in file:
            return True
    return False

formatted = 0

for root, dirs, files in os.walk("."):
    for file in files:
        if is_exclude(root, file):
            continue;
        path = os.path.join(root, file)
        call("python ./format/js-beautify -r -n " + path, shell=True)
        formatted += 1
