import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';

export async function GET(req: NextRequest): Promise<Response> {
    // Récupérer la query "search" de l'URL
    const { searchParams } = req.nextUrl;
    const searchQuery = searchParams.get('search');

    if (!searchQuery) {
        return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
    }

    // Exécuter le script Python
    const pythonProcess = spawn('python3', ['-c', `
from youtubesearchpython import VideosSearch
import sys
import json
try:
    search_query = sys.argv[1]
    videosSearch = VideosSearch(search_query, limit=1)
    print(json.dumps(videosSearch.result()))
except Exception as e:
    print(json.dumps({"error": str(e)}), file=sys.stderr)
`, searchQuery]);

    let result = '';
    let errorOutput = '';

    // Collecte des données stdout
    pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
    });

    // Collecte des erreurs stderr
    pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
    });

    // Retourner une réponse après la fin du processus
    return new Promise((resolve) => {
        pythonProcess.on('close', (code) => {
            if (code !== 0 || errorOutput) {
                console.error(`Erreur Python : ${errorOutput}`);
                resolve(NextResponse.json(
                    { error: 'Erreur lors de l’exécution du script Python', details: errorOutput.trim() },
                    { status: 500 }
                ));
            } else {
                try {
                    // Nettoyage et parsing de la sortie Python
                    const trimmedResult = result.trim();
                    // console.log(`Résultat brut Python : ${trimmedResult}`);
                    const parsedResult = JSON.parse(trimmedResult); // Tente de parser le JSON
                    resolve(NextResponse.json(parsedResult, { status: 200 }));
                } catch (error) {
                    console.error('Erreur de parsing JSON :', error);
                    resolve(NextResponse.json(
                        { error: 'Erreur de parsing des données Python'},
                        { status: 500 }
                    ));
                }
            }
        });
    });
}