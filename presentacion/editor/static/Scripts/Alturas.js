
class Alturas {
    static altura_notas = null;
    static keys = []

    constructor() { }

    static initMap() {
        this.altura_notas = new Map();
        let notas = ['b/', 'a/', 'g/', 'f/', 'e/', 'd/', 'c/'];
        this.l
        let k = -115;
        for (let i = 9; i >= 0; i--) {
            for (let j = 0; j < notas.length; j++) {
                this.altura_notas.set((notas[j] + i.toString()), k);
                this.keys.push(notas[j] + i.toString());
                k += 5;
            }
        }
    }

    static getNoteY(key = 'b/4') {
        if (this.altura_notas == null)
            this.initMap();

        if (this.altura_notas.has(key))
            return this.altura_notas.get(key);

        return null;
    }

    static getNextNote(key){
        if (this.altura_notas == null)
            this.initMap();

        let i = this.keys.findIndex(nota => nota === key)
        if (i !== -1)
        {
            if(i > 0)
                i--;

            return this.keys[i];
        }
        return 'b/4';
    }

    static getPreviusNote(key){
        if (this.altura_notas == null)
            this.initMap();
        
        let i = this.keys.findIndex(nota => nota === key)

        if (i !== -1)
        {
            if(i < this.keys.length - 1 )
                i++;

            return this.keys[i];
        }
        return 'b/4';
    }
}