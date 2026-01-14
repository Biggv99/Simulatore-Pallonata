// Prende le immagini (frames) necessarie per l'animazione completa
export function generaFrames(path: string, quantità: number, zeri: number): string[] {

    const frames: string[] = [];
    for (let i = 0; i < quantità; i++) {
        frames.push(`${path}${String(i).padStart(zeri, '0')}.webp`);
    }
    return frames;
}
