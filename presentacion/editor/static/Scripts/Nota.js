//StaveNote


class Nota extends VexRec {

    constructor(keys = [], duracion = "4") {
        super(0, 0, 0, 10);
        this.keys = keys;
        this.duracion = duracion;
        this.accidentals = [];
        this.articulations = [];

        this.doted = false;
        this.selected = false;
        this.key_selected = '';

        this.stem_dir = 1;

        this.nota;
        this.rec;
        this.dynamic = ''

        this.text = '';
        this.notas_order = { 'c': 0, 'd': 1, 'e': 2, 'f': 3, 'g': 4, 'a': 5, 'b': 6 };
    }

    updateStaveNote() {

        this.nota = new StaveNote({ keys: this.keys, duration: this.duracion });
        if (this.doted)
            this.nota.addDotToAll();

        if (this.selected && this.isRest())
            this.nota.setStyle({ fillStyle: 'rgba(0,100,200,1)' });
        
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


        for(let i = 0;i<this.accidentals;i++){
            this.nota.addModifier(0, new Accidental(this.accidentals[i]));
        }


        if (this.text !== '')
            this.nota.addModifier(0, new Annotation(this.text));

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
        //this.keys = this.sortKeys();
        let ys = this.nota.getYs();
        let recs = [];
        let keys = this.sortKeys();
        for (let i = ys.length - 1; i >= 0; i--) {
            this.calculaRec(ys[i]);
            recs.push([keys[i], new VexRec(
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

    setSelected(key) {
        if (key === 'inicio') {
            let keys = this.sortKeys();
            this.key_selected = keys[0];
            this.selected = true;
            return keys[0];
        }

        if (this.keys.indexOf(key) === -1) {
            this.key_selected = '';
            this.selected = false;
            return ''
        }

        this.selected = true;
        return key;
    }

    isSelected() {
        return this.selected;
    }

    setKey(newKey, prevKey) {
        if (this.isRest())
            this.duracion = this.duracion.replace('r', '');

        this.key_selected = newKey;
        this.keys[this.keys.indexOf(prevKey)] = newKey;
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

        if (this.accidentals.indexOf(accidental) !== -1) {
            if (accidental === 'n') {
                this.accidentals = [];
                return true;
            }
            return false;
        }

        this.accidentals.push(accidental);
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
            return '';
        }

        if (this.isRest()) {
            this.keys.pop();
            this.duracion = this.duracion.replace('r', '');
        }

        this.keys.push(key);
        return key;
    }

    hasKey(key) {
        return this.keys.indexOf(key) !== -1;
    }

    getKeyOfIndex(index) {
        return this.keys[index];
    }

    convertToRest() {
        this.keys = [];
        this.keys.push('b/4');
        this.duracion += 'r';
    }

    setDynamic(dynamic) {
        if (this.dynamic === dynamic) {
            this.dynamic = '';
            return;
        }

        this.dynamic = dynamic;
    }

    getDynamic() {
        return this.dynamic;
    }

    hasDynamic() {
        return this.dynamic !== -1;
    }

    setText(text) {
        this.text = text;
        return this;
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