
const { Renderer, Stave, StaveNote, Formatter,
  Beam, StaveTie, Voice, Stem, Barline,
  Clef, TimeSignature, KeySignature,
  Fraction, Tuplet,

  Modifier, Articulation, Dot, Accidental, Annotation,

  StaveModifier, StaveText, StaveTempo,
  TextDynamics, StaveHairpin,
  NoteSubGroup
} = Vex.Flow


class Editor extends EditorListener {
  constructor(canvas) {
    super(canvas);
  }

  addCompas(timeNum = 4, timeDen = 4) {
    this.noteDeselect();

    if (this.compases.length == 0) {
      this.compases.push(new Compas(timeNum, timeDen));
      this.compases[0].addTimeSignature(timeNum, timeDen);
      return;
    }

    let tNum;
    let tDen;
    for (let i = 0; i < this.compases.length; i++) {
      if (this.compases[i].getKeySignature() != '') {
        tNum = this.compases[i].timeNum;
        tDen = this.compases[i].timeDen;
      }
    }

    this.compases.push(new Compas(tNum, tDen));
    this.formated = false;
    this.Editdraw();
    this.Editdraw();
  }

  removeCompas() {
    if (this.compases.length === 1)
      return;

    this.noteDeselect();
    this.compases.pop();
    this.formated = false;
    this.Editdraw();
    this.Editdraw();
  }

  config(clef = 'treble', keySignature = 'C', tempo = 120, numerator = 4, denominator = 4) {
    this.addCompas(numerator, denominator);
    this.compases[0]
      .addClef(clef)
      .addKeySignature(keySignature);
    this.setTempo(tempo);
    this.formated = false;
    this.Editdraw();
  }

  formatCompas() {
    if (this.formated)
      return;

    for (let i = 0; i < this.compases.length; i++) {
      this.compases[i].updateSize();
    }

    let clef = this.compases[0].getClef();
    this.compases[0].setPos(0, 10);
    let over_y = this.compases[0].getOverY();
    let final_y = this.compases[0].getFinalY();
    let compases_c = 1;

    let pentagrama = new Pentagrama();
    pentagrama.addCompas(this.compases[0]);

    this.pentagramas = [];
    this.pentagramas.push(pentagrama);

    for (let i = 1; i < this.compases.length; i++) {
      this.compases[i].setClef('');
      let compas_anterior = this.compases[i - 1];
      //agrega un compas si no se sale del borde
      let espacio_vacio = this.bordeR - compas_anterior.getFinalX() - 1;
      if (espacio_vacio > this.compases[i].getW()) {
        if (over_y < this.compases[i].getOverY())
          over_y = this.compases[i].getOverY();

        this.compases[i].setX(compas_anterior.getFinalX());
        this.compases[i].setY(compas_anterior.getY());
        compases_c++;

        pentagrama.addCompas(this.compases[i]);
        continue;
      }

      //queda fuera del pentagrama
      //asigna el espacio sobrante a los compases, reorganiza X y Y
      for (let j = i - compases_c; j < i; j++) {
        this.compases[j].addW(espacio_vacio / compases_c);
        if (j != i - compases_c)
          this.compases[j].setX(this.compases[j - 1].getFinalX());
        this.compases[j].addY(over_y);

        if (final_y < this.compases[j].getFinalY())
          final_y = this.compases[j].getFinalY();
      }

      this.compases[i].setClef(clef);
      this.compases[i].setX(0);
      this.compases[i].setY(final_y);

      pentagrama = new Pentagrama();
      this.pentagramas.push(pentagrama);
      pentagrama.addCompas(this.compases[i]);

      compases_c = 1;
      over_y = this.compases[i].getOverY();
      final_y = this.compases[i].getFinalY();
    }

    let espacio_vacio = this.bordeR - this.compases[this.compases.length - 1].getFinalX() - 1;
    for (let j = this.compases.length - compases_c; j < this.compases.length; j++) {
      this.compases[j].addW(espacio_vacio / compases_c);
      if (j != this.compases.length - compases_c)
        this.compases[j].setX(this.compases[j - 1].getFinalX());
      this.compases[j].addY(over_y);
      if (final_y < this.compases[j].getFinalY())
        final_y = this.compases[j].getFinalY();
    }

    this.render.resize(this.bordeR, final_y);
  }

  Editdraw() {
    requestAnimationFrame(() => {
      this.drawCompases();
    });
  }

  drawCompases() {

    this.formatCompas();
    this.formated = true;
    this.context.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
    this.context.setFillStyle('rgba(0,0,0,1)');

    let is_final = false
    for (let i = 0; i < this.pentagramas.length; i++) {
      is_final = i == this.pentagramas.length - 1;
      this.pentagramas[i].draw(this.context,is_final);
    }

    this.drawCrescendos();

    if (this.temp_nota !== null)
      Formatter.FormatAndDraw(this.context, this.temp_compas, [this.temp_nota]);

    this.drawKeySelected();

    this.drawPrevNoteSelected();
    /*
    let notas = [];
    for(let i = 0;i<this.compases.length;i++){
      for(let j=0;j<this.compases[i].staveNotes.length;j++){
        notas.push(this.compases[i].staveNotes[j]);
      }
    }
    const tie = new StaveTie({
      first_note: notas[0],
      last_note: notas[notas.length-5]
    });
    tie.setContext(this.context).draw();

    */
    //this.drawHitBox();
  }

