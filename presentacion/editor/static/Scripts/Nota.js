//StaveNote


class Nota extends VexRec {

    constructor(keys = [], duracion = "4") {
        super(0, 0, 0, 10);
        this.keys = keys;
        this.duracion = duracion;

        this.accidentals = new Map();
        this.articulations = [];
        this.doted = false;
        this.selected = false;
        this.key_selected = '';

        this.stem_dir = 1;

        this.nota;
        this.rec;
        
        this.dynamic = ''
        this.text = '';

        this.inTuplet = false;

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

        let keys = this.sortKeys();
        const accidentalArray = Array.from(this.accidentals.keys());
        for (let i = 0; i < accidentalArray.length; i++) {
            let key = this.getKeyOfIndex(accidentalArray[i]);
            let index = keys.indexOf(key);
            this.nota.addModifier(index, new Accidental(this.accidentals.get(accidentalArray[i])));
        }


        if (this.text !== '')
            this.nota.addModifier(0, new Annotation(this.text));

        this.nota.setStemDirection(this.stem_dir);

        this.sortArticulations();
        let shift_y = 0;
        for (let i = 0; i < this.articulations.length; i++) {
            let dir;
            let index = 0;
            if (this.articulations[i] !== 'a@a') {
                if (this.stem_dir === 1) {
                    dir = Modifier.Position.BELOW;
                    shift_y += 10;
                }
                else {
                    dir = Modifier.Position.ABOVE;
                    shift_y -= 10;
                    index = this.keys.length - 1;
                }
            }
            else {
                dir = Modifier.Position.ABOVE;
            }

            this.nota.addModifier(index, new Articulation(this.articulations[i])
                .setPosition(dir));
        }

    }

    updateX(){
        this.x = this.nota.getNoteHeadBeginX();
        this.w = this.nota.getNoteHeadEndX() - this.x;
    }

    calculaRec(y) {
        let bound = this.nota.getBoundingBox();
        this.x = this.nota.getNoteHeadBeginX();
        this.updateX();

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
        if (y != null) {
            if (this.articulations.indexOf('a@a') !== -1) {
                if (this.stem_dir === -1)
                    return y - 60;

            }

            return y - 35;

        }
        return 0;
    }

    getFinalY() {
        let keys = this.sortKeys();
        let y = Notacion.getNoteY(keys[0]);
        if (y != null) {
            if (this.stem_dir === 1) {
                return y + 35 + this.articulations.length * 5;
            }

            return y + 35;
        }
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
        this.key_selected = key;
        return key;
    }

    isSelected() {
        return this.selected;
    }

    setKey(newKey) {
        if (this.isRest())
            this.duracion = this.duracion.replace('r', '');

        this.keys[this.keys.indexOf(this.key_selected)] = newKey;
        this.key_selected = newKey;
        return this;
    }

    setDuration(duration) {
        this.removeDot();
        this.duracion = duration;
        return this;
    }

    getDuration() {
        return this.duracion;
    }

    isRest() {
        return this.duracion.includes('r');
    }

    setAccidental(accidental,key) {
        if (this.isRest())
            return false;
        
        let index = this.keys.indexOf(key);
        if (!this.accidentals.has(index)) {
            this.accidentals.set(index,accidental);
            return true;
        }

        let prevAccidental = this.accidentals.get(index);
        if(prevAccidental === accidental){
            this.accidentals.delete(index);
            return true;
        }
        
        this.accidentals.set(index,accidental);
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
        this.key_selected = key;
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
        this.articulations = [];
        this.accidentals = new Map();
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

    sortArticulations() {
        const ordenArti = ['a>', 'a-', 'a.', 'av', 'a^', 'a@a'];

        this.articulations.sort((a, b) => {
            return ordenArti.indexOf(a) - ordenArti.indexOf(b);
        });
    }

    getModifiers() {
        return [...this.nota.getModifiers()];
    }

    isInTuplet(){
        return this.inTuplet;
    }

    getVexNote(){
        return this.nota;
    }

    getCopyNote(){
        return {...this.nota};
    }

    getKeys(){
        return [...this.keys];
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