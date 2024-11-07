class EditorListener {
    constructor(svg) {
        this.svgElement = document.getElementById(svg);
        this.svgElement.addEventListener('click', (event) => this.handleClick(event));
        //requiere focus si se configura con svgElement
        document.addEventListener('keydown', this.debounce(this.handleKeydown.bind(this), 100));
        this.rec = this.svgElement.getBoundingClientRect();
        this.nota_selected = -1;
        this.compas_selected = -1;

        this.compases = [];

        this.clef = null;
        this.timeSign = null;
        this.keySign = null;

        this.formated = false;
    }

    debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    handleKeydown(event) {
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
            default:
        }

        const durationRegex = /^[1-7]$/;
        if (durationRegex.test(event.key)) {
            let exp = parseInt(event.key) - 1;
            this.formated = false;
            this.setRithm(String(2 ** exp));
            this.Editdraw();
        }
    }

    handleClick(event) {
        const x = event.pageX - this.rec.left;
        const y = event.pageY - this.rec.top;

        if (this.compases[0].getClefRec().collisionPoint(x, y)) {
            this.compases[0].selectClef();
            if (this.nota_selected !== -1) {
                this.noteDeselect();
            }
            this.Editdraw();
            return;
        }

        /*
        if (this.compases[0].getTimeNumRec().collisionPoint(x, y)) {
            this.compases[0].selectTime();
            if (this.nota_selected !== -1) {
                this.noteDeselect();
            }
            this.Editdraw();
            return;
        }*/

        if (this.compases[0].getKeySignatureRec().collisionPoint(x, y)) {
            this.compases[0].selectKeySign();
            if (this.nota_selected !== -1) {
                this.noteDeselect();
            }
            this.Editdraw();
            return;
        }

        let sel_c = 0;
        for (let i = 0; i < this.compases.length; i++) {
            for (let j = 0; j < this.compases[i].notas.length; j++) {
                if (this.compases[i].notas[j].getRec().collisionPoint(x, y)) {
                    this.compas_selected = i;
                    this.nota_selected = j;
                    this.compases[i].notas[j].setSelected(true);
                    this.compases[0].noSignSelected();
                    sel_c++;
                }
                else {
                    this.compases[i].notas[j].setSelected(false);
                }
            }
        }
        if (sel_c == 0) {
            this.nota_selected = -1;
            this.compas_selected = -1;
            this.compases[0].noSignSelected();
        }
        this.Editdraw();
    }

    selectRight() {
        let inicial = this.compases[0];

        if (inicial.clef_sel) {
            inicial.selectKeySign();
            this.nota_selected = -1;
            this.compas_selected = -1;
            return;
        }

        if (inicial.keySignature_sel) {
            inicial.selectTime();
            this.nota_selected = -1;
            this.compas_selected = -1;
            return;
        }

        if (inicial.timeSignature_sel) {
            inicial.noSignSelected();
            this.compas_selected = 0;
            this.nota_selected = 0;
            inicial.notas[0].setSelected(true);
            return;
        }

        if (this.nota_selected !== -1) {
            if (this.nota_selected < this.compases[this.compas_selected].notas.length - 1) {
                this.compases[this.compas_selected].notas[this.nota_selected++].setSelected(false);
                this.compases[this.compas_selected].notas[this.nota_selected].setSelected(true);
                return;
            }
            if (this.compas_selected < this.compases.length - 1) {
                this.compases[this.compas_selected++].notas[this.nota_selected].setSelected(false);
                this.nota_selected = 0;
                this.compases[this.compas_selected].notas[this.nota_selected].setSelected(true);
                return;
            }

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
            this.nota_selected = -1;
            this.compas_selected = -1;
            return;
        }

        if (inicial.timeSignature_sel) {
            inicial.selectKeySign();
            this.nota_selected = -1;
            this.compas_selected = -1;
            return;
        }

        if (this.nota_selected !== -1) {
            if (this.nota_selected > 0) {
                this.compases[this.compas_selected].notas[this.nota_selected--].setSelected(false);
                this.compases[this.compas_selected].notas[this.nota_selected].setSelected(true);
                return;
            }

            this.compases[this.compas_selected].notas[this.nota_selected].setSelected(false);
            if (this.compas_selected > 0) {
                this.nota_selected = this.compases[this.compas_selected--].notas.length - 1;
                this.compases[this.compas_selected].notas[this.nota_selected].setSelected(true);
                return;
            }

            inicial.selectTime();
            this.compases[this.compas_selected].notas[this.nota_selected].setSelected(false);
            this.nota_selected = -1;
            this.compas_selected = -1;
            return;
        }

        inicial.selectClef();
    }

    noteDeselect() {
        this.compases[this.compas_selected]
            .notas[this.nota_selected]
            .setSelected(false);

        this.nota_selected = -1;
        this.compas_selected = -1;
    }

    switchPitch(switchP) {
        if (this.nota_selected === -1)
            return;

        let nota = this.compases[this.compas_selected].notas[this.nota_selected];
        nota.setKey(switchP(nota.keys[0]));
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

    setRithm(duration) {
        if (this.nota_selected === -1)
            return;

        let compas = this.compases[this.compas_selected];
        let prevDuration = compas.notas[this.nota_selected].getDuration();

        if (prevDuration.includes('r'))
            compas.notas[this.nota_selected].setDuration(duration + 'r');
        else
            compas.notas[this.nota_selected].setDuration(duration);

        this.compasAdjustRithm(compas, duration, prevDuration);
    }

    //continuar con la division de notas:
    compasAdjustRithm(compas, duration, prevDuration) {
        let intPrevDuration = parseInt(prevDuration);
        let intDuration = parseInt(duration);

        if (intDuration == intPrevDuration)
            return;

        //si la duracion es mayor a la capacidad del compas 
        if (1 / intDuration > compas.getCapacity()) {
            compas.notas[this.nota_selected].setDuration(prevDuration);
            return;
        }

        //si la duracion es menor a la nota que esta modificando se dividira
        if (1 / intDuration < 1 / intPrevDuration) {
            let silencios = intDuration / intPrevDuration - 1;
            const nuevosSilencios = Array.from({ length: silencios }, () => new Nota(['b/4'], duration + 'r'));
            compas.notas.splice(this.nota_selected + 1, 0, ...nuevosSilencios);
            return;
        }

        //ya que la duracion sobrepasa la duracion de la nota padre,
        //se debe comprobar la duracion restante del compas (contando la nota seleccionada)
        let resDuration = 1 / intPrevDuration;
        for (let i = this.nota_selected + 1; i < compas.notas.length; i++) {
            resDuration += 1 / parseInt(compas.notas[i].getDuration());
        }

        //si la duracion es mayor que la duracion restante del compas
        if (1 / intDuration > resDuration) {
            compas.notas[this.nota_selected].setDuration(prevDuration);
            return;
        }

        //la nota atropellara a otras notas
        //se calcula el excedente que atropella a otras notas
        let durFrac = new Fraction(1, intDuration);
        let prevDurFrac = new Fraction(1, intPrevDuration);

        let surplusFrac = durFrac.subtract(prevDurFrac);

        //let surplusDur = 1 / intDuration - 1 / intPrevDuration;

        for (let i = this.nota_selected + 1; i < compas.notas.length; i++) {

            let currentDur = new Fraction(1, parseInt(compas.notas[i].getDuration()));

            //si el exedente es igual a la duracion acual, le hace pop
            if (surplusFrac.equals(currentDur)) {
                compas.notas.splice(i, 1);
                i--;
                return;
            }

            //si el exedente es mayor o igual a la duracion actual, le hace pop
            //y se ajusta el exedente
            if (surplusFrac.greaterThanEquals(currentDur)) {
                compas.notas.splice(i, 1);
                surplusFrac.subtract(currentDur);
                i--;
                continue;
            }

            //si no las cubre totalmente
            //entonces su ritmo debe ser dividido
            //calcular el resultante de la duracion - la mordida que se le dio
            //dividir el resultante en notas coherentes
            //el siguiente codigo no cumple lo anterior
            let restoRitmo = currentDur.subtract(surplusFrac);

            while (restoRitmo.numerator !== 0) {
                restoRitmo.simplify();

                alert(String(restoRitmo.numerator) + ' ' + String(restoRitmo.denominator));
                if (compas.notas[i].isRest())
                    compas.notas.splice(i + 1, 0, new Nota(['b/4'], String(restoRitmo.denominator) + 'r'));
                else
                    compas.notas.splice(i + 1, 0, new Nota(['b/4'], String(restoRitmo.denominator)));

                restoRitmo.subtract(new Fraction(1, restoRitmo.denominator));
            }
            compas.splice(i, 1);
            return;
        }


    }
}

