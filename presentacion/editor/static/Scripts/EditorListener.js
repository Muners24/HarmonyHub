class EditorListener {
    constructor(canvas) {
        this.canvas = document.getElementById(canvas);
        this.render = new Renderer(this.canvas, Renderer.Backends.CANVAS);
        this.bordeR = window.innerWidth - 200;
        this.render.resize(this.bordeR, 200);
        this.context = this.render.getContext();

        this.canvas.addEventListener('click', (event) => this.handleClick(event));

        this.canvas.addEventListener('mousemove', (event) => {
            if (this.nota_selected !== -1) {
                // Si nota_selected es diferente de -1, ejecutamos la función debounced
                this.debounce(this.handleMov.bind(this), 60)(event);
            }
        });

        //requiere focus si se configura con svgElement
        document.addEventListener('keydown', this.debounce(this.handleKeydown.bind(this), 16));
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

    debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    handleMov(event) {
        const x = event.pageX - this.rec.left;
        const y = event.pageY - this.rec.top;
        let compas = this.pentagramas[this.penta_selected].compases[this.compas_selected];

        this.context.setFillStyle('rgba(0,0,0,0.5)');
        let rec = new VexRec(
            compas.notas[this.nota_selected].getX(),
            compas.getMinY(),
            10,
            compas.getFinalY() - compas.getMinY()
        );

        if (!rec.collisionPoint(x, y)) {
            this.temp_compas = null;
            this.temp_nota = null;
            this.Editdraw();
            return;
        }

        let nota = compas.notas[this.nota_selected];

        this.temp_compas = new Stave(
            nota.getX() - 17,
            compas.getY(),
            nota.getW());

        let key = Notacion.getNoteOnY(compas.getMinY() + compas.getOverY(), y);
        let dur = parseInt(nota.getDuration());
        this.temp_nota = new StaveNote({ keys: [key], duration: String(dur) });
        this.temp_nota.setStyle({
            fillStyle: 'rgba(0,100,200,1)', strokeStyle: 'rgba(0,0,0,0.0)',
            shadowColor: 'rgba(0,0,0,0.0)', shadowBlur: 'rgba(0,0,0,0.0)'
        });

        if (nota.hasDot())
            this.temp_nota.addDotToAll();

        this.temp_nota.setStyle({
            fillStyle: 'rgba(0,100,200,1)', strokeStyle: 'rgba(0,0,0,0.0)'
        });

        this.temp_nota.setBeam();

        this.Editdraw();

    }

    handleKeydown(event) {
        this.temp_compas = null;
        this.temp_nota = null;
        switch (event.key) {
            case 'a':
                this.selectLeft();
                this.Editdraw();
                break;
            case 'd':
                this.selectRight();
                this.Editdraw();
                break;
            case 'w':
                this.formated = false;
                this.keySignSwitch(Notacion.getNextKeySignature.bind(Notacion));
                this.switchPitch(Notacion.getNextNote.bind(Notacion));
                this.switchClef(Notacion.getNextClef.bind(Notacion));
                this.Editdraw();
                break;
            case 's':
                this.formated = false;
                this.keySignSwitch(Notacion.getPreviousKeySignature.bind(Notacion));
                this.switchPitch(Notacion.getPreviusNote.bind(Notacion));
                this.switchClef(Notacion.getPreviusClef.bind(Notacion));
                this.Editdraw();
                break;
            case '.':
                this.addDot();
                break;
            case 'v':
                this.setAccidental('bb');
                break;
            case 'b':
                this.setAccidental('b');
                break;
            case 'n':
                this.setAccidental('n');
                break;
            case 'm':
                this.setAccidental('#');
                break;
            case ',':
                this.setAccidental('##');
                break;
            case 'f':
                this.setArticulation('a.');
                break;
            case 'g':
                this.setArticulation('av');
                break;
            case 'h':
                this.setArticulation('a^');
                break;
            case 'j':
                this.setArticulation('a>');
                break;
            case 'k':
                this.setArticulation('a-');
                break;
            case 'l':
                this.setArticulation('a@a');
                break;
            case '-':
                this.removeCompas();
                break;
            case '+':
                this.addCompas();
                break;
            case 'Backspace':
            case 'r':
                this.setRest();
                break;
            case 't':
                this.setDynamic('pp');
                break;
            case 'y':
                this.setDynamic('p');
                break;
            case 'u':
                this.setDynamic('mp');
                break;
            case 'i':
                this.setDynamic('mf');
                break;
            case 'o':
                this.setDynamic('f');
                break;
            case 'p':
                this.setDynamic('ff');
                break;
            case 'q':
                this.setText('xd\n\n\n\nxd');
                break;
            case '0':
                this.setTriplet();
                break;
            case '8':
                this.setCrescendo();
                break;

            default:
        }


        const durationRegex = /^[1-7]$/;
        if (durationRegex.test(event.key)) {
            this.setRithm(event.key);
        }

    }

    handleClick(event) {
        const x = event.pageX - this.rec.left;
        const y = event.pageY - this.rec.top;

        if (this.temp_nota !== null) {
            let compas = this.pentagramas[this.penta_selected].compases[this.compas_selected];
            if (!compas.notas[this.nota_selected].hasKey(this.temp_nota.getKeys()[0])) {
                this.key_selected = compas.notas[this.nota_selected].addKey(this.temp_nota.getKeys()[0]);
                this.signDeselect();
                this.formated = false;
                this.Editdraw();
                return;
            }
            this.noteDeselect();
        }

        if (this.compases[0].getClefRec().collisionPoint(x, y)) {
            this.compases[0].selectClef();
            if (this.nota_selected !== -1) {
                this.noteDeselect();
            }
            this.Editdraw();
            return;
        }

        if (this.compases[0].getKeySignatureRec().collisionPoint(x, y)) {
            this.compases[0].selectKeySign();
            if (this.nota_selected !== -1) {
                this.noteDeselect();
            }
            this.Editdraw();
            return;
        }

        this.signDeselect();

        if (this.nota_selected !== -1) {
            let compas = this.pentagramas[this.penta_selected].compases[this.compas_selected];
            compas.notas[this.nota_selected].setSelected(-1);
        }

        for (let i = 0; i < this.pentagramas.length; i++) {
            let pentagrama = this.pentagramas[i];
            for (let j = 0; j < pentagrama.compases.length; j++) {
                if (pentagrama.compases[j].getRec().collisionPoint(x, y)) {
                    this.compas_selected = j;
                    this.penta_selected = i;
                }
            }
        }

        if (this.compas_selected === -1) {
            this.signDeselect();
            return;
        }

        let noteHeadRecs = [];
        let compas = this.pentagramas[this.penta_selected].compases[this.compas_selected];
        for (let i = 0; i < compas.notas.length; i++) {
            if (new VexRec(
                compas.notas[i].getX(),
                compas.getMinY(),
                10,
                compas.getFinalY() - compas.getMinY()
            ).collisionPoint(x, y)) {
                noteHeadRecs = compas.notas[i].getRecs();
                this.nota_selected = i;
            }
        }

        if (noteHeadRecs.length == 0) {
            this.noteDeselect();
            this.signDeselect();
            this.Editdraw();
            return;
        }

        for (let i = 0; i < noteHeadRecs.length; i++) {
            if (noteHeadRecs[i][1].collisionPoint(x, y)) {
                this.key_selected = noteHeadRecs[i][0];
            }
        }

        if (this.key_selected === '') {
            this.noteDeselect();
            this.signDeselect();
            this.Editdraw();
            return;
        }

        this.key_selected = compas.notas[this.nota_selected].setSelected(this.key_selected);
        this.Editdraw();
    }

    selectRight() {
        this.temp_compas = null;
        this.temp_nota = null;

        let inicial = this.compases[0];

        if (inicial.clef_sel) {
            inicial.selectKeySign();
            this.noteDeselect();
            return;
        }

        if (inicial.keySignature_sel) {
            inicial.noSignSelected();
            this.compas_selected = 0;
            this.nota_selected = 0;
            this.penta_selected = 0;
            this.key_selected = inicial.notas[0].setSelected('inicio');
            return;
        }

        if (this.nota_selected !== -1) {
            let compas = this.pentagramas[this.penta_selected].compases[this.compas_selected];
            compas.notas[this.nota_selected].setSelected('');
            if (this.nota_selected < compas.notas.length - 1) {
                this.nota_selected++;
                this.key_selected = compas.notas[this.nota_selected].setSelected('inicio');
                return;
            }

            let pentagrama = this.pentagramas[this.penta_selected];
            if (this.compas_selected < pentagrama.compases.length - 1) {
                this.compas_selected++;
                this.nota_selected = 0;
                let newCompas = pentagrama.compases[this.compas_selected];
                this.key_selected = newCompas.notas[this.nota_selected].setSelected('inicio');
                return;
            }

            if (this.penta_selected < this.pentagramas.length - 1) {
                this.penta_selected++;
                this.compas_selected = 0;
                this.nota_selected = 0;
                let newCompas = this.pentagramas[this.penta_selected].compases[this.compas_selected];
                this.key_selected = newCompas.notas[this.nota_selected].setSelected('inicio');
                return;
            }

            Editdraw();
            return;
        }

        inicial.selectClef();
    }

    selectLeft() {
        let inicial = this.compases[0];
        if (inicial.clef_sel)
            return;

        if (inicial.keySignature_sel) {
            inicial.selectClef();
            this.noteDeselect();
            return;
        }

        if (this.nota_selected !== -1) {
            let compas = this.pentagramas[this.penta_selected].compases[this.compas_selected];
            compas.notas[this.nota_selected].setSelected('');
            if (this.nota_selected > 0) {
                this.nota_selected--;
                this.key_selected = compas.notas[this.nota_selected].setSelected('inicio');
                return;
            }

            if (this.compas_selected > 0) {
                this.compas_selected--;
                let newCompas = this.pentagramas[this.penta_selected].compases[this.compas_selected];
                this.nota_selected = newCompas.notas.length - 1;
                this.key_selected = newCompas.notas[this.nota_selected].setSelected('inicio');
                return;
            }

            if (this.penta_selected > 0) {
                this.penta_selected--;
                let newPenta = this.pentagramas[this.penta_selected];
                this.compas_selected = newPenta.compases.length - 1;
                let newCompas = this.pentagramas[this.penta_selected].compases[this.compas_selected];
                this.nota_selected = newCompas.notas.length - 1;
                this.key_selected = newCompas.notas[this.nota_selected].setSelected('inicio');
                return;
            }

            inicial.selectKeySign();
            this.noteDeselect();
            return;
        }

        inicial.selectClef();
    }

    noteDeselect() {
        if (this.nota_selected === -1)
            return;
        this.temp_compas = null;
        this.temp_nota = null;

        let compas = this.pentagramas[this.penta_selected].compases[this.compas_selected];
        compas.notas[this.nota_selected].setSelected(-1);
        this.nota_selected = -1;
        this.compas_selected = -1;
        this.penta_selected = -1;
        this.key_selected = '';
    }

    signDeselect() {
        this.compases[0].noSignSelected();
    }

    switchPitch(switchP) {
        if (this.nota_selected === -1)
            return;
        let compas = this.pentagramas[this.penta_selected].compases[this.compas_selected];
        let nota = compas.notas[this.nota_selected];
        let newKey = switchP(this.key_selected);
        while (newKey !== null && nota.hasKey(newKey)) {
            newKey = switchP(newKey);
        }

        if (newKey === null)
            return;

        nota.setKey(newKey);
        this.key_selected = newKey;
    }

    keySignSwitch(switchKey) {
        let inicial = this.compases[0];
        if (inicial.keySignature_sel) {
            inicial.keySignature = switchKey(inicial.keySignature);
            return;
        }
    }

    switchClef(switchClf) {
        let inicial = this.compases[0];
        if (inicial.clef_sel)
            inicial.clef = switchClf(inicial.clef);
        return;
    }

    setRithm(durationNumber) {
        if (this.nota_selected === -1)
            return;

        let exp = parseInt(durationNumber) - 1;
        let duration = String(2 ** exp);

        let compas = this.pentagramas[this.penta_selected].compases[this.compas_selected];
        let prevDuration = compas.notas[this.nota_selected].getDuration();

        if (this.compasAdjustRithm(compas, duration, prevDuration)) {
            if (prevDuration.includes('r'))
                compas.notas[this.nota_selected].setDuration(duration + 'r');
            else
                compas.notas[this.nota_selected].setDuration(duration);
        }
        this.formated = false;
        this.Editdraw();
    }

    //continuar con la division de notas:
    compasAdjustRithm(compas, duration, prevDuration) {
        let intPrevDuration = parseInt(prevDuration);
        let intDuration = parseInt(duration);

        //si las duraciones son iguales pero tiene puntillo, se le quita
        if (intDuration === intPrevDuration) {
            if (compas.notas[this.nota_selected].hasDot()) {
                this.removeDot();
                return true;
            }
            return false;
        }

        //si la duracion es mayor a la capacidad del compas se anula el cambio
        if (1 / intDuration > compas.getTimeNum() / compas.getTimeDen())
            return false;

        //si la duracion es menor a la duracion anterior se dividira
        if (1 / intDuration < 1 / intPrevDuration) {
            if (compas.notas[this.nota_selected].hasDot())
                this.removeDot();
            let silencios = intDuration / intPrevDuration - 1;
            let nuevosSilencios = Array.from({ length: silencios }, () => new Nota(['b/4'], duration + 'r'));
            compas.notas.splice(this.nota_selected + 1, 0, ...nuevosSilencios);
            return true;
        }

        //la duracion es mayor o igual que la duracion anterior
        //se debe comprobar la duracion restante del compas (contando la nota seleccionada)
        let resDuration = 1 / intPrevDuration;
        if (compas.notas[this.nota_selected].hasDot())
            resDuration += (1 / (parseInt(compas.notas[this.nota_selected].getDuration()) * 2));

        for (let i = this.nota_selected + 1; i < compas.notas.length; i++) {
            resDuration += 1 / parseInt(compas.notas[i].getDuration());
        }

        //si la duracion es mayor que la duracion restante del compas se anula
        if (1 / intDuration > resDuration)
            return false;


        if (compas.notas[this.nota_selected].hasDot())
            this.removeDot();


        //la nota atropellara a otras notas
        //se calcula el excedente que atropella a otras notas
        let durFrac = new Fraction(1, intDuration);
        let prevDurFrac = new Fraction(1, intPrevDuration);

        let excessFrac = durFrac.subtract(prevDurFrac);
        //let excessDur = 1 / intDuration - 1 / intPrevDuration;
        this.fixOverlapNotes(compas, this.nota_selected + 1, excessFrac)
        return true;
    }

    fixOverlapNotes(compas, indexNote, excessFrac) {
        for (let i = indexNote; i < compas.notas.length; i++) {

            let currentDur = new Fraction(1, parseInt(compas.notas[i].getDuration()));
            //si el exedente es igual a la duracion acual, le hace pop
            if (excessFrac.equals(currentDur)) {
                compas.notas.splice(i, 1);
                return;
            }

            //si el exedente es mayor o igual a la duracion actual, le hace pop
            //y se ajusta el exedente
            if (excessFrac.greaterThanEquals(currentDur)) {
                compas.notas.splice(i, 1);
                excessFrac.subtract(currentDur);
                i--;
                continue;
            }

            //si no las cubre totalmente
            //entonces su ritmo debe ser dividido
            this.biteNote(compas, i, excessFrac);
            return;
        }
    }

    /*********************************************************************************************/
    //este metodo debe ligar las notas generadas
    //aun esta implementado la ligadura
    /************************************************************************************************/
    biteNote(compas, i, biteFraction) {
        let currentDur = new Fraction(1, parseInt(compas.notas[i].getDuration()));
        let restRitmo = currentDur.subtract(biteFraction);

        while (restRitmo.numerator !== 0) {
            restRitmo.simplify();
            if (compas.notas[i].isRest())
                compas.notas.splice(i + 1, 0, new Nota(['b/4'], String(restRitmo.denominator) + 'r'));
            else
                compas.notas.splice(i + 1, 0, new Nota(
                    [...compas.notas[i].keys.slice()],
                    String(restRitmo.denominator)));

            restRitmo.subtract(new Fraction(1, restRitmo.denominator));
        }
        compas.notas.splice(i, 1);
    }

    //si el puntillo es valido, se acomoda todo el compas
    //usando los mismos metodos que al cambiar de ritmo
    //se debe diferenciar del metodo addDot de la clase Nota
    addDot() {
        if (this.nota_selected === -1)
            return;

        let compas = this.pentagramas[this.penta_selected].compases[this.compas_selected];
        if (compas.notas[this.nota_selected].hasDot())
            return;

        let resDuration = new Fraction(0, 1);
        for (let i = this.nota_selected + 1; i < compas.notas.length; i++) {
            resDuration += new Fraction(1, parseInt(compas.notas[i].getDuration()));
        }
        //si el dot no cabe, no se hace nada
        let dotDuration = new Fraction(1, parseInt(compas.notas[this.nota_selected].getDuration()));
        dotDuration.divide(2);
        if (dotDuration.greaterThan(resDuration))
            return;

        //cabe, entonces se sobrepone a las siguientes notas
        compas.notas[this.nota_selected].addDot();
        this.fixOverlapNotes(compas, this.nota_selected + 1, dotDuration);

        this.formated = false;
        this.Editdraw();
    }

    //remueve el puntillo y agrega un silencio en su lugar
    //se usa cuando el ritmo de la nota cambia o cuando se elimina el puntillo
    //se debe diferenciar del metodo removeDot de la clase Nota
    removeDot() {
        let compas = this.pentagramas[this.penta_selected].compases[this.compas_selected];
        compas.notas[this.nota_selected].removeDot();
        let duration = parseInt(compas.notas[this.nota_selected].getDuration()) * 2;
        compas.notas.splice(this.nota_selected + 1, 0, new Nota(['b/4'], String(duration) + 'r'))
    }

    setAccidental(accidental) {
        if (this.nota_selected === -1)
            return;

        let compas = this.pentagramas[this.penta_selected].compases[this.compas_selected];
        if (compas.notas[this.nota_selected].setAccidental(accidental, this.key_selected)) {
            this.formated = false;
            this.Editdraw();
        }
    }

    setArticulation(articulation) {
        if (this.nota_selected === -1)
            return;
        let compas = this.pentagramas[this.penta_selected].compases[this.compas_selected];
        compas.notas[this.nota_selected].setArticulation(articulation);
        this.Editdraw();
    }

    addTie() {

    }

    cutCompas(numerator, denominator) {
        for (let i = 0; i < this.compases.length; i++) {
            let cutFrac = new Fraction(numerator, denominator);
            let compas = this.compases[i];
            for (let j = 0; j < compas.notas.length; j++) {
                let currentDur = new Fraction(1, parseInt(compas.notas[j].getDuration()));
                if (cutFrac.greaterThanEquals(currentDur)) {
                    cutFrac.subtract(currentDur);
                    continue;
                }

                if (cutFrac.numerator === 0) {
                    compas.notas.splice(j, 1);
                    j--;
                    continue;
                }

                this.biteNote(compas, j, cutFrac);
                cutFrac.subtract(cutFrac);
            }
        }
    }

    incresCompasNum(numerator, denominator) {
        let compas = this.compases[0];
        let extraNum = numerator - compas.getTimeNum();

        for (let i = 0; i < this.compases.length; i++) {
            let j = 0;
            while (j < extraNum) {
                this.compases[i].addNota(['b/4'], String(denominator) + 'r');
                j++;
            }
        }
    }

    setCompasNum(num) {
        let compas = this.compases[0];
        let prevNum = compas.getTimeNum();

        if (prevNum === num)
            return;

        if (this.nota_selected !== -1)
            this.noteDeselect();

        this.signDeselect();

        if (prevNum > num)
            this.cutCompas(num, compas.getTimeDen());
        else
            this.incresCompasNum(num, compas.getTimeDen());

        compas.setTimeNum(num);
        this.formated = false;
        this.Editdraw();
        return;
    }

    decreaseCompasDen(numerator, denominator) {
        let prevDen = this.compases[0].getTimeDen();

        for (let i = 0; i < this.compases.length; i++) {
            let compas = this.compases[i];
            let extraFrac = new Fraction(numerator, denominator);
            extraFrac.subtract(new Fraction(numerator, prevDen));

            while (extraFrac.numerator !== 0) {
                extraFrac.simplify();
                compas.addNota(['b/4'], String(extraFrac.denominator) + 'r');
                extraFrac.subtract(new Fraction(1, extraFrac.denominator));
            }
        }
    }

    setCompasDen(den) {
        let compas = this.compases[0];
        let prevDen = compas.getTimeDen();

        if (prevDen === den)
            return;

        if (this.nota_selected !== -1)
            this.noteDeselect();

        this.signDeselect();

        if (prevDen > den)
            this.decreaseCompasDen(compas.getTimeNum(), den);
        else
            this.cutCompas(compas.getTimeNum(), den);

        compas.setTimeDen(den);
        this.formated = false;
        this.Editdraw();
        return;
    }

    setRest() {
        if (this.nota_selected === -1)
            return;

        let compas = this.pentagramas[this.penta_selected].compases[this.compas_selected];
        if (compas.notas[this.nota_selected].isRest())
            return;

        compas.notas[this.nota_selected].convertToRest();
        this.formated = false;
        this.Editdraw();
    }

    setDynamic(dynamic) {
        if (this.nota_selected === -1)
            return;
        let compas = this.pentagramas[this.penta_selected].compases[this.compas_selected];
        compas.notas[this.nota_selected].setDynamic(dynamic);
        this.Editdraw();
    }

    setText(text) {
        if (this.nota_selected === -1)
            return;
        let compas = this.pentagramas[this.penta_selected].compases[this.compas_selected];
        compas.notas[this.nota_selected].setText(text);
        this.formated = false;
        this.Editdraw();
    }

    setTriplet() {
        if (this.nota_selected === -1)
            return;

        let compas = this.pentagramas[this.penta_selected].compases[this.compas_selected];
        let nota = compas.notas[this.nota_selected];

        if (nota.isInTuplet()) {
            for (let i = 0; i < compas.tuplets.length; i++) {
                if (compas.tuplets[i].hasNote(nota)) {
                    this.key_selected = compas.removeTuplet(i);
                    this.nota_selected = i
                    break;
                }
            }
            this.formated = false;
            this.Editdraw();
            return;
        }

        if (nota.isRest())
            return;

        let dur = parseInt(nota.getDuration());
        dur *= 2;

        nota.setDuration(String(dur));

        let nuevosSilencios = Array.from({ length: 2 }, () => new Nota(['b/4'], String(dur) + 'r'));
        compas.notas.splice(this.nota_selected + 1, 0, ...nuevosSilencios);

        compas.tuplets.push(new VexTuplet(compas.notas.slice(this.nota_selected, this.nota_selected + 3)));

        this.formated = false;
        this.Editdraw();
    }

    setCrescendo() {
        if (this.nota_selected === -1)
            return;

        if (this.prevNota_selected === -1) {
            this.cresc = true;
            this.prevPenta_selected = this.penta_selected;
            this.prevCompas_selected = this.compas_selected;
            this.prevNota_selected = this.nota_selected;
            this.Editdraw();
            return;
        }

        if (this.nota_selected === this.prevNota_selected) {
            this.deselectPrevNote();
            this.Editdraw();
            return;
        }


        if (this.penta_selected === this.prevPenta_selected) {
            let pentagrama = this.pentagramas[this.penta_selected];
            pentagrama.addCrescendo(
                this.prevCompas_selected,
                this.prevNota_selected,
                this.compas_selected,
                this.nota_selected,
                this.crescendos);
            this.deselectPrevNote();
            this.Editdraw();
            return;
        }

        this.deselectPrevNote();
        this.Editdraw();

    }

    deselectPrevNote() {
        this.prevPenta_selected = -1;
        this.prevCompas_selected = -1;
        this.prevNota_selected = -1;
    }
}


/*
// Función para reproducir una nota
playNote(frequency, duration) {
    // Crear un oscilador
    const oscillator = this.audioContext.createOscillator();

    // Establecer la frecuencia de la nota (por ejemplo, 440 Hz para La)
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    // Crear un amplificador (GainNode) para controlar el volumen
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);  // Controla el volumen

    // Conectar el oscilador al amplificador y luego al destino de salida (los altavoces)
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Iniciar el oscilador
    oscillator.start();

    // Detener el oscilador después de la duración indicada
    oscillator.stop(this.audioContext.currentTime + duration);
}

*/

/* Probar si el mousemov tiene bajo rendimiento
   handleMovRequestAnimFrame(event) {
       if (!this.isMoving) {
           this.isMoving = true;
           requestAnimationFrame(() => {
               this.handleMov(event);
               this.isMoving = false;
           });
       }
   }*/