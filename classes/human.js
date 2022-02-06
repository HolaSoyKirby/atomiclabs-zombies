class Human {
    row;    //The row in which the human is in
    col;    //The column in which the human is in
    infected = false;   //To check if the human has been infected
    timeToBecomeZombie = 3; //Number of iterations that has to pass if the human is infected

    /**
     * Human's Constructor method
     * 
     * @param {Number} row : The row in which the human will appear
     * @param {Number} col : The column in which the human will appear
     */
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }

    /**
     * Method to rest the number of iterations if the human is infected
     */
    restLife = () => {
        if(this.infected){
        this.timeToBecomeZombie--;
        }
        return this.timeToBecomeZombie;
    }
}