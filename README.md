Proyecto hecho por Andrés Martínez Sierra

En este archivo README se explica cómo se formó la solución y se profundiza más en los métodos implementados.



En el archivo index.html se debe dibujar la cuadrícula, así que añadí una tabla con 20 table rows "<tr>", cada uno con un id empezando desde el 0 hasta llegar al 20. Ejemplo:

<tr id="row0"></tr>

Estos tr por el momento estarán vacíos, los hijos (que serán las celdas <td> de cada <tr>) se insertarán desde el archivo index.js

También se añadirá un botón con la etiqueta Iterar para ejecutar la función iterate(), se profundizará en cómo funciona ese método más adelante.



En el archivo index.js se crearon las siguientes variables:

board : Es un arreglo en el cual se indica que hay en cada celda del tablero (si hay una pared, ventana, humano o zombie). Este arreglo se declara vacío y usando métodos definidos más adelante se llena y actualiza.

humansLeft : Es un arreglo vacío el cual sirve para guardar información crucial sobre los supervivientes (su posición, si están infectados, o si llegaron a la salida). En este arreglo se insertan objetos de clase Human, la cual se detallará más adelante.

zombiesLeft : Es un arreglo vacío el cual sirve para guardar información crucial sobre los zombies (su posición o cuántos zombies hay en total). En este arreglo se insertan objetos de la clase Zombie, la cual se explicará más adelante.

savedHumans : Una variable la cual nos indica el número de humanos que llegaron a la salida, se inicializa en 0.

iterations : Una variable la cual nos indica el número de iteraciones que han pasado, se inicializa en 0.

fileData : Una variable en la cual se guardará la información solicitada sobre cada iteración: Núm. Iteración | Núm. Zombies | Núm. humanos en la oficina | Núm. humanos salvados


En el archivo index.js también se crearon los métodos, empezando por el que ejecuta el body al momento de cargar el index.html, que es el método setBoard().

El método setBoard() es un método el cual básicamente añade arreglos de 0's utilizando ciclos anidados, conviertiendo al arreglo "board" en un arreglo 2D de 20x20, cada elemento siendo un 0.

for (let i = 0; i < 20; i++) {
	let row = []
	for (let j = 0; j < 20; j++) {
		row.push(0);
	}
	board.push(row);
}

Posteriormente el método manda a llamar 4 funciones: setStructures(), setHumans(), setZombies() y drawBoard().

El método setStructures() es un método el cual contiene una variable llamada structures, la cual es un arreglo que contiene información para la posición de las estructuras (ventanas y paredes). Cada elemento del arreglo "structures" contiene un arreglo conformado de la siguiente manera:

[0, 19, false, 14, 'P'], //Right Wall
[0, 3, true, 6, 'V'], //Windows (Left)

El elemento 0 y 1 del arreglo nos indica en que fila y columna empieza a establecerse dicha estructura. El elemento 2 nos indica en que posición se establecerá la estructura (si es true en horizontal, si es false en vertical). El elemento 3 nos indica en que fila/columna termina el elemento a insertar. Finalmente el elemento 4 indica si el elemento a insertar es una pared 'P' o una ventana 'V'.
En el ejemplo previo el primer elemento indica que el tablero tendrá un elemento que empieza en la fila 0, columna 19, vertical, debido a esto termina en la fila 14, y es una pared.
El segundo elemento empieza en la fila 0, columna 3, es horizontal, por lo tanto termina en la columna 6, y es una ventana.

Para procesar estos datos, al arreglo "structures" se le aplica un forEach(), invocando dentro de este ciclo la función createStructure(), pasando como argumento el elemento del forEach, utilizando el spread Operator.

structures.forEach(structure => {
        createStructure(...structure);
});

El método createStructure() es el método para definir las estructuras en el arreglo "board". En el método se definen 5 argumentos:
row : Para determinar en que fila empieza el elemento
column : Para determinar la columna en la que empieza el elemento
isRow : Un booleano que nos indicará si el elemento a colocar será horizontal o no
final : Para determinar en que fila o columna termina el tamaño del elemento
element : Para determinar si el elemento es una pared 'P' o ventana 'V'.
El método funciona de la siguiente manera: si el parámetro isRow es true, la función entra a un ciclo, el cual el iterador "i" es igual a "col" y terminará cuando dicho iterador sea mayor a final, entonces en cada iteración se cambiará el valor en el arreglo board en la posición [row][i] por elemento (siendo 'P' o 'V'), manteniendo la variable "row" constante.

