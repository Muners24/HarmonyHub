//StaveNote


class Nota extends VexRec {

    constructor(keys = [], duracion = "4") {
        super(0, 0, 0, 10);
        this.keys = keys;
        this.duracion = duracion;
        this.accidental = '';
        this.articulations = [];

        this.doted = false;
        this.selected = false;
        this.key_selected = -1;

        this.stem_dir = 1;

        this.nota;
        this.rec;

        this.notas_order = { 'c': 0, 'd': 1, 'e': 2, 'f': 3, 'g': 4, 'a': 5, 'b': 6 };
    }

    updateStaveNote() {
        this.nota = new StaveNote({ keys: this.keys, duration: this.duracion });
        if (this.doted)
            this.nota.addDotToAll();

        if (this.selected && this.isRest())
            this.nota.setStyle({ fillStyle: 'rgba(0,100,200,1)' });


        if (this.accidental != '')
            this.nota.addModifier(0, new Accidental(this.accidental));

        let count = 0;
        for (let i = 0; i < this.keys.length; i++) {
            if (this.keys[i].split('/')[1] > 4)
                count--;
            else
                count++;
        }

        if (count < 0)
            this.stem_dir = -1;
        else
            this.stem_dir = 1;

        this.nota.setStemDirection(this.stem_dir);
        for (let i = 0; i < this.articulations.length; i++) {
            let dir;
            if (this.articulations[i] !== 'a@a') {
                if (this.stem_dir === 1) {
                    dir = Modifier.Position.BELOW;
                    shift_y += 10;
                }
                else {
                    dir = Modifier.Position.ABOVE;
                    shift_y -= 10;
                }
            }
            else
                dir = Modifier.Position.ABOVE;

            this.nota.addModifier(0, new Articulation(this.articulations[i])
                .setPosition(dir));
        }

        //anotacion
        //this.nota.addModifier(0,new Annotation('a'));

    }

    calculaRec(y) {
        let bound = this.nota.getBoundingBox();
        this.x = this.nota.getNoteHeadBeginX();
        this.w = this.nota.getNoteHeadEndX() - this.x;

        if (this.isRest()) {
            this.h = bound.getH();
            this.y = bound.getY();
            return;
        }

        this.h = 10;
        this.y = y - 5;

    }

    getRecs() {
        this.keys = this.sortKeys();
        let ys = this.nota.getYs();
        let recs = [];
        for (let i = 0; i < ys.length; i++) {
            this.calculaRec(ys[i]);
            recs.push([i,new VexRec(
                this.x,
                this.y,
                this.w,
                this.h,
            )]);
        }
        return recs;
    }

    addDot() {
        this.doted = true;
        return this;
    }

    hasDot() {
        return this.doted;
    }

    removeDot() {
        this.doted = false;
        return this;
    }

    getStaveNote() {
        this.updateStaveNote();
        return this.nota;
    };

    getStartY() {
        let keys = this.sortKeys();

        let y = Notacion.getNoteY(keys[keys.length - 1]);
        if (y != null)
            return y - 35;
        return 0;
    }

    getFinalY() {
        let keys = this.sortKeys();
        let y = Notacion.getNoteY(keys[0]);
        if (y != null)
            return y + 35;
        return 0;
    }

    sortKeys() {
        let keys = [...this.keys];

        keys.sort((a, b) => {
            const numA = parseInt(a.split('/')[1]);
            const numB = parseInt(b.split('/')[1]);

            if (numA !== numB)
                return numA - numB;

            const letterA = a.split('/')[0];
            const letterB = b.split('/')[0];

            return this.notas_order[letterA] - this.notas_order[letterB];
        });

        return keys;
    }

    setSelected(key_index) {
        if(key_index === -2){
            this.selected = true;
            let key = this.sortKeys();
            this.key_selected = this.keys.indexOf(key[0]);
            return this.key_selected;
        }

        this.key_selected = key_index;
        this.selected = key_index !== -1;
        return key_index;
    }

    isSelected() {
        return this.selected;
    }

    setKey(key, index) {
        if (this.isRest())
            this.duracion = this.duracion.replace('r', '');

        this.keys[index] = key;
        return this;
    }

    setDuration(duration) {
        this.duracion = duration;
        return this;
    }

    getDuration() {
        return this.duracion;
    }

    isRest() {
        return this.duracion.includes('r');
    }

    setAccidental(accidental) {
        if (this.isRest())
            return false;

        if (this.accidental === accidental) {
            if (accidental === 'n') {
                this.accidental = '';
                return true;
            }
            return false;
        }

        this.accidental = accidental;
        return true;
    }

    setArticulation(newArticulation) {
        if (this.isRest())
            return;

        let acumulables = [];
        acumulables.push('a-');
        acumulables.push('a>');
        acumulables.push('a@a');

        let index = this.articulations.indexOf(newArticulation);
        if (acumulables.indexOf(newArticulation) !== -1) {
            if (index !== -1) {
                this.articulations.splice(index, 1);
                return;
            }
            if (newArticulation !== 'a@a')
                this.articulations.splice(0, 0, newArticulation);
            else
                this.articulations.push(newArticulation);

            return;
        }

        let acortadores = [];
        acortadores.push(this.articulations.indexOf('a.'));
        acortadores.push(this.articulations.indexOf('av'));
        acortadores.push(this.articulations.indexOf('a^'));

        if (index !== -1) {
            this.articulations.splice(index, 1);
            return;
        }

        for (let i = 0; i < acortadores.length; i++) {
            if (acortadores[i] !== index) {
                this.articulations.splice(acortadores[i], 1);
            }
        }
        if (this.articulations.indexOf('a@a') !== -1) {
            this.articulations.splice(this.articulations.length - 1, 0, newArticulation);
            return;
        }
        this.articulations.push(newArticulation);
    }

    addKey(key) {
        if (this.keys.indexOf(key) !== -1) {
            return -1;
        }

        if (this.isRest()) {
            this.keys.pop();
            this.duracion = this.duracion.replace('r', '');
        }

        this.keys.push(key);
        this.keys = this.sortKeys();
        return this.keys.indexOf(key);
    }

    hasKey(key) {
        return this.keys.indexOf(key) !== -1;
    }

    getKeyOfIndex(index) {
        return this.keys[index];
    }
};

//1 redonda
//2 blanca
//4 regra
//8 corchea
//16 semicorchea
//32 fusa
//64 semifusa
//128 cuartifusa