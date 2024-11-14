class Pentagrama {
    constructor() {
        this.compases = [];
    }

    addCompas(compas) {
        this.compases.push(compas);
    }

    addCrescendo(prvCompasIndex, prvNotaIndex, compasIndex, notaIndex,crescendos) {
        let dir;
        if (prvCompasIndex <= compasIndex)
            dir = '+';

        if (prvCompasIndex > compasIndex)
            dir = '-';

        if (prvCompasIndex === compasIndex) {
            if (prvNotaIndex < notaIndex)
                dir = '+';
            else
                dir = '-';
        }

        let newKey = String(prvCompasIndex) + '/' + String(prvNotaIndex) + dir;
        let first = this.compases[prvCompasIndex].notas[prvNotaIndex];
        let last = this.compases[compasIndex].notas[notaIndex];
        let crescendo = { first: first, last: last };
        crescendos.set(newKey, crescendo);
    }

    draw(context) {
        let is_final = false;
        for (let i = 0; i < this.compases.length; i++) {
            if (i == this.compases.length - 1)
                is_final = true;
            this.compases[i].draw(context, is_final);
            this.compases[i].getRec();
        }
    }
}