//StaveNote


class Nota extends VexRec {

    constructor(keys = [], duracion = "4") {
        super(0, 0, 0, 10);
        this.keys = keys;
        this.duracion = duracion;
        this.alteracion = "";
        this.articulaciones = [];

        this.doted = false;
        this.selected = false;

        this.stem_dir = 1;

        this.nota;
        this.rec;
    }

    actualizaStaveNote() {
        this.nota = new StaveNote({ keys: this.keys, duration: this.duracion });

        if (this.doted)
            this.nota.addDotToAll();

        if(this.selected)
            this.nota.setStyle({ fillStyle: 'red', strokeStyle: 'red' });

        this.nota.setStemDirection(this.stem_dir);
    }

    calculaRec() {
        let bound = this.nota.getBoundingBox();
        this.x = this.nota.getNoteHeadBeginX();
        this.w = this.nota.getNoteHeadEndX() - this.x;
        if(this.duracion.includes('r')){
            this.h = bound.getH();
            this.y = bound.getY();
        }
        else{
            this.h = 10;
            this.y = this.nota.getNoteHeadBounds().y_top-5;
        }
    }

    getRec() {
        this.calculaRec();
        return new VexRec(
            this.x,
            this.y,
            this.w,
            this.h,
        );
    }

    addDot() {
        this.doted = true;
        return this;
    }

    hasDot(){
        return this.doted;
    }

    removeDot(){
        this.doted = false;
        return this;
    }

    getStaveNote() {
        this.actualizaStaveNote();
        return this.nota;
    };

    getStartY(){
        let y = Notacion.getNoteY(this.keys[0]);
        if(y != null)
            return y-5;
        return 0;
    }

    getFinalY(){
        let y = Notacion.getNoteY(this.keys[0]);
        if(y != null)
            return y+5;
        return 0;
    }

    setSelected(sel){
        this.selected = sel;
    }
    
    isSelected(){
        return this.selected;
    }

    setKey(key){
        if(this.duracion.includes('r'))
            this.duracion = this.duracion.replace('r','');
        
        if(key.split('/')[1] > 4)
            this.stem_dir = -1;
        else
            this.stem_dir = 1;

        this.keys[0] = key;
        return this;
    }

    setDuration(duration){
        this.duracion = duration;
        return this;
    }

    getDuration(){
        return this.duracion;
    }

    isRest(){
        return this.duracion.includes('r');
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