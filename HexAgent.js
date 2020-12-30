const Agent = require('ai-agents').Agent;

class HexAgent extends Agent {
    constructor(value) {
        super(value);
    }
    
    /**
     * return a new move. The move is an array of two integers, representing the
     * row and column number of the hex to play. If the given movement is not valid,
     * the Hex controller will perform a random valid movement for the player
     * Example: [1, 1]
     */

     
    send() {
        let board = this.perception.map(arr => arr.slice());
        let size = board.length;
        var player = this.id;

        //console.log(board === this.perception);
        // true --> it's pointing to the same memory space
        
        let available = getEmptyHex(board);
        let nTurn = size * size - available.length;

        if (nTurn == 0) { // First move
           var movement = [Math.floor(size / 2), Math.floor(size / 2)-1];
            //console.log(movement);
            //console.log("VALE furrini");

            
            var arr = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 1, 1, 2, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
            var changua = dijkstra([0, 2], 1, 5, arr);
            //console.log(changua);

            return movement;
        }/* else if(nTurn == 1){
            var movement = [Math.floor(size / 2), Math.floor(size / 2)+1];
            //console.log(movement);
            return movement;
        } else if(nTurn == 2){
            var movement = [Math.floor(size / 2), Math.floor(size / 2)];
            console.log(movement);
            return movement;
        }*/else {
            var board1 = [...board];
            return abMiniMax([],[new Node(0,-1, [2,3], board1,0,player,0)], player);
        }
        
        
    }

}

module.exports = HexAgent;

/**
 * Return an array containing the id of the empty hex in the board
 * id = row * size + col;
 * @param {Matrix} board 
 */
function getEmptyHex(board) {
    let result = [];
    let size = board.length;
    for (let k = 0; k < size; k++) {
        for (let j = 0; j < size; j++) {
            if (board[k][j] === 0) {
                result.push(k * size + j);
            }
        }
    }
    return result;
}

function isPositionValid(position, size){

    var row = position[0];
    var col = position[1];

    if(row < 0 || row >= size || col < 0 || col >= size){
        return false;
    } else{
        return true;
    }
}

// Dada una posición, devuelve sus vecinos y cuánto cuesta llegar a cada uno
// Si el vecino ha sido tomado por el jugador, cuesta 0
// Si el vecino no ha sido tomado por el jugador, cuesta 1
// Si el vecino ha sido tomado por el enemigo, es inalcanzable (Infinity)
function getNeighbours(position, size, player, board){

    var row = position[0];
    var col = position[1];
    var neighbour = [];
    var result = [];
    var neighbourCost;
    var neighbourPlusCost=[];

    neighbour = [row - 1, col, getId(row - 1, col, size)];
    if(isPositionValid(neighbour, size)){
        if(board[row-1][col] == 0){
            neighbourCost = 1;
        } else if(board[row-1][col] == player){
            neighbourCost = 0;
        } else{
            neighbourCost = 1000000;
        }
        neighbourPlusCost=[neighbour, neighbourCost];

        result.push(neighbourPlusCost);
    }

    neighbour = [row - 1, col + 1, getId(row - 1, col + 1, size)];
    if(isPositionValid(neighbour, size)){
        if(board[row-1][col+1] == 0){
            neighbourCost = 1;
        } else if(board[row-1][col+1] == player){
            neighbourCost = 0;
        } else{
            neighbourCost = 1000000;
        }
        neighbourPlusCost=[neighbour, neighbourCost];

        result.push(neighbourPlusCost);
    }

    neighbour = [row, col - 1, getId(row, col - 1, size)];
    if(isPositionValid(neighbour, size)){
        if(board[row][col-1] == 0){
            neighbourCost = 1;
        } else if(board[row][col-1] == player){
            neighbourCost = 0;
        } else{
            neighbourCost = 1000000;
        }
        neighbourPlusCost=[neighbour, neighbourCost];

        result.push(neighbourPlusCost);
    }

    neighbour = [row, col + 1, getId(row, col + 1, size)];
    if(isPositionValid(neighbour, size)){
        if(board[row][col+1] == 0){
            neighbourCost = 1;
        } else if(board[row][col+1] == player){
            neighbourCost = 0;
        } else{
            neighbourCost = 1000000;
        }
        neighbourPlusCost=[neighbour, neighbourCost];

        result.push(neighbourPlusCost);
    }

    neighbour = [row + 1, col - 1, getId(row + 1, col - 1, size)];
    if(isPositionValid(neighbour, size)){
        if(board[row+1][col-1] == 0){
            neighbourCost = 1;
        } else if(board[row+1][col-1] == player){
            neighbourCost = 0;
        } else{
            neighbourCost = 1000000;
        }
        neighbourPlusCost=[neighbour, neighbourCost];

        result.push(neighbourPlusCost);
    }

    neighbour = [row + 1, col, getId(row + 1, col, size)];
    if(isPositionValid(neighbour, size)){
        if(board[row+1][col] == 0){
            neighbourCost = 1;
        } else if(board[row+1][col] == player){
            neighbourCost = 0;
        } else{
            neighbourCost = 1000000;
        }
        neighbourPlusCost=[neighbour, neighbourCost];

        result.push(neighbourPlusCost);
    }

    return result;
}