  drawCrescendos() {
    const crescArray = Array.from(this.crescendos.keys());
    for (let i = 0; i < crescArray.length; i++) {
      let notas = this.crescendos.get(crescArray[i]);
      let first = notas.first.getVexNote();
      let last = notas.last.getVexNote();

      let cresc = new StaveHairpin({ first_note: first, last_note: last }, StaveHairpin.type.CRESC);
      cresc.setContext(this.context);
      cresc.draw();
    }
  }

  drawKeySelected() {
    if (this.key_selected === '')
      return;

    let compas = this.pentagramas[this.penta_selected].compases[this.compas_selected];
    if (compas.notas[this.nota_selected].isRest())
      return;

    let nota = compas.notas[this.nota_selected];
    nota.updateX();
    let temp_compas = new Stave(
      nota.getX() - 17,
      compas.getY(),
      nota.getW());

    let temp_nota = new StaveNote({ keys: [this.key_selected], duration: nota.getDuration() });

    if (nota.hasDot())
      temp_nota.addDotToAll();

    temp_nota.setStyle({
      fillStyle: 'rgba(0,100,200,1)', strokeStyle: 'rgba(0,0,0,0.0)'
    });

    temp_nota.setBeam();

    Formatter.FormatAndDraw(this.context, temp_compas, [temp_nota]);

  }

  drawPrevNoteSelected() {
    if (this.prevNota_selected === -1)
      return;

    let compas = this.pentagramas[this.prevPenta_selected].compases[this.prevCompas_selected];
    let nota = compas.notas[this.prevNota_selected];
    nota.updateX();
    let temp_compas = new Stave(
      nota.getX() - 17,
      compas.getY(),
      nota.getW());

    //keys copia, no referencia
    let temp_nota = new StaveNote({ keys: nota.getKeys(), duration: nota.getDuration() });

    if (nota.hasDot())
      temp_nota.addDotToAll();

    temp_nota.setStyle({
      fillStyle: 'red', strokeStyle: 'rgba(0,0,0,0)'
    });

    temp_nota.setBeam();

    Formatter.FormatAndDraw(this.context, temp_compas, [temp_nota]);
  }

  drawHitBox() {
    //rectangulos para comprobar medidas

    this.context.setFillStyle('rgba(150,150,150,0.5)');
    /*
    for (let i = 0; i < this.compases.length; i++) {
      //let compas = this.compases[i];
      //let cmp = compas.getRec();
      
      this.context.fillRect(cmp.getX(), cmp.getY(), cmp.getW(), cmp.getH());

      if (compas.getClef() != '') {
        let clef = compas.getClefRec();
        this.context.fillRect(clef.x, clef.y, clef.w, clef.h);
      }

      if (compas.getKeySignature() != '') {
        let key = compas.getKeySignatureRec();
        this.context.fillRect(key.x, key.y, key.w, key.h);
      }

      if (compas.getTimeSignature() != '') {
        let time = compas.getTimeNumRec();
        this.context.fillRect(time.x, time.y, time.w, time.h);
        time = compas.getTimeDenRec();
        this.context.fillRect(time.x, time.y, time.w, time.h);
      }
    }
    */
    for (let i = 0; i < this.compases.length; i++) {
      for (let j = 0; j < this.compases[i].notas.length; j++) {
        let recs = this.compases[i].notas[j].getRecs();

        for (let k = 0; k < recs.length; k++) {
          this.context.fillRect(recs[k][1].x, recs[k][1].y, recs[k][1].w, recs[k][1].h);
        }

      }
    }
  }

  setTempo(tempo) {
    this.compases[0].setTempo(tempo);
  }

  getTempo() {
    return this.compases[0].getTempo();
  }


  getH() {
    return this.canvas.height;
  }

  reinit() {
    this.rec = this.canvas.getBoundingClientRect();
    this.nota_selected = -1;
    this.compas_selected = -1;
    this.penta_selected = -1;
    this.key_selected = '';

    this.compases = [];

    this.formated = false;

    this.temp_compas = null;
    this.temp_nota = null;

    this.prevCompas_selected = -1;
    this.prevNota_selected = -1;
    this.prevPenta_selected = -1;
    this.cresc = false;

    this.pentagramas = [];
    this.crescendos = new Map();
  }

  getCompasNum() {
    return this.compases[0].getTimeNum();
  }

  getCompasDen() {
    return this.compases[0].getTimeDen();
  }
}


var editor;
var escribiendo;
// Inicializa el Editor cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  editor = new Editor('Editor');
  editor.config();
  editor.Editdraw();

});




