class EditorListener {
    constructor(canvas) {
        this.canvas = document.getElementById(canvas);
        this.canvas.addEventListener('click', (event) => this.handleClick(event));
        /*
        this.canvas.addEventListener('mousemove', (event) => {
            if (this.nota_selected !== -1) {
                // Si nota_selected es diferente de -1, ejecutamos la función debounced
                this.debounce(this.handleMov.bind(this), 60)(event);
            }
        });*/

        //requiere focus si se configura con svgElement
        document.addEventListener('keydown', this.debounce(this.handleKeydown.bind(this), 16));
        this.rec = this.canvas.getBoundingClientRect();
        this.nota_selected = -1;
        this.compas_selected = -1;

        this.compases = [];

        this.formated = false;

    }

    debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }



    handleMov(event) {

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
            case '.':
                if (this.addDot()) {
                    this.formated = false;
                    this.Editdraw();
                }
                break;
            default:
        }

        if (this.nota_selected !== -1) {
            const durationRegex = /^[1-7]$/;
            if (durationRegex.test(event.key)) {
                let exp = parseInt(event.key) - 1;
                if (this.setRithm(String(2 ** exp))) {
                    this.formated = false;
                    this.Editdraw();
                }
            }
        }

    }

    handleClick(event) {
        const x = event.pageX - this.rec.left;
        const y = event.pageY - this.rec.top + 15;


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
                this.nota_selected = this.compases[--this.compas_selected].notas.length - 1;
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
            return false;

        let compas = this.compases[this.compas_selected];
        let prevDuration = compas.notas[this.nota_selected].getDuration();

        if (this.compasAdjustRithm(compas, duration, prevDuration)) {
            if (prevDuration.includes('r'))
                compas.notas[this.nota_selected].setDuration(duration + 'r');
            else
                compas.notas[this.nota_selected].setDuration(duration);
            return true;
        }
        return false;
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
        if (1 / intDuration > compas.getCapacity())
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
            return false;

        let compas = this.compases[this.compas_selected];
        if (compas.notas[this.nota_selected].hasDot())
            return false;

        let resDuration = new Fraction(0, 1);
        for (let i = this.nota_selected + 1; i < compas.notas.length; i++) {
            resDuration += new Fraction(1, parseInt(compas.notas[i].getDuration()));
        }
        //si el dot no cabe, no se hace nada
        let dotDuration = new Fraction(1, parseInt(compas.notas[this.nota_selected].getDuration()));
        dotDuration.divide(2);
        if (dotDuration.greaterThan(resDuration))
            return false;

        //cabe, entonces se sobrepone a las siguientes notas
        compas.notas[this.nota_selected].addDot();
        this.fixOverlapNotes(compas, this.nota_selected + 1, dotDuration);
        return true;
    }

    //remueve el puntillo y agrega un silencio en su lugar
    //se usa cuando el ritmo de la nota cambia o cuando se elimina el puntillo
    //se debe diferenciar del metodo removeDot de la clase Nota
    removeDot() {
        let compas = this.compases[this.compas_selected];
        compas.notas[this.nota_selected].removeDot();
        let duration = parseInt(compas.notas[this.nota_selected].getDuration()) * 2;
        compas.notas.splice(this.nota_selected + 1, 0, new Nota(['b/4'], String(duration) + 'r'))
    }

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
}







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