(function () {
    window.onload = function () {
        console.log("hey");

        // DOM variables


        let gameCanvas = document.createElement("canvas");
        let gameContext = gameCanvas.getContext("2d");
        let gameDiv = document.querySelector("#gameAreah");
        let dispGameButton = document.querySelector("#dispNewGeneration");
        let calcGenButton = document.querySelector("#calcNewGeneration");
        let promiseButton = document.querySelector("#promiseButton");

        // setting up the game board

        let widthNoCells =250;
        let heightNoCells = 250;

        let cellWidth = 2;
        let cellHeight = 2;

        gameCanvas.width = widthNoCells * cellWidth;
        gameCanvas.height = heightNoCells * cellHeight;
        gameDiv.appendChild(gameCanvas);


        let currentGeneration = randomGame();

        tick(); //call main loop

        //functions
        function tick() {
            fillGame(currentGeneration);
            currentGeneration = calcNextGeneration(currentGeneration);
            requestAnimationFrame(tick);
        }

      



        dispGameButton.addEventListener("click", function(){
            fillGame(currentGeneration);
        });

        calcGenButton.addEventListener("click", function(){
            currentGeneration = calcNextGeneration(currentGeneration);
        });


        
        function randomGame(){
            result = []
            for(let i = 0; i < heightNoCells; i++){
                result.push([]);
                for(let j = 0; j < widthNoCells; j++){
                    result[i].push(Math.random() > 0.4);
                }
            }
            return result;
        }

        function setCell(neighbours, liveBool){
            // if current cell is living it will be living in
            // the next generation only if it has 2 or 3 neighbours
            // otherwise it will be dead in the next generation
            if(liveBool == true){
                if( (neighbours == 2) || (neighbours == 3) ){
                    return true;
                }
                else{
                    return false;
                }
            }
            else if(neighbours == 3){
                // however if the current cell is dead
                // it will be living in the next generation
                // if it has exactly 3 neighbours
                // otherwise it will be dead in the next generation
                return true;
            }
            else{
                return false;
            }
        }

        function calcNextGeneration(cellMat){
            // for readability
            // iMax/jMax is the max index for cellMat
            // ie no row past cellMat[iMax]
            // and now column element past cellMat[i][jMax]
            let iMax = heightNoCells-1;
            let jMax = widthNoCells-1;

            let neighbourCount = 0;


            // next generation
            let result = []
            let resultNumber = []
            
            // handle the west edge first
            // pushing a new row as we go
            

            // NW Corner
            result.push([]) // first row (exterior row)
            resultNumber.push([]);
            // note that cellMat should be an array of boollean arrays
            // true / false add up nicely true -> 1 , false -> 0
            neighbourCount = cellMat[0][1] + cellMat[1][1] + cellMat[1][0];
            result[0].push(setCell(neighbourCount, cellMat[0][0]));
            resultNumber[0].push(neighbourCount);

            // West interior Edge   (not the corners)
            // push interiour rows at the same time
            for(let i = 1; i < iMax; i++){
                // new row as we go
                result.push([]);
                resultNumber.push([]);
                // reset neighbourCount
                neighbourCount = 0;
                // East neighbours
                neighbourCount = cellMat[i-1][1] + cellMat[i][1] + cellMat[i+1][1];
                // north and south neighbours
                neighbourCount = neighbourCount + cellMat[i-1][0] + cellMat[i+1][0];
                // push the result into the new row
                result[i].push(setCell(neighbourCount,cellMat[i][0]));
                resultNumber[i].push(neighbourCount)
            }

            // SW Corner
            result.push([]) // last row to push
            resultNumber.push([])
            neighbourCount = cellMat[iMax-1][0] + cellMat[iMax-1][1] + cellMat[iMax][1];
            result[iMax].push(setCell(neighbourCount, cellMat[iMax][0]));
            resultNumber[iMax].push(neighbourCount)

            // North interior Edge (not the corners)
            // no need to push a new row to result
            for(let j = 1; j < jMax; j++){
                // reset neighbourCount
                neighbourCount = 0;
                // South neighbours
                neighbourCount = cellMat[1][j-1] + cellMat[1][j] + cellMat[1][j+1];
                // east and west neighbours
                neighbourCount = neighbourCount + cellMat[0][j-1] + cellMat[0][j+1];
                // push the result into row
                result[0].push(setCell(neighbourCount,cellMat[0][j]));
                resultNumber[0].push(neighbourCount)
            }

            // interior cells
            for(let i = 1; i < iMax; i++){
                for(let j = 1; j < jMax; j++){
                    // reset neighbourCount
                    neighbourCount = 0;
                    // all three north neighbours
                    neighbourCount = cellMat[i-1][j-1] + cellMat[i-1][j] + cellMat[i-1][j+1];
                    // all three south neightbours
                    neighbourCount = neighbourCount + cellMat[i+1][j-1] + cellMat[i+1][j] + cellMat[i+1][j+1];
                    // the remaining two east and west
                    neighbourCount = neighbourCount + cellMat[i][j-1] + cellMat[i][j+1];
                    // push the result into row
                    // console.log(neighbourCount);
                    result[i].push(setCell(neighbourCount,cellMat[i][j]));
                    resultNumber[i].push(neighbourCount);
                }
            }

            // South interior Edge (not the corners)
            for(let j = 1; j < jMax; j++){
                // reset neighbourCount
                neighbourCount = 0;
                // North neighbours
                neighbourCount = cellMat[iMax-1][j-1] + cellMat[iMax-1][j] + cellMat[iMax-1][j+1];
                // east and west neighbours
                neighbourCount = neighbourCount + cellMat[iMax][j-1] + cellMat[iMax][j+1];
                // push the result into row
                result[iMax].push(setCell(neighbourCount,cellMat[0][j]));
                resultNumber[iMax].push(neighbourCount);
            }


            // now that everything has been filled
            // we can fill the east edge

            // NE Corner
            neighbourCount = cellMat[0][jMax-1] + cellMat[1][jMax-1] + cellMat[1][jMax];
            result[0].push(setCell(neighbourCount, cellMat[0][jMax]));
            resultNumber[0].push(neighbourCount);

            // East interior edge (no corners)
            for(let i = 1; i < iMax; i++){
                // reset neighbourCount
                neighbourCount = 0;
                // West neighbours
                neighbourCount = cellMat[i-1][jMax-1] + cellMat[i][jMax-1] + cellMat[i+1][jMax-1];
                // north and south neighbours
                neighbourCount = neighbourCount + cellMat[i-1][jMax] + cellMat[i+1][jMax];
                // push the result into the new row
                result[i].push(setCell(neighbourCount,cellMat[i][jMax]));
                resultNumber[i].push(neighbourCount)
            }


            // SE Corner
            neighbourCount = cellMat[iMax-1][jMax-1] + cellMat[iMax-1][jMax] + cellMat[iMax][jMax-1];
            result[iMax].push(setCell(neighbourCount, cellMat[iMax][jMax]));
            resultNumber[iMax].push(neighbourCount);

            // console.log(resultNumber);
            return result;
        }


        function fillGame(cellMat){
            gameContext.fillStyle = "black";
            gameContext.clearRect(0,0,widthNoCells*cellWidth,heightNoCells*cellHeight);
            // i/j used same as in a mnMatrix mRows/nColumns
            // i for row
            // j for column
            for(let i = 0; i < heightNoCells; i++){
                for(let j = 0; j < widthNoCells; j++){
                    //gameContext.fillStyle = cellMat[i][j] ? "black" : "white";
                    // note that fillRect follows ~Cartesian(x,y)
                    // where (0,0) upper left
                    // and (max,max) lower right
                    if(cellMat[i][j]){
                        gameContext.fillRect(j*cellWidth,i*cellHeight,cellWidth,cellHeight);
                    }
                    
                }
            }
            // gameContext.fill();
        }

    };
})();