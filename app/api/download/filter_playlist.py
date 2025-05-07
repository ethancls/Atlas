#!/usr/bin/env python3

import re
import os
import sys

def filter_playlist(input_file, output_file):
    """
    Filtre un fichier playlist M3U en ne gardant que les entrées avec FR ou EN dans le tvg-name.
    """
    if not os.path.exists(input_file):
        print(f"Erreur: Le fichier {input_file} n'existe pas.")
        return False
    
    with open(input_file, 'r', encoding='utf-8', errors='ignore') as f_in:
        with open(output_file, 'w', encoding='utf-8') as f_out:
            # Écrire l'en-tête M3U
            f_out.write("#EXTM3U\n")
            
            keep_next_line = False
            line_count = 0
            kept_count = 0
            
            for line in f_in:
                line_count += 1
                if line.startswith('#EXTINF'):
                    # Recherche tvg-name dans la ligne EXTINF
                    tvg_name_match = re.search(r'tvg-name="([^"]*)"', line)
                    
                    if tvg_name_match:
                        tvg_name = tvg_name_match.group(1)
                        # Garder seulement si FR ou EN est présent dans le tvg-name
                        if 'FR' in tvg_name or 'EN' in tvg_name:
                            f_out.write(line)
                            keep_next_line = True
                            kept_count += 1
                        else:
                            keep_next_line = False
                    else:
                        # Pas de tvg-name trouvé, ne pas garder
                        keep_next_line = False
                elif line.startswith('#EXTM3U'):
                    # Déjà écrit l'en-tête
                    continue
                elif keep_next_line:
                    # C'est l'URL qui suit une ligne EXTINF qu'on souhaite garder
                    f_out.write(line)
                    keep_next_line = False
    
    print(f"Traitement terminé. {kept_count} chaînes conservées sur {line_count} lignes traitées.")
    return True

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python filter_playlist.py <input_file> <output_file>")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    if filter_playlist(input_file, output_file):
        print(f"Playlist filtrée enregistrée dans {output_file}") 