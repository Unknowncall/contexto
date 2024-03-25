# go into the words.txt and remove all the words that are not atleast 4 characters long

with open("words.txt") as f:
    words = f.read().splitlines()

words = [word for word in words if len(word) >= 3]

with open("words-clean.txt", "w") as f:
    f.write("\n".join(words))
    