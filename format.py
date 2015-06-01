# Javascript formatter, *not finished* *do not use*.
# Enforces consistent style across all files.

import re

file = open("test.txt", "r")
data = file.read()
file.close()

file = open("out.txt", "w")

data = re.sub("([,](?![\s]))", ", ", data)
data = re.sub("[)][{]", ") {", data)
data = re.sub("([=][=](?![\s]))", " == ", data)
data = re.sub("([!][=](?![\s]))", " != ", data)
data = re.sub("([<][=](?![\s]))", " <= ", data)
data = re.sub("([>][=](?![\s]))", " >= ", data)
data = re.sub("([&][&](?![\s]))", " && ", data)
data = re.sub("([|][|](?![\s]))", " || ", data)

file.write(data)
file.close()
