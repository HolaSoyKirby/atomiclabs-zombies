class Zombie {
    position;   //The current position of the zombie
    prevPosition;   //The previous position of the zombie

    /**
     * Zombie's Contructor method
     * 
     * @param {[Number]} position : The position in which the zombie will appear: [row, col]
     */
    constructor(position) {
        this.position = position;
        this.prevPosition = position;
    }

    /**
     * Method to move the zombie to another random cell
     * 
     * @returns [Number] : The new position of the zombie [row, col]
     */
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

        console.log("new", newPosition, 'prev', this.prevPosition);
        return newPosition;
    }
}