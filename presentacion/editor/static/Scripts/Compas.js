//Stave

//clefs:
//treble  bass  alto  tenor  percussion
class Compas extends VexRec {
    constructor(timeNum = 4, timeDen = 4) {
        super(0, 0, 0, 80);
        this.timeNum = timeNum;
        this.timeDen = timeDen;

        this.notas = [];

        this.timeSignature = '';
        this.keySignature = '';
        this.clef = '';

        this.stave;
        this.initSilencios();
        this.updateSize();
        this.actualizaStave();
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

    actualizaStave() {
        this.stave = new Stave(this.x, this.y, this.w);
        if (this.clef != '')
            this.stave.addClef(this.clef);

        if (this.timeSignature != '')
            this.stave.addTimeSignature(this.timeSignature);

        if (this.keySignature != '')
            this.stave.addKeySignature(this.keySignature);

    }

    draw(context,is_final) {
        this.actualizaStave();
        if(is_final)
            this.stave.setEndBarType(Barline.type.END);
        
        this.stave.setContext(context).draw();
        let staveNotes = [];
        for (let i = 0; i < this.notas.length; i++) {
            staveNotes.push(this.notas[i].getStaveNote());
        }

        Formatter.FormatAndDraw(context, this.stave, staveNotes, { auto_beam: true });
    }

    addClef(clef) {
        this.clef = clef;
        return this;
    }

    removeClef() {
        this.clef = '';
        return this;
    }

    addKeySignature(keySignature) {
        this.keySignature = keySignature;
        return this;
    }

    getKeySignature(){
        return this.keySignature;
    }

    addTimeSignature(timeNum, timeDen) {
        this.timeNum = timeNum;
        this.timeDen = timeDen;
        this.timeSignature = this.timeNum.toString() + "/" + this.timeDen.toString();
        return this;
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

        let final_compas = this.getY() + this.getH()/2;

        if (max_note_y > this.getH())
            return final_compas + max_note_y;

        return final_compas + this.getH();
    }

    getClefRec(){
        return new VexRec(
            this.getX(),
            this.getY(),
            0,
            0
        );
    }

    getKeySignatureRec(){

    }
}