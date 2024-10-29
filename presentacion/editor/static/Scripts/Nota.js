//StaveNote


class Nota {

    constructor(keys=[], duracion = "4") {
        this.keys = keys;
        this.duracion = duracion;
        this.alteracion = "";
        this.articulaciones = [];
        this.doted = false;
        this.nota;
        this.rec;
        this.actualizaStaveNote();
        //this.calculaRec();
    }

    actualizaStaveNote(){
        this.nota = new StaveNote({ keys: this.keys, duration: this.duracion });
    }

    calculaRec(){
        this.rec = new VexRec(
            this.nota.getNoteHeadBeginX(),
            this.nota.getStem().getExtents().topY,
            this.nota.getWidth(),
            this.nota.getStem().getHeight()
        )
    }

    getRec() { return this.rec; }

    addDot()
    {
        this.nota.addDotToAll();
    }

    getStaveNote(){
        this.actualizaStaveNote();
        return this.nota;
    };
};

//1 redonda
//2 blanca
//4 regra
//8 corchea
//16 semicorchea
//32 fusa
//64 semifusa
//128 cuartifusa