function getPositionValue(position, board){
    return board[position[0]][position[1]];
}

function getId(row, col, size){
    return row*size + col;
}

// Cambiar el actual costo de llegar a una cierta posición
function changeCost(positions, id, newCost){
    var length = positions.length;
    for(var i = 0; i<length; i++){
        if(positions[i][2]==id){
            positions[i][3] = newCost;
            break;
        }
    }
}

// Remover posiciones de ARR
function eraseP(ids, arr){
    for(var i=0; i<ids.length; i++){
        arr.splice(ids[i], 1);
        for(var j = i+1; j<ids.length; j++){
            ids[j]--;
        }
    }
}

// Remover duplicados ya visitados de la lista argumento
function removeDuplicates(visited, arr){
    var ids = [];

    for(var i=0; i<visited.length; i++){
        for(var j=0; j<arr.length; j++){
            if(visited[i][2]==arr[j][0][2]){
                ids.push(j);
            }
        }
    }
    ids.sort();
    eraseP(ids, arr);
}

function dijkstra(startingPosition, player, size, board){

    // Arreglos para ejecutar Dijkstra
    var table = [];
    var graph = [];
    var visited = [];
    var unvisited = [];

    // auxPosition: para gaurdar en la tabla de dijkstra
    // auxHolder: para consultar vecinos y sus costos
    // auxGraph: para guardar en el grafo
    var auxPosition = [];
    var auxHolder = [];
    var auxGraph = [];
    for(var i = 0; i < size; i++){
        for(var j = 0; j < size; j++){
            // [fila, columna, id, costo, filaOrigen, colOrigen, idOrigen]
            auxPosition = [i, j, getId(i, j, size), 1000000, 0, 0, 0];
            table.push(auxPosition);
            unvisited.push(auxPosition);

            auxHolder = [i, j];
            auxGraph = getNeighbours(auxHolder, size, player, board);
            graph.push(auxGraph);
        }
    }
    // Si la posicion inicial pertenece al jugador, no tiene costo.
    // Cuesta 1 si no ha sido tomada.
    
    var costoPuntoInicial=0;
    if(board[startingPosition[0]][startingPosition[1]] == 0){
        costoPuntoInicial=1;
    } else if(board[startingPosition[0]][startingPosition[1]] == player){
        costoPuntoInicial=0;
    } else{
        costoPuntoInicial= 1000000;
    }

    table[getId(startingPosition[0], startingPosition[1], size)][3] = costoPuntoInicial;
    unvisited[getId(startingPosition[0], startingPosition[1], size)][3] = costoPuntoInicial;
    // Ordenar los nodos no visitados, de menor a mayor, quedando al final la posInicial
    unvisited.sort((pos1, pos2) => pos2[3] - pos1[3]);
    // It's magic
    var currentPosition=[];
    var positionsToVisit = unvisited.length;
    var currentNeighBours=[];
    var numberOfNeighbours;
    
    for(var i = 0; i < positionsToVisit; i++){
        // Obtener los vecinos de la posición de menor costo no visitada
        currentPosition = unvisited.pop();
        currentNeighBours = getNeighbours(currentPosition, size, player, board);
        // Eliminar de los vecinos a verificar aquellos que ya se visitaron                        CHECKPOINT*************
        /*if(currentPosition[2]==8){
            console.log("VISITADOS :");
            console.log(visited);
            console.log(visited.length);
            console.log("LOOK :");
            console.log(currentNeighBours.length);
            console.log(currentNeighBours[0]);
            console.log(currentNeighBours[1]);
            console.log(currentNeighBours[2]);
            console.log(currentNeighBours[3]);
            console.log(currentNeighBours[4]);
            console.log(currentNeighBours[5]);
        }*/
        removeDuplicates(visited, currentNeighBours);
        // Número de vecinos restantes
        numberOfNeighbours = currentNeighBours.length;
        // Revisar
        var currentCost = 0;
        /*if(currentPosition[2]==8){
            console.log("VISITADOS :");
            console.log(visited);
            console.log(visited.length);
            console.log("LOOK :");
            console.log(currentNeighBours.length);
            console.log(currentNeighBours[0]);
            console.log(currentNeighBours[1]);
            console.log(currentNeighBours[2]);
            console.log(currentNeighBours[3]);
            console.log(currentNeighBours[4]);
            console.log(currentNeighBours[5]);
        }*/
        for(var j=0; j<numberOfNeighbours; j++){
            // Costo de llegar al vecino desde la pos actual + lo que costó llegar a la actual
            currentCost = currentNeighBours[j][1] + table[currentPosition[2]][3];
            // Si el costo es menor al de la tabla, se cambia el costo en la tabla
            // y se cambia el orígen que lo produjo
            if(currentCost<table[currentNeighBours[j][0][2]][3]){
                table[currentNeighBours[j][0][2]][3]=currentCost;
                table[currentNeighBours[j][0][2]][4]=currentPosition[0];
                table[currentNeighBours[j][0][2]][5]=currentPosition[1];
                table[currentNeighBours[j][0][2]][6]=currentPosition[2];
                // además, se debe actualizar en la lista de posiciones no visitadas
                // el nuevo costo mínimo para llegar a ella
                changeCost(unvisited, currentNeighBours[j][0][2], currentCost);
            }
        }

        // Ahora se debe ordenar la lista de posiciones no visitadas
        unvisited.sort((pos1, pos2) => pos2[3] - pos1[3]);
        
        // Añadir el vecino evaluado a la lista de posiciones evaluados
        visited.push(currentPosition);
    }
    /*console.log("LA TABLA: ",  table);
    console.log(visited);*/

    /*console.log("DIJSKTRA");
    console.log(table);*/

    return table;
}

