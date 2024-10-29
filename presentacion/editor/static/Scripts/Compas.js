//Stave

//clefs:
//treble  bass  alto  tenor  percussion
class Compas {
    constructor(x, y,timeNum=4,timeDen=4) {
        this.x = x;
        this.y = y;
        this.w;
        this.timeNum = timeNum;
        this.timeDen = timeDen;
        this.notas = [];
        this.staveNotes = [];
        
        this.timeSignature = "";
        this.clef="";
        
        this.capacidad;
        this.stave;

        this.calculaCapacidad();
        this.initSilencios();
        this.calulateSize();
        this.actualizaStave();
    }

    //en caso de cambiar la capacidad
    //ajustar notas y silecios, comentario de setTime();
    calculaCapacidad() { this.capacidad = this.timeNum * this.timeDen; }

    initSilencios() {
        this.calculaCapacidad();
    
        for(let i = 0;i<this.timeNum;i++)
        {
            this.addNota(['b/4'], this.timeDen.toString()+'r');
        }
    }

    addNota(keys=[], duracion = "4") {
        let nota = new Nota(keys, duracion);
        this.notas.push(nota);
        this.staveNotes.push(nota.getStaveNote());
    }
    
    actualizaStave()
    {
        this.stave = new Stave(this.x, this.y, this.w);
        if(this.clef != "")
            this.stave.addClef(this.clef);
        
        if(this.timeSignature != "")
            this.stave.addTimeSignature(this.timeSignature);

    }

    draw(context) {
        this.actualizaStave();
        this.stave.setContext(context).draw();
        
        let beam = Beam.generateBeams(this.staveNotes);

        Formatter.FormatAndDraw(context, this.stave, this.staveNotes);

        beam.forEach((b) => {
            b.setContext(context).draw();
        });
    }

    addClef(clef)
    {
        this.clef=clef;
        this.stave.addClef(this.clef);
    }

    removeClef()
    {
        this.clef = "";
        this.actualizaStave();
    }

    addTimeSignature(timeNum,timeDen)
    {
        this.timeNum = timeNum;
        this.timeDen = timeDen;
        this.timeSignature = this.timeNum.toString() + "/" + this.timeDen.toString();
        //falta validar que se reinicialicen los silencios 
        //concatenandolos con las notas existentes
        //o eliminando notas y silencios si se pasa de la capacidad
        this.calculaCapacidad();
        this.actualizaStave();
    }

    removeTimeSignature()
    {
        //falta validacion por el editor
        //debe validar que el numerador y denominador de su compas
        //sea igual que el proximo visible del lado izquierdo
        this.timeSignature = "";
        this.actualizaStave();
    }

    calulateSize()
    {
        this.w = this.notas.length*50;
    }

    setPos(x,y)
    {
        this.x = x;
        this.y = y;
        this.actualizaStave();
    }

    setX(x)
    {
        this.x = x;
        this.actualizaStave();
    }

    setY(y)
    {
        this.y = y;
        this.actualizaStave();
    }
}