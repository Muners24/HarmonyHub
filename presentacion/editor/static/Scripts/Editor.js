
const { Renderer, Stave, StaveNote, Formatter,
  Beam, StaveTie, Voice, Stem, Barline,
  Clef, TimeSignature, KeySignature,
  Fraction,

  Modifier, Articulation, Dot, Accidental, Annotation,

  StaveModifier, StaveText, StaveTempo,
} = Vex.Flow


class Editor extends EditorListener {
  constructor(canvas) {
    super(canvas);

  }

  addCompas(timeNum = 4, timeDen = 4) {
    if (this.compases.length == 0) {
      this.compases.push(new Compas(timeNum, timeDen));
      this.compases[0].addTimeSignature(timeNum, timeDen);
      return;
    }

    let tNum;
    let tDen;
    for (let i = 0; i < this.compases.length; i++) {
      if (this.compases[i].getKeySignature != '') {
        tNum = this.compases[i].timeNum;
        tDen = this.compases[i].timeDen;
      }
    }

    this.compases.push(new Compas(tNum, tDen));
    this.formated = false;
    this.Editdraw();
  }

  config() {
    this.addCompas(4, 4);
    this.compases[0]
      .addClef('treble')
      .addKeySignature('G');
    this.setTempo(111);
    this.addCompas();
    this.addCompas();
    this.addCompas();
    this.addCompas();
    this.addCompas();
    this.addCompas();

  }

  formatCompas() {
    if (!this.formated) {
      for (let i = 0; i < this.compases.length; i++) {
        this.compases[i].updateSize();
      }

      this.compases[0].setPos(0, 10);
      let over_y = this.compases[0].getOverY();
      let final_y = this.compases[0].getFinalY();
      let compases_c = 1;

      for (let i = 1; i < this.compases.length; i++) {
        let compas_anterior = this.compases[i - 1];

        //agrega un compas si no se sale del borde
        //va contando los compases en el pentagrama
        //calcula el exedente sobre los compases
        let espacio_vacio = this.bordeR - compas_anterior.getFinalX() - 1;
        if (espacio_vacio > this.compases[i].getW()) {
          if (over_y < this.compases[i].getOverY())
            over_y = this.compases[i].getOverY();

          this.compases[i].setX(compas_anterior.getFinalX());
          this.compases[i].setY(compas_anterior.getY());
          compases_c++;
          continue;
        }

        //queda fuera del pentagrama
        //asigna el espacio sobrante a los compases
        //los reorganiza en X
        //asigna sus y igual al y inicial encontrado;
        for (let j = i - compases_c; j < i; j++) {
          this.compases[j].addW(espacio_vacio / compases_c);
          if (j != i - compases_c)
            this.compases[j].setX(this.compases[j - 1].getFinalX());
          this.compases[j].addY(over_y);

          if (final_y < this.compases[j].getFinalY())
            final_y = this.compases[j].getFinalY();
        }

        this.compases[i].setX(0);
        this.compases[i].setY(final_y);

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
    let is_final = false;
    for (let i = 0; i < this.compases.length; i++) {
      if (i == this.compases.length - 1)
        is_final = true;
      this.compases[i].draw(this.context, is_final);
      this.compases[i].getRec();
    }

    this.drawKeySelected();

    if (this.temp_notas.length !== 0)
      Formatter.FormatAndDraw(this.context, this.temp_compas, this.temp_notas, { auto_beam: true });

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
    this.drawHitBox();

  }

  drawKeySelected() {
    if (this.key_selected === -1)
      return;

    let compas = this.compases[this.compas_selected];
    if (compas.notas[this.nota_selected].isRest())
      return;

    let temp_compas = new Stave(compas.getX(), compas.getY(), compas.getW());
    if (this.compas_selected === 0) {
      temp_compas.addClef(compas.getClef());
      temp_compas.addKeySignature(compas.getKeySignature());
      temp_compas.addTimeSignature(compas.getTimeSignature());
    }

    let temp_notas = [];
    for (let i = 0; i < compas.staveNotes.length; i++) {
      if (i !== this.nota_selected) {
        if (compas.notas[i].isRest())
          temp_notas.push(new StaveNote({ keys: ['b/4'], duration: compas.notas[i].getDuration() }));
        else
          temp_notas.push(new StaveNote({ keys: ['b/4'], duration: compas.notas[i].getDuration()+'r' }));
        temp_notas[i].setStyle({ fillStyle: 'rgba(0,0,0,0.0)', strokeStyle: 'rgba(0,0,0,0.0)' });
        continue;
      }
      let key = compas.notas[this.nota_selected].getKeyOfIndex(this.key_selected);
      temp_notas.push(new StaveNote({ keys: [key], duration: '4' }))
      temp_notas[i].setStyle({ fillStyle: 'rgba(0,100,200,1)', strokeStyle: 'rgba(0,0,0,0.0)' });
    }
    Formatter.FormatAndDraw(this.context, temp_compas, temp_notas, { auto_beam: true });

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

  getH() {
    return this.canvas.height;
  }
}


var editor;

// Inicializa el Editor cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {

  editor = new Editor('Editor');
  editor.config();
  editor.Editdraw();

});