for (let i = col; i <= final; i++) {
	board[row][i] = element;
}

Caso contrario (si "isRow" es false), la función entra a un ciclo parecido al anterior, sin embargo el iterador "i" será igual a "row", entonces en cada iteración se cambiará el valor en el arreglo board en la posición [i][col] por elemento (siendo 'P' o 'V'), manteniendo la variable "col" constante.

for (let i = row; i <= final; i++) {
	board[i][col] = element;
}


Después de terminar esto, ahora la función setBoard() ejecuta la función setHumans().
En la función setHumans() existe una constante llamada "humanCells", la cual es un arreglo en la que se guarda la posición de donde aparece cada humano inicialmente, de la siguiente manera:

[1, 9]

Siendo el elemento 0 la fila y el elemento 1 la columna.

Despues de declarar "humanCells", este elemento pasa por un forEach() para iterar cada posición de cada humano, reemplazando en la variable "board", en la posición de la fila y columna del humano, por la letra 'H'. También al arreglo "humansLeft" se añade un nuevo Objeto de la clase Human, pasando como argumentos el elemento en la posición 0 y 1.

humanCells.forEach(position => {
	board[position[0]][position[1]] = 'H'; //Set human in the board
	humansLeft.push(new Human(position[0], position[1]));
});

La clase Human es una clase la cual contiene los siguientes parámetros:
row : Nos indica en que fila del tablero se encuentra el humano.
col : Nos indica en que columna del tablero se encuentra el humano.
infected : Para saber si el humano ha sido infectado. Se inicializa en false
timeToBecomeZombie : Para saber el número de iteraciones que le quedan al humano antes de convertirse en zombie si ha sido infectado. Se inicializa en 3

La clase Human cuenta con el método contructor, para inicializar la posición donde se encuentra, mandando como parámetros la fila y la columna, en ese orden. La clase también cuenta con el método restLife en el cual profundizaremos más adelante.

Después de que setBoard() haya ejecutado setHumans(), invocará el método setZombies().
El método setZombies() es una función la cual generará 2 números aleatorios del 1 al 8: "num1" y "num2", los cuales se obtienen utilizando la función random() de la librería Math, la cual genera un número del 0 al 1 sin contar el 1. después, dicho número generado se multiplicará por 8, y ya que la función random() nunca llegará a 1, al multiplicarlo por 8 es imposible que el resultado sea un número igual o mayor a 8, así que después de esto se le suma 1 al número multiplicado. Al final, se aplica el método Math.floor() para remover los decimales del número aleatorio.

const num1 = Math.floor(Math.random() * 8 + 1);
let num2 = Math.floor(Math.random() * 8 + 1);

Para evitar que "num1" y "num2" sean iguales, se aplica un ciclo while que se ejecutará mientras ambos números sean iguales, el cual ejecutará el mismo paso para obtener un número aleatorio para "num2", esto para evitar que ambos zombies aparezcan en la misma ventana.

while (num1 === num2) {
	num2 = Math.floor(Math.random() * 8 + 1);
}

Después de esto, para cada número se manda a llamar la función placeZombie() pasando como argumento dicho número aleatorio.

placeZombie(num1);
placeZombie(num2);

El método placeZombie() básicamente recibe como parámetro un valor llamado "number", que es el valor al azar generado del 1 al 8 en la función anterior. Dependiendo del número se le asignará un valor a la variable "col" utilizando un switch, esto para establecer en qué ventana el zombie aparecerá. La siguiente tabla muestrá que número le asignará el switch a "col"

number 	| col
1	| 3
2	| 4
3	| 5
4	| 6
5	| 13
6	| 14
7	| 15
8	| 16

Después de asignar el valor de "col", en el arreglo board, en la fila 0 (que es la única fila donde hay ventanas), columna "col", se asignará la letra "Z". Se hará el log respectivo y se añadirá al arreglo "zombiesLeft" un nuevo objeto de tipo Zombie, como parámetro del constructor una arreglo de la forma [row, col].

