//Stave

//clefs:
//treble  bass  alto  tenor  percussion
class Compas extends VexRec {
    constructor(timeNum = 4, timeDen = 4) {
        super(0, 0, 0, 80);
        this.timeNum = timeNum;
        this.timeDen = timeDen;

        this.capacidad = 0;
        this.tempo = 120;
        this.notas = [];
        this.staveNotes = [];

        this.timeSignature = '';
        this.keySignature = '';
        this.clef = '';

        this.timeSignature_sel = false;
        this.keySignature_sel = false;
        this.clef_sel = false;

        this.stave;
        this.initSilencios();
        this.updateSize();
    }

    updateCpacity() {
        this.capacidad = this.timeNum / this.timeDen;
    }

    getCapacity() {
        this.updateCpacity();
        return this.capacidad;
    }

    getTimeDen() {
        return this.timeDen;
    }

    getTimeNum() {
        return this.timeNum;
    }

    initSilencios() {

        for (let i = 0; i < this.timeNum; i++) {
            this.addNota(['b/4'], this.timeDen.toString() + 'r');
        }
    }

    addNota(keys = [], duracion = "4") {
        let nota = new Nota(keys, duracion);
        this.notas.push(nota);
    }

    updateStave() {
        this.stave = new Stave(this.x, this.y, this.w);

        if (this.clef != '') {
            this.stave.addClef(this.clef);
            this.stave.addModifier(new StaveTempo({ duration: String(this.timeDen), dots: 0, bpm: this.tempo }, 0, 0));
        }

        if (this.timeSignature != '') {
            this.stave.addTimeSignature(this.timeSignature);
        }

        if (this.keySignature != '') {
            if (this.keySignature != 'C')
                this.stave.addKeySignature(this.keySignature);
            else
                this.stave.addKeySignature('G');
        }


        let mod = this.stave.getModifiers();

        for (let i = 0; i < mod.length; i++) {
            if (mod[i] instanceof Clef) {
                if (this.clef_sel && this.clef != 'C')
                    mod[i].setStyle({ fillStyle: 'rgba(0,100,200,1)' });
            } else if (mod[i] instanceof TimeSignature) {
                if (this.timeSignature_sel)

                    mod[i].setStyle({ fillStyle: 'rgba(0,100,200,1)' });

            } else if (mod[i] instanceof KeySignature) {
                if (this.keySignature_sel)
                    mod[i].setStyle({ fillStyle: 'rgba(0,100,200,1)' });
                if (this.keySignature == 'C')
                    mod[i].setStyle({ fillStyle: 'rgba(0,0,0,0)' });
            } else if (mod[i] instanceof StaveTempo) {
                mod[i].setX(
                    -this.getClefRec().getW()
                    -this.getKeySignatureRec().getW()
                    -this.getTimeNumRec().getW());
            }
        }

    }

    draw(context, is_final) {
        this.updateStave();

        if (is_final)
            this.stave.setEndBarType(Barline.type.END);

        this.stave.setContext(context).draw();
        this.staveNotes = [];
        for (let i = 0; i < this.notas.length; i++) {
            this.staveNotes.push(this.notas[i].getStaveNote());
        }

        Formatter.FormatAndDraw(context, this.stave, this.staveNotes, { auto_beam: true });

        
    }

    addClef(clef) {
        this.clef = clef;
        return this;
    }

    getClef() {
        return this.clef;
    }

    removeClef() {
        this.clef = '';
        return this;
    }

    addKeySignature(keySignature) {
        this.keySignature = keySignature;
        return this;
    }

    getKeySignature() {
        return this.keySignature;
    }

    addTimeSignature(timeNum, timeDen) {
        this.timeNum = timeNum;
        this.timeDen = timeDen;
        this.timeSignature = this.timeNum.toString() + "/" + this.timeDen.toString();
        return this;
    }

    getTimeSignature() {
        return this.timeSignature;
    }

    removeTimeSignature() {
        this.timeSignature = '';
        return this;
    }

    updateSize() {
        this.w = this.notas.length * 50;

        if (this.clef != '')
            this.w += 50;

        if (this.timeSignature != '')
            this.w += 50;

        if (this.keySignature != '')
            this.w += 50;
    }

    getMinY() {
        let min_note_y = this.notas[0].getStartY();
        for (let i = 1; i < this.notas.length; i++) {
            if (min_note_y > this.notas[i].getStartY())
                min_note_y = this.notas[i].getStartY();
        }

        if (min_note_y < 0)
            return this.getY() + min_note_y;

        return this.getY();
    }

    getOverY() {
        let min_note_y = this.notas[0].getStartY();
        for (let i = 1; i < this.notas.length; i++) {
            if (min_note_y > this.notas[i].getStartY())
                min_note_y = this.notas[i].getStartY();
        }
        if (min_note_y < 0)
            return min_note_y * -1;

        return 0;
    }

    getFinalY() {
        let max_note_y = this.notas[0].getFinalY();
        for (let i = 1; i < this.notas.length; i++) {
            if (max_note_y < this.notas[i].getFinalY())
                max_note_y = this.notas[i].getFinalY();
        }

        let final_compas = this.getY() + this.getH() / 2;

        if (max_note_y > this.getH())
            return final_compas + max_note_y;

        return final_compas + this.getH();
    }

    getClefRec() {
        return new VexRec(
            this.getX(),
            this.getY() + this.getH() / 2 - 15,
            35,
            this.getH() * 0.9
        );
    }

    getKeySignatureRec() {
        let clef_rec = this.getClefRec();
        return new VexRec(
            clef_rec.getFinalX(),
            clef_rec.getY(),
            Notacion.getKeySignatureW(this.keySignature),
            clef_rec.getH()
        );
    }

    getTimeNumRec() {
        let keyS_rec = this.getKeySignatureRec();
        let w = 32;
        if (this.timeNum > 10 || this.timeDen > 10) {
            w += 12;
        }

        return new VexRec(
            keyS_rec.getFinalX(),
            keyS_rec.getY() + keyS_rec.getH() / 2,
            w,
            keyS_rec.getH() / 2
        );
    }

    getTimeDenRec() {
        let keyS_rec = this.getKeySignatureRec();
        let w = 32;
        if (this.timeNum > 10 || this.timeDen > 10) {
            w += 12;
        }
        return new VexRec(
            keyS_rec.getFinalX(),
            keyS_rec.getY(),
            w,
            keyS_rec.getH() / 2
        );
    }

    selectClef() {
        this.timeSignature_sel = false;
        this.keySignature_sel = false;
        this.clef_sel = true;
    }

    selectTime() {
        this.timeSignature_sel = true;
        this.keySignature_sel = false;
        this.clef_sel = false;
    }

    selectKeySign() {
        this.timeSignature_sel = false;
        this.keySignature_sel = true;
        this.clef_sel = false;
    }

    noSignSelected() {
        this.timeSignature_sel = false;
        this.keySignature_sel = false;
        this.clef_sel = false;
    }

    setTempo(tempo) {
        this.tempo = tempo;
        return this;
    }

    getRec(){
        return new VexRec(
            this.getX(),
            this.getMinY(),
            this.getW(),
            this.getFinalY()-this.getMinY()
        );
    }
}