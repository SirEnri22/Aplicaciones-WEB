document.getElementById('formulario').addEventListener('submit', function (evento) {
    evento.preventDefault();

    let num1 = document.getElementById('num1').value;
    let num2 = document.getElementById('num2').value;
    let lista = document.getElementById('listaResultados');

    lista.innerHTML = '';

    if (num1 === '' || num2 === '') {
        lista.innerHTML = '<li class="resultado">Ingrese los dos numeros</li>';
        return;
    }

    num1 = Number(num1);
    num2 = Number(num2);

    for (let i = 0; i < 5; i++) {
        let valor, signo, noSePuede = false;

        switch (i) {
            case 0: signo = '+'; valor = num1 + num2; break;
            case 1: signo = '-'; valor = num1 - num2; break;
            case 2: signo = '*'; valor = num1 * num2; break;
            case 3: signo = '/'; noSePuede = (num2 == 0); valor = num1 / num2; break;
            case 4: signo = '%'; noSePuede = (num2 == 0); valor = num1 % num2; break;
        }

        let texto = 'Iteracion ' + (i + 1) + ': ';
        if (noSePuede) {
            texto = texto + 'No se puede usar ' + signo + ' porque num2 es 0';
        } else {
            texto = texto + num1 + ' ' + signo + ' ' + num2 + ' = ' + valor;
        }

        lista.innerHTML = lista.innerHTML + '<li class="resultado">' + texto + '</li>';
    }
});
