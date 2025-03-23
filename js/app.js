$(document).ready(function() {
    let secuencia = [];
    let secuenciaUsuario = [];
    let nivel = 1;
    let estaJugando = false;

    // Selecciona los botones y el botón de inicio
    const $botones = $('.contenedor');
    const $botonInicio = $('.empezar');
    const $gameOverContainer = $('#game-over-container'); // Contenedor de "Game Over"
    const $nivelFinal = $('#nivel-final'); // Elemento para mostrar el nivel final

    // Función para añadir un nuevo elemento aleatorio a la secuencia
    function agregarASecuencia() {
        const indiceAleatorio = Math.floor(Math.random() * 4); // Número aleatorio entre 0 y 3
        secuencia.push(indiceAleatorio); // Añade el nuevo índice a la secuencia
    }

    // Función para mostrar la secuencia al jugador
    function mostrarSecuencia() {
        let i = 0;
        const intervalo = setInterval(() => {
            if (i >= secuencia.length) {
                clearInterval(intervalo);
                return;
            }
            const boton = $botones[secuencia[i]];
            $(boton).css('transform', 'scale(1.07)'); // Escalar el botón
            setTimeout(() => {
                $(boton).css('transform', 'scale(1)'); // Volver a la escala normal
            }, 500);
            i++;
        }, 1000);
    }

    // Función para reiniciar el juego
    function reiniciarJuego() {
        secuencia = [];
        secuenciaUsuario = [];
        nivel = 1;
        estaJugando = false;
        $botonInicio.text('Comenzar');
        $gameOverContainer.hide(); // Oculta el contenedor de "Game Over"
    }

    // Función para manejar el clic del jugador
    function manejarClic(indice) {
        if (!estaJugando) return;

        secuenciaUsuario.push(indice);
        const $boton = $botones[indice];
        $($boton).css('transform', 'scale(1.05)'); // Escalar el botón al hacer clic
        setTimeout(() => {
            $($boton).css('transform', 'scale(1)'); // Volver a la escala normal
        }, 300);

        // Verificar si el jugador ha cometido un error
        if (secuenciaUsuario[secuenciaUsuario.length - 1] !== secuencia[secuenciaUsuario.length - 1]) {
            gameOver(); // Llamar a la función de Game Over
            return;
        }

        // Verificar si el jugador ha completado la secuencia actual
        if (secuenciaUsuario.length === secuencia.length) {
            nivel++;
            secuenciaUsuario = []; // Reiniciar la secuencia del jugador
            setTimeout(() => {
                agregarASecuencia(); // Añadir un nuevo elemento aleatorio a la secuencia
                mostrarSecuencia(); // Mostrar la nueva secuencia
            }, 1000);
        }
    }

    // Función para mostrar "Game Over"
    function gameOver() {
        estaJugando = false;
        $botones.off("click", manejarClic); // Desactiva la entrada del jugador

        // Muestra el contenedor de "Game Over"
        $nivelFinal.text(nivel); // Actualiza el nivel alcanzado
        $gameOverContainer.show(); // Muestra el contenedor

        // Cambia el texto del botón a "Reiniciar"
        $botonInicio.text("Reiniciar");

        // Evento para cerrar el contenedor al hacer clic fuera de él
        $(document).on('click', function(event) {
            if (!$(event.target).closest('#game-over-container').length) {
                $gameOverContainer.hide(); // Oculta el contenedor de "Game Over"
                $(document).off('click'); // Elimina el evento de clic después de cerrar el contenedor
            }
        });
    }

    // Asignar eventos a los botones
    $botones.each(function(indice) {
        $(this).on('click', () => manejarClic(indice));
    });

    // Asignar evento al botón de inicio
    $botonInicio.on('click', function() {
        if (!estaJugando) {
            estaJugando = true;
            $(this).text('Jugando...');
            secuencia = []; // Reiniciar la secuencia
            agregarASecuencia(); // Añadir el primer elemento aleatorio
            mostrarSecuencia(); // Mostrar la secuencia
        } else {
            reiniciarJuego(); // Reiniciar el juego si se hace clic en "Reiniciar"
        }
    });
});