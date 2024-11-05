class EditorListener {
    constructor(svg) {
        this.svgElement = document.getElementById(svg);
        this.svgElement.addEventListener('click', (event) => this.handleClick(event));
        //requiere focus si se configura con svgElement
        document.addEventListener('keydown', this.debounce((event) => this.handleKeydown(event), 45));
        this.rec = this.svgElement.getBoundingClientRect();
        this.nota_selected = null;

        this.formated = false;
    }

    debounce(func, delay) {
        let timeout;
        return function(...args) {
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
                this.pitchUp();
                this.Editdraw();
                break;
            case 's':
                this.formated = false;
                this.pitchDown();
                this.Editdraw();
                break;
            default:
        }
    }

    handleClick(event) {
        
        const x = event.pageX - this.rec.left;
        const y = event.pageY - this.rec.top;
        for (let i = 0; i < this.compases.length; i++) {
            for (let j = 0; j < this.compases[i].notas.length; j++) {
                if (this.compases[i].notas[j].getRec().collisionPoint(x, y)) {
                    this.compases[i].notas[j].setSelected(true);
                    this.nota_selected = this.compases[i].notas[j];
                }
                else {
                    this.compases[i].notas[j].setSelected(false);
                }

            }
        }
        this.Editdraw();
    }

  
    selectRight() {
        for (let i = 0; i < this.compases.length; i++) {
            for (let j = 0; j < this.compases[i].notas.length; j++) {
                if (this.compases[i].notas[j].isSelected()) {
                    this.compases[i].notas[j].setSelected(false);
                    if (j < this.compases[i].notas.length - 1) {
                        this.nota_selected = this.compases[i].notas[j + 1];
                        this.nota_selected.setSelected(true);
                        return;
                    }
                    if (i < this.compases.length - 1) {
                        this.nota_selected = this.compases[i + 1].notas[0];
                        this.nota_selected.setSelected(true);
                        return;
                    }
                    else {
                        this.nota_selected = this.compases[i].notas[this.compases[i].notas.length - 1];
                        this.nota_selected.setSelected(true);
                        return;
                    }
                }
            }
        }
        this.nota_selected = this.compases[0].notas[0]
        this.nota_selected.setSelected(true);

    }

    selectLeft() {
        for (let i = 0; i < this.compases.length; i++) {
            for (let j = 0; j < this.compases[i].notas.length; j++) {
                if (this.compases[i].notas[j].isSelected()) {
                    this.compases[i].notas[j].setSelected(false);
                    if (j > 0) {
                        this.nota_selected = this.compases[i].notas[--j];
                        this.nota_selected.setSelected(true);
                        return;
                    }
                    if (i > 0) {
                        this.nota_selected = this.compases[i - 1].notas[this.compases[i - 1].notas.length - 1];
                        this.nota_selected.setSelected(true);
                        return;
                    }
                }
            }
        }
        this.nota_selected = this.compases[0].notas[0]
        this.compases[0].notas[0].setSelected(true);
    }


    pitchUp() {
        this.nota_selected.setKey(Alturas.getNextNote(this.nota_selected.keys[0]));
    }

    pitchDown() {
        this.nota_selected.setKey(Alturas.getPreviusNote(this.nota_selected.keys[0]));
    }
}