board[0][col] = 'Z'; //Setting the zombie in the board
console.log(`Zombie llegó por ventana de la casilla 0, ${col}`);
zombiesLeft.push(new Zombie([0, col]));


La clase Zombie es una clase la cual cuenta con los siguientesparámetros:
position : para saber la posición actual del zombie.
prevPosition : para guardar la posición previa del zombie.

La clase cuenta con el método constructor, el cual recibe como parámetro un arreglo con 2 valores numéricos, indicando la posición inicial del zombie [row, col]. "position" y "prevPosition" se inicializarán con el valor mandado en el argumento del método constructor.
La clase Zombie también cuenta con el método llamado moveZombie(), en el cual se profundizará más adelante.

Después de que el método setBoard() haya terminado de ejecutar setZombies(), se ejecutará el método drawBoard().
El método drawBoard() es el encargado de "dibujar" en la vista la cuadrícula utilizando 2 ciclos anidados para recorrer los elementos de "board". Antes de empezar a iterar el arreglo, en el primer ciclo, con ayuda de jQuery, se obtiene cada elemento "<tr>" llamándolo por el id correspondiente y vaciando los hijos que tenga el componente.

for (let row = 0; row <= 19; row++) {
	$(`#row${row}`).empty();

La siguiente línea en el método es la que contiene el ciclo anidado, en el cual se iterarán las columnas de "board" para determinar con que clase de CSS se integrará el elemento "<td>". Utilizando un switch para evaluar el elemento de "board".

for (let col = 0; col <= 19; col++) {
	let cell;
	switch (board[row][col]) {

La siguiente tabla muestra que clase de CSS se asignará dependiendo del valor iterado de board

Letra 	| Clase
'P'	| wall
'H'	| human
'I'	| infected
'Z'	| zombie
'V'	| window
default	| floor

case 'P': cell = '<td class="wall"></td>';
break;

(Las propiedades de cada clase CSS están detalladas en el archivo index.css)


Después, con ayuda de jQuery, se insertará como hijo del <tr> correspondiente:

$(`#row${row}`).append(cell);

Estos son los pasos que realiza el programa para inicializar el tablero.



Para iterar los pasos del programa se debe de pulsar el botón con la etiqueta iterar, el cual invocará la función iterate().
La función iterate() es la encargada de ejecutar las iteraciones del programa, lo primero que hace es deshabilitar el botón presionado, después de esto, entra a un bucle while el cual seguirá continuando mientras el tamaño del arreglo "humansLeft" sea mayor a 0, en otras palabras, mientras haya humanos en el tablero.

Dentro del bucle, se incrementará el número de la variable "iterations" en 1, después, dentro del bucle while se entra a un bucle for, para ejecutar y dibujar 2 veces el movimiento que realizarán los humanos. El bucle for ejecutará las funciones moveHumans(), checkDistance(), drawBoard() y delay().

El método moveHumans es el encargado de actualizar la posición de los humanos en el tablero, ya sea para moverlos o para retirarlos del tablero (en caso de que hayan llegado a la salida). Lo primero que realizará el método será, con ayuda de ciclos anidados, remover de "board", los elementos que tengan un valor de "H" o de "I", correspondientes a humano e infectado. Se reemplazarán por 0 (que significa casilla vacía) para posteriormente moverlos a nuevas casillas o retirarlos del tablero en caso de que hayan llegado a la salida.

for (let row = 0; row <= 19; row++) {
	for (let col = 0; col <= 19; col++) {
		if (board[row][col] === 'H' || board[row][col] === 'I') {
			board[row][col] = 0;
		}
	}
}

Después de remover de "board" todas las etiquetas de "H" e "I", se utiliza un ciclo forEach() del arreglo "humansLeft", el cual evaluará para cada humano si su parámetro "col" es 19 (que es donde está la salida).
En caso de serlo, se realizará el log correspondiente, después se removerá del arreglo con ayuda del método splice, finalmente a la variable "savedHumans" incrementa su valor en 1.

humansLeft.forEach((human, index) => {
	if (human.col === 19) {
		console.log(`Humano salvado en la casilla ${human.row}, ${human.col}`);

		humansLeft.splice(index, 1);
		savedHumans++;

		document.getElementById('txtSavedHumans').textContent = `Núm. de humanos salvados: ${savedHumans}`
	}
})

Para los humanos restantes en el tablero. Se hara un forEach() de la variable "humansLeft", para determinar hacia donde se debe de mover cada humano "human". Esto se hara utilizando una serie de condicionales:
Si "human.row" es menor a 10, significa que se encuentra en la parte superior del mapa, y debe de bajar para poder llegar a la salida. Sin embargo la única parte por la cual los humanos que están arriba pueden bajar es por el medio. Entonces aplicamos otra condicional: Si "human.col" es menor o igual a 9, significa que el humano se encuentra en el cuadrante superior izquierdo del tablero, y debe dirigirse hacia abajo a la derecha para poder llegar a la salida. Entonces primero se determinará si la casilla que contiene el humano abajo a la derecha del está vacía (que sea igual a 0), si lo está, los valores de row y col del humano se actualizarán a las coordenadas de dicha casilla. En caso de que no, se analizará si la casilla que el humano tiene debajo está vacía (que sea igual a 0), si lo está, "row" y "col" del humano correspondiente se actualizará a la ubicación de esa casilla. En caso de que no, se determinará si la casilla a la derecha del humano está libre, si lo está, los datos de la posición del humano se actualizarán a los datos de dicha casilla. En caso de que no, significa que el humano no se moverá en ese momento. Todas estas condicionales aplican si el humano se encuentra en el cuadrante superior izquierdo del mapa.

Si "human.col" es mayor a 9, significa que el humano está ubicado en el cuadrante superior derecho del mapa, y para aproximarse a la salida, debe acercarse hacia abajo a la izquierda. Se realizan unas condiciones parecidas a las del cuadrante superior izquierdo, pero esta vez tratándose de dirigir hacia la izquierda. Si la casilla que tiene el humano abajo a la izquierda, está vacía, los datos del humano: "row" y "col", se actualizarán a los datos de la casilla. En caso de que no, se evaluará si la casilla de abajo está libre, si lo está, se actualizarán los datos a las coordenadas de esa casilla. Si no, se analiza la casilla de la izquierda, si está libre, sus coordenadas se actualizarán, si no, no se moverá. Esta serie de condiciones son para los humanos que estén en el cuadrante superior derecho del mapa.

Las condiciones vistas son si "human.row" es menor o igual a 10, en otras palabras, si está en la mitad de arriba. En caso de que la condición no se cumpla, significa que está en la mitad de abajo del mapa, entonces el humano deberá llegar a la salida, que se encuentra abajo a la derecha, lo hará con ayuda de las siguientes condiciones:
Si abajo a la derecha de donde está el humano, es una casilla libre, se moverá ahí, si no, buscará moverse a la casilla de abajo en caso de que esté libre, si no, la de la derecha, si no, no actualizará su posición, y por ende, no se moverá.

Después de esta serie de condiciones, en la variable "board", con ayuda de la nueva ubicación del humano, en dicha ubicación se colocará una 'H' o una 'I', en caso de que el humano esté infectado.

Después de terminar la iteración con el humano, el forEach iterará al siguiente, hasta terminar de iterar a todos los humanos restantes.

Para entender como se evalúa las posiciones adyacentes hay que tener en cuenta lo siguiente:

Expresión	| Significado
row - 1		| Una casilla arriba
row + 1		| Una casilla abajo
col - 1		| Una casilla a la izquierda
col + 1		| Una casilla a la derecha

humansLeft.forEach(human => {
	if (human.row <= 10) {
		if (human.col <= 9) {
			if (board[human.row + 1][human.col + 1] === 0) {
				human.row++;
				human.col++;
			} else if (board[human.row + 1][human.col] === 0) {
				human.row++;
			} else if (board[human.row][human.col + 1] === 0) {
			human.col++;
		}
		} else {
			if (board[human.row + 1][human.col - 1] === 0) {
				human.row++;
				human.col--;
			} else if (board[human.row + 1][human.col] === 0) {
				human.row++;
			} else if (board[human.row][human.col - 1] === 0) {
				human.col--;
		}
	}
        } else {
		if (board[human.row + 1][human.col + 1] === 0) {
		human.row++;
		human.col++;
		} else if (board[human.row + 1][human.col] === 0) {
			human.row++;
		} else if (board[human.row][human.col + 1] === 0) {
			human.col++;
		}
	}

	if (human.infected) {
		board[human.row][human.col] = 'I';
	} else {
		board[human.row][human.col] = 'H';
	}
});

Esto es el final del método moveHumans(). Después se ejecuta el método checkDistance().
El método checkDistance() sirve para checar si un humano tiene a su lado a un zombie. Esto se hará utilizando un forEach() del arreglo "humansLeft", para cada humano en la iteración del bucle forEach() se realizará la siguiente condición: Si el humano no está infectado, y a su alrededor hay algún zombie (marcado en el tablero con una letra 'Z', la condición de "human.infected" pasará a ser true, y en el tablero, en la posición donde esté el humano la 'H' se reemplazará por una 'I', y se hará el log correspondiente.

if (!human.infected && (board[human.row - 1][human.col - 1] === 'Z' || board[human.row - 1][human.col] === 'Z' || board[human.row - 1][human.col + 1] === 'Z' || board[human.row][human.col - 1] === 'Z' || board[human.row][human.col + 1] === 'Z' || board[human.row + 1][human.col - 1] === 'Z' || board[human.row + 1][human.col] === 'Z' || board[human.row + 1][human.col] === 'Z')) {
	human.infected = true;
	board[human.row][human.col] = 'I';
	console.log(`Humano infectado en la casilla ${human.row}, ${human.col}`);
}

Después se ejecuta el método drawBoard(), que ya se indicó cómo funciona. Finalmente se ejecutará el método delay(), que simplemente tiene como argumento el número de milisegundos que debe detenerse (en este caso 600), y sirve para pausar el programa ese tiempo, esto para ver de manera visual los cambios que vayan ocurriendo.
Como se dijo anteriormente, los 4 métodos ejecutados previamente están en un bucle for, así que se ejecutarán una vez más.


Después de todos estos pasos, el método iterate() continúa con otro ciclo for, esta vez para iterar 4 veces, en este caso, el movimiento de los zombies. Dentro del ciclo for, se ejecutan los métodos moveZombies(), checkDistance(), drawBoard() y delay().

El método moveZombies(), primeramente, como el método moveHumans(), debemos de quitar de la variable "board" todos los elementos marcados como 'Z' para actualizarlos a las nuevas casillas.

for (let row = 0; row <= 19; row++) {
	for (let col = 0; col <= 19; col++) {
		if (board[row][col] === 'Z') {
			board[row][col] = 0;
		}
	}
}

Después de esto, para establecer la nueva posición de los zombies, se utilizará un forEach() del arreglo "zombiesLeft". Para cada zombie en el arreglo, en una variable se guardará el resultado de la nueva posición, la cual se obtendrá con el método de la clase Zombie, llamado moveZombie().

let newPosition = zombie.moveZombie();

El método moveZombie() es un método para mover al zombie a una casilla adyacente aleatoria. Primero se genera un número aleatorio "num" del 1 al 8, para ver a que casilla se moverá, se puede entender hacia dónde con ayuda de la siguiente tabla

num	| Expresión/Valor				| Significado
1	| [this.psoition[0] - 1, this.position[1] - 1]	| Una casilla arriba a la izquierda
2	| [this.psoition[0] - 1, this.position[1]]	| Una casilla arriba
3	| [this.psoition[0] - 1, this.position[1] + 1]	| Una casilla arriba a la derecha
4	| [this.psoition[0], this.position[1] - 1]	| Una casilla a la izquierda
5	| [this.psoition[0], this.position[1] + 1]	| Una casilla a la derecha
6	| [this.psoition[0] + 1, this.position[1] - 1]	| Una casilla abajo a la izquierda
7	| [this.psoition[0] + 1, this.position[1]]	| Una casilla abajo
default	| [this.psoition[0] + 1, this.position[1] + 1]	| Una casilla abajo a la derecha

La expresión anterior se mete en un do while, esto para reasignar la posición en caso de que la nueva posición sea igual a "prevPosition", para evitar que vuelva a la casilla anterior, o que las coordenadas sean menor o igual a 0 o mayor o igual a 19, para evitar que se salga del tablero.

moveZombie = () => {
	let newPosition;

	do {
		const num = Math.floor(Math.random() * 8 + 1);

		switch(num){
			case 1: newPosition = [this.position[0] - 1, this.position[1] - 1];
			break;
			case 2: newPosition = [this.position[0] - 1, this.position[1]];
			break;
			case 3: newPosition = [this.position[0] - 1, this.position[1] + 1];
			break;
			case 4: newPosition = [this.position[0], this.position[1] - 1];
			break;
			case 5: newPosition = [this.position[0], this.position[1] + 1];
			break;
			case 6: newPosition = [this.position[0] + 1, this.position[1] - 1];
			break;
			case 7: newPosition = [this.position[0] + 1, this.position[1]];
			break;
			default: newPosition = [this.position[0] + 1, this.position[1] + 1];
			break;
		}
	} while (newPosition === this.prevPosition || newPosition[0] <= 0 || newPosition[1] <= 0 || newPosition[1] >= 19);

        return newPosition;
}

Después de que el método mencionado nos haya devuelto las nuevas coordenadas, hay que analizar si las coordenadas de dicha casilla están libres, así que se ejecutará un bucle while el cual terminará hasta que la variable "board" en la posición de las coordenadas sea igual a 0 (las coordenadas de la posición en el tablero esten libres).

while (board[newPosition[0]][newPosition[1]] !== 0) {
	newPosition = zombie.moveZombie();
}

Después de este proceso, las coordenadas del zombie se actualizarán, primero hay que actualizar las coordenadas previas a las coordenadas actuales, después la posición actual a la nueva posición, después hay que marcar en el tablero con una 'Z' la nueva posición del zombie.

zombie.prevPosition = zombie.position;
zombie.position = newPosition;
board[newPosition[0]][newPosition[1]] = 'Z';

Todo esto se realiza para cada zombie en el arreglo "zombiesLeft". Después de que la función moveZombies() se termina de ejecutar, se manda a llamar la función checkDistance(), el método drawBoard() y el delay().

Después de que hayan pasado 4 iteraciones de estos métodos para el movimiento de los zombies, se ejecuta la función evaluateLife().
El método evaluateLife() sirve para restar tiempos antes de volver zombies a los humanos infectados. Utilizando un forEach() para el arreglo "humansLeft", en cada humano se evalúa el método restLife() de la clase "Human", si el valor que devuelve es igual a 0, se convertirá en un zombie. Para que el método devuelva un número funciona de la siguiente manera.
El método restLife() verifica si la propiedad infected del humano es true, en otras palabras, si está infectado. En caso de estarlo, la variable "timeToBecomeZombie" de la misma clase reducirá su valor en uno (recordemos que para cada humano el valor de esta variable se inicializa en 3). Finalmente devolverá el valor de "timeToBecomeZombie".

restLife = () => {
	if(this.infected){
	this.timeToBecomeZombie--;
	}
	return this.timeToBecomeZombie;
}

Después de devolver el valor por el método de la clase, se determinará si es igual a 0, en caso de ser así. La posición que tenga el humano en la variable "board" se cambiará por una 'Z', indicando que la casilla se reemplazará por un zombie, después de eso se añade un nuevo zombie al arreglo de "zombiesLeft", pasando como parámetros la ubicación del humano convertido. Finalmente se retira del arreglo "humansLeft" el humano convertido.

humansLeft.forEach((human, index) => {
	if (human.restLife() === 0) {
		board[human.row][human.col] = 'Z';
		zombiesLeft.push(new Zombie([human.row, human.col]));

		humansLeft.splice(index, 1);

		document.getElementById('txtHumansLeft').textContent = `Núm. de humanos en la oficina: ${humansLeft.length}`
		document.getElementById('txtNumZombies').textContent = `Núm. de zombies: ${zombiesLeft.length}`;
        }
});


Al final de la iteración, después de ejecutar la función evaluateLife(), en la variable fileData, se concatenará la información solicitada en el ejercicio para guardarla en un archivo txt.

fileData += (`${iterations} | ${zombiesLeft.length} | ${humansLeft.length} | ${savedHumans}\n`);


Después de esto, si "humansLeft.length" es mayor a 0, el bucle while ejecutará las instrucciones previas del método iterar(), hasta que no queden humanos en el tablero.

Cuando no haya más humanos simplemente se llamará a la función generateFile(), la cual simplemente generará el archivo txt para visualizar.