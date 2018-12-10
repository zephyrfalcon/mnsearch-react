#!/usr/bin/env python3
# Script to generate cards.json from existing YAML data.
# Requires: PyYAML library

import json
import os
import string
#
import yaml

whereami = os.path.dirname(os.path.abspath(__file__))
filenames = os.listdir(whereami)
yaml_files = [fn for fn in filenames if fn.endswith('.yaml')]

carddata = []

REGIONS = {
    "Arderial": "AR",
    "Cald": "CA",
    "Naroom": "NM",
    "Orothe": "OR",
    "Underneath": "UD",
    "Universal": "UV",
    "Core": "CO",
    "Kybar's Teeth": "KT",
    "Weave": "WV",
    "Bograth": "BG",
    "Paradwyn": "PA",
    "d'Resh": "DR",
    "Nar": "NR",
}

KEEP = string.ascii_letters + string.digits + " -"
REPLACE = { ' ': '_' }
def normalize_cardname(name):
    chars = [c for c in name if c in KEEP]
    name = ''.join(chars)
    for key, value in REPLACE.items():
        name = name.replace(key, value)
    name = name.replace("__", "_")
    return name

def cardname_to_image(card):
    name = normalize_cardname(card['name'])

    # add suffix for dual regions, if appropriate
    suffix = ""
    if len(card['regions']) > 1:
        suffix = '_' + REGIONS[card['regions'][0]]

    path = os.path.join("/cardimages", card['set'], name + suffix + ".jpg")
    return path

counter = 1
for fn in yaml_files:
    print("Loading:", fn, "...")
    with open(fn, 'r') as f:
        data = f.read()
    raw_data = yaml.load(data)
    #raw_data = [card for card in raw_data if 'name' in card]
    # nudge data a bit for JSON
    for idx, card in enumerate(raw_data):
        if 'reference' in card:
            region = card['region']
            other_card = [c for c in raw_data if c.get('name') == card['reference']][0]
            raw_data[idx] = other_card.copy()
            raw_data[idx]['region'] = region
    for card in raw_data:
        card['set'] = fn[:2]
        card['key'] = counter
        card['regions'] = [s.strip() for s in card['region'].split(',') if s.strip()]
        del card['region']
        card['image'] = cardname_to_image(card)
        counter += 1
    carddata.extend(raw_data)

# verify some things
print("Verifying...")
for card in carddata:
    assert 'artist' in card, repr(card)
    assert type(card['artist']) == str, repr(card)
    if 'effects' in card:
        assert isinstance(card['effects'], list), card
        assert all('name' in e for e in card['effects']), card

# sort card data by name
carddata.sort(key=lambda c: c['name'].lower())

print("Writing output file...")
js_out_path = os.path.join(whereami, "..", "src", "cards.json")
with open(js_out_path, 'w') as g:
    json.dump(carddata, g, sort_keys=True, indent=4)

print("OK")
