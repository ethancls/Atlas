#!/bin/bash

# Chemin du répertoire courant
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
INPUT_FILE="$DIR/playlist.m3u"
OUTPUT_FILE="$DIR/playlist_filtered.m3u"

echo "Filtrage de la playlist pour ne garder que les chaînes FR et EN..."
python3 "$DIR/filter_playlist.py" "$INPUT_FILE" "$OUTPUT_FILE"

if [ $? -eq 0 ] && [ -f "$OUTPUT_FILE" ]; then
    echo "Taille du fichier original: $(du -h "$INPUT_FILE" | cut -f1)"
    echo "Taille du fichier filtré: $(du -h "$OUTPUT_FILE" | cut -f1)"
    
    # Option pour remplacer l'original si souhaité
    read -p "Voulez-vous remplacer l'original par la version filtrée? (o/n): " choice
    if [ "$choice" = "o" ] || [ "$choice" = "O" ]; then
        mv "$OUTPUT_FILE" "$INPUT_FILE"
        echo "Fichier original remplacé par la version filtrée."
    fi
else
    echo "Erreur lors du filtrage de la playlist."
fi 