// Calcular la utilidad de un nodo para un determinado jugador
function getNodeUtility(node, player){
    //console.log("BOARD DEL NODO : ", node.getBoard());
    var size = node.getBoard().length;
    //console.log("TAMAÑ0 = ", size);
    var refTable = [];

    var minPathPlayer1 = Infinity;
    var minPathPlayer2 = Infinity;

    var auxMinPath;
    var auxMinPathArr = [];
    // Cálculo del costo del camino más corto para el jugador 1
    // teniendo en cuenta las posiciones de la fila superior (hacia la inferior)
    for(var i=0; i < size; i++){
        auxMinPathArr.length = 0;
        // Cálculo de tabla de dijkstra para el jugador 1
        refTable = dijkstra([i, 0], 1, size, node.getBoard());
        // Costo mínimo para llegar desde la columna izquierda a la derecha
        // teniendo en cuenta cada posición de ambas
        for(var j = 0; j < size; j++){
            auxMinPathArr.push(refTable[getId(j, size-1, size)][3]);
        }
        //console.log("AuxMinPathArr-->", auxMinPathArr);
        auxMinPath = Math.min(...auxMinPathArr);
        //console.log("AuxMinPath-->", auxMinPath);
        // el costo mínimo de camino para el jugador se debe actualizar
        if(auxMinPath < minPathPlayer1){
            minPathPlayer1 = auxMinPath;
        }
    }

    // Cálculo del costo del camino más corto para el jugador 2
    // teniendo en cuenta las posiciones de la columna izquierda (hacia la derecha)
    for(var i=0; i < size; i++){
        auxMinPathArr.length = 0;
        // Cálculo de tabla de dijkstra para el jugador 2
        refTable = dijkstra([0, i], 2, size, node.getBoard());
        // Costo mínimo para llegar desde la fila superior a la fila inferior
        // teniendo en cuenta cada posición de ambas
        for(var j = 0; j < size; j++){
            auxMinPathArr.push(refTable[getId(size-1, j, size)][3]);
        }
        auxMinPath = Math.min(...auxMinPathArr);
        // el costo mínimo de camino para el jugador se debe actualizar
        if(auxMinPath < minPathPlayer2){
            minPathPlayer2 = auxMinPath;
        }
    }

   // console.log("CAMINO MAS CORTO JUGADOR 1 = ", minPathPlayer1);
    //console.log("CAMINO MAS CORTO JUGADOR 2 = ", minPathPlayer2);

    // Devolver la utilidad del nodo para un jugador específico
    var utility;
    var isFinished = false;

    if(minPathPlayer1 == 0 || minPathPlayer2 == 0){
        isFinished = true;
    }

    //console.log("TERMINADO: " + isFinished);

    if(player=="1"){
        utility = minPathPlayer2 - minPathPlayer1;
    } else{
        utility = minPathPlayer1 - minPathPlayer2;
    }

    return [utility, isFinished];
    
}

// Clase para representar un árbol
class Node{
    // 
    constructor(depth, parent, generatingMovemement, board, profit, player, offspring){
        this.depth = depth;
        this.parent = parent;
        this.generatingMovemement =  generatingMovemement;
        this.board = board;
        this.profit = profit;
        //this.children = this.children;
        this.player = player;
        this.offspring = offspring;
    }

    // methods
    getDepth(){
        return this.depth;
    }
    setDepth(newDepth){
        this.depth = newDepth;
    }

    getParent(){
        return this.parent;
    }
    setParent(newParent){
        this.parent = newParent;
    }

    getGeneratingMovemement(){
        return this.generatingMovemement;
    }
    setGeneratingMovemement(newGeneratingMovemement){
        this.generatingMovemement = newGeneratingMovemement;
    }

    getBoard(){
        return this.board;
    }
    setBoard(newBoard){
        this.board = newBoard;
    }

    getProfit(){
        return this.profit;
    }
    setProfit(newProfit){
        this.profit = newProfit;
    }

    getPlayer(){
        return this.player;
    }
    setPlayer(newPlayer){
        this.player = newPlayer;
    }

    getOffspring(){
        return this.offspring;
    }

    setOffspring(newOffspring){
        this.offspring = newOffspring;
    }

    /*getChildren(){
        return this.children;
    }
    setChildren(newChildren){
        this.children = newChildren;
    }*/
}

// Crear los hijos de un nodo
/*function generateChildren(node, size){
    // Arreglo para guardar los hijos
    var resultChildren = [];

    // Obtener los posibles movimientos
    var getAvailableMovements = getAvailableMovements(node.getBoard(), size);

}*/

// Generar los movimientos disponibles en un tablero
function getAvailableMovements(board){
    var result = [];
    var size = board.length;

    for(var i = 0; i < size; i++){
        for(var j = 0; j < size; j++){
            if(board[i][j] == 0){
                result.push([i,j]);
            }
        }
    }

    return result;
}

// Generar un nuevo tablero de acuerdo a un movimiento
function generateBoard(board, movement, player){
    var result = board.map(arr => arr.slice());;
    result[movement[0]][movement[1]] = player;
    return result;
}

//Cambia el jugador en cada turno
function changePlayer(player){
    if(player == "1"){
        return "2";
    }else{
        return "1";
    }
}

//Indica si dos tableros son iguales
function repeatBoard(board1, board2){

    var size = board1.length;
    for(var i=0; i<size; i++){
        for(var j=0; j<size; j++){
            if(board1[i][j] != board2[i][j]){
                return false;
            }
        }
    }
    return true;
}

//Indica si un nodo ya está dentro de un arreglo de nodos
function repeatNode(node, nodes){
    for(var i=0; i<nodes.length; i++){
        if(repeatBoard(node.getBoard(),nodes[i].getBoard())){
            return true;
        }      
    }
    return false;
}

//Elimina los valores infinitos de un arreglo
/*function removeInfinity(values){
    for(var i=0; i<values.length; i++){
        if(values[i] == Infinity){
            values.splice(i,1);
            i--;
        }
    }
}*/

//Retorna la mejor utilidad
function max(values){
    var max = [];
    if(values.length == 1){
        return values[0].getProfit();
    }else{
        max = values[0].getProfit();
        for(var i=1; i<values.length; i++){
            if(values[i].getProfit()[0] > max[0]){
                max = values[i].getProfit();
            }else if(values[i].getProfit()[0] == max[0]){
                if(values[i].getProfit()[1]){
                    max = values[i].getProfit();
                }
            }
        }
        return max;
    }    
}

//Retorna la peor utilidad
function min(values){
    var min = [];
    if(values.length == 1){
        return values[0].getProfit();
    }else{
        min = values[0].getProfit();
        for(var i=1; i<values.length; i++){
            if(values[i].getProfit()[0] < min[0]){
                min = values[i].getProfit();
            }else if(values[i].getProfit()[0] == min[0]){
                if(!values[i].getProfit()[1]){
                    min = values[i].getProfit();
                }
            }
        }
        return min;
    }    
}

//Calcula los valores en el resto de nodos del árbol
function calculateProfit(nodes){
    var pos = nodes.length-1;
    var aux;
    var values = [];
    while(pos>0){
        values.push(nodes[pos]);
        aux = pos-1;
        while(values[values.length-1].getParent() == nodes[aux].getParent()){
            values.push(nodes[aux]);
            aux--;
        }
        if(nodes[values[values.length-1].getParent()].getPlayer() == nodes[0].getPlayer()){
            nodes[values[values.length-1].getParent()].setProfit(max(values));
            values = [];
        }else{
            nodes[values[values.length-1].getParent()].setProfit(min(values));
            values = [];
        }        
        pos = aux;
    }
    return nodes[0].getProfit();

    /*var node = nodes[pos];
    var values = [];
    // ACÁ ACÁ
    if(node.getDepth() == 3 || node.getProfit()[1] == true){
        return node.getProfit();
    } else{
        for(var i=pos+1; i<nodes.length; i++){
            if(nodes[i].getParent() == pos){
                values.push(calculateProfit(i,nodes));
            }
        }
        if(node.getPlayer() == nodes[0].getPlayer()){
           // removeInfinity(values);
            node.setProfit(max(values));
            return node.getProfit();
        }else{
            node.setProfit(min(values));
            return node.getProfit();
        }
    }*/
}

//Encuentra el movimiento óptimo luego de aplicar la búsqueda minimax:
function findMovement(profit, nodes){
    //console.log("IMO ", nodes);
    var min = 0;
    for(var i=0; i<nodes.length; i++){
        if(nodes[i].getDepth() == 1 && nodes[i].getProfit()[0] == profit[0] && nodes[i].getProfit()[1] == profit[1]){
            if(nodes[i].getOffspring() < nodes[min].getOffspring()){
                min = i;
            }    
        }
    }
    return nodes[min].getGeneratingMovemement();
    //return[0,1];
}

//Incrementa la descendencia de los nodos de un arreglo
function incrementNodesOffspring(nodes){
    var depth = 1;
    var pos = nodes.length-1;
    var aux;
    while(pos > -1){
        aux = nodes[pos].getOffspring() + 1;
        if(aux<=depth){
            nodes[pos].setOffspring(aux);
        }
        pos = nodes[pos].getParent();
        depth++;
    }
}

//Aplica búsqueda minimax y retorna la jugada óptima
function abMiniMax(visitedNodes, nodesToVisit, player){
    var children;
    var currentNode;
    var newNode;
    var childrenMoves = [];
    // var para mirar el while    
    while(nodesToVisit.length != 0){
        currentNode = nodesToVisit[0];
        //console.log("PP = ", currentNode.getProfit());
        nodesToVisit.splice(0, 1);
        currentNode.setProfit(getNodeUtility(currentNode, player));
        visitedNodes.push(currentNode);
        // ACÁ ACÁ
        if(currentNode.getProfit()[1] == false && currentNode.getDepth() < 3){
            childrenMoves = getAvailableMovements(currentNode.getBoard());
            children = false;
            for(var i = 0; i<childrenMoves.length; i++){
                newNode = new Node(currentNode.getDepth()+1,visitedNodes.length-1,
                                            childrenMoves[i],generateBoard(currentNode.getBoard(),
                                            childrenMoves[i],currentNode.getPlayer()),0,
                                            changePlayer(currentNode.getPlayer()),0);
                if(!repeatNode(newNode,visitedNodes)){
                    nodesToVisit.push(newNode);
                    children = true;
                    //console.log("FUCHINI CURRO");
                }                
            }
            if(children){
                incrementNodesOffspring(visitedNodes);
            }
            //console.log("JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ");
        }
    }
    //console.log("GOTCHA2");
    //console.log("VISITED NODES = ");
    //console.log(visitedNodes);
    var profit = calculateProfit(visitedNodes);
   // console.log(visitedNodes);
    //console.log("PROFIT = " + profit);
    //console.log("GOTCHA3");
    
    //console.log(movement);
    return findMovement(profit, visitedNodes);
}