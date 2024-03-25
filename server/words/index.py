import random
import os
import spacy
from datetime import datetime
from tqdm import tqdm

nlp = spacy.load("en_core_web_lg")
current_date = datetime.now()
one_hour_ahead = current_date.replace(hour=current_date.hour + 1)
file_name = one_hour_ahead.strftime("%m-%d-%Y")
working_dir = os.path.dirname(os.path.realpath(__file__))

def work():
    with open(f"{working_dir}/words-clean.txt") as f:
        words = f.read().splitlines()

    # get the words that have already been selected
    with open(f"{working_dir}/prev-selected.txt") as f:
        prev_selected = f.read().splitlines()

    # Select a random word
    selected_word = random.choice(words)
    tmp_vector = nlp(selected_word)

    # make sure the word has a vector and that it hasn't been selected before and the length of the word is at least 5 characters
    while not tmp_vector.has_vector or selected_word in prev_selected or len(selected_word) < 5:
        selected_word = random.choice(words)
        tmp_vector = nlp(selected_word)

    selected_word_nlp = nlp(selected_word)
    print(f"Selected word: {selected_word}")

    similar_words = {}
    for word in tqdm(words):
        vectors = nlp(word)
        if not vectors.has_vector:
            continue
        # Get the score of the word
        similarity_score = selected_word_nlp.similarity(vectors)
        similar_words[word] = similarity_score

    # Sort the words by their score
    sorted_similar_words = {k: v for k, v in sorted(similar_words.items(), key=lambda item: item[1], reverse=True)}

    # assign the index of the word to the word, like word:score -> word:index
    numbered_words = {}
    for index, word in enumerate(sorted_similar_words.keys()):
        numbered_words[word] = index + 1 

    # write to a file, file name should be the current date mm-dd-yyy, with the date with the format: word:index
    with open(f"{working_dir}/days/{file_name}.txt", "w") as f:
        for word, index in numbered_words.items():
            f.write(f"{word}:{index}\n")
        print(f"File {file_name}.txt created.")

    # append to prev-selected.txt, so we ensure we don't select the same word twice
    with open(f"{working_dir}/prev-selected.txt", "a") as f:
        f.write(f"{selected_word}\n")
        print(f"File prev-selected.txt updated.")
        
if not os.path.exists(f"{working_dir}/days/{file_name}.txt"):
    print(f"File {file_name}.txt does not exist, creating.")
    work()
else:
    print(f"File {file_name}.txt already exists, skipping.")