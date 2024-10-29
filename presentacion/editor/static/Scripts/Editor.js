
const { Renderer, Stave, StaveNote, Formatter, Beam, StaveTie, Voice, Stem } = Vex.Flow


class Editor {
  constructor(svg) {
    this.svgElement = document.getElementById(svg);
    this.render = new Renderer(this.svgElement, Renderer.Backends.SVG);
    this.render.resize(1000, 700);
    this.context = this.render.getContext();

    this.voices = [];
    this.staves = [];
    this.notes = [];
  }

  config() {

    this.staves.push(new Stave(10, 40, 200));
    //treble  bass  alto  tenor  percussion
    this.staves[0].addClef('treble').addTimeSignature('4/4');

    let notes1 = [
      new StaveNote({ keys: ['g/4'], duration: '8' }),
      new StaveNote({ keys: ['a/4'], duration: '8' }),
      new StaveNote({ keys: ['b/4'], duration: '4' }),
      new StaveNote({ keys: ['c/5'], duration: '8' }),
      new StaveNote({ keys: ['g/4'], duration: '8' }),
      new StaveNote({ keys: ['b/4'], duration: '4' })
    ];

    for (let i = 0; i < notes1.length; i++) {
      this.notes.push(notes1[i]);
    }
  }

  Editdraw() {
    this.context.clearRect(0, 0, this.svgElement.clientWidth, this.svgElement.clientHeight);
    for (var i = 0; i < this.staves.length; i++) {
      this.staves[i].setContext(this.context).draw();
    }
    let beam = Beam.generateBeams(this.notes);

    Formatter.FormatAndDraw(this.context, this.staves[0], this.notes);
    beam.forEach((b) => {
      b.setContext(this.context).draw();
    });

    let compas = new Compas(210,40,4,4);
    compas.draw(this.context);
    

    let compas2 = new Compas(210+compas.w, 40,4,4);
    compas2.draw(this.context);

    let compassub = new Compas(210,120,4,4);
    compassub.draw(this.context);
  }

}



// Inicializa el Editor cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    let editor = new Editor('Editor');
    editor.config();
    editor.Editdraw();
});



