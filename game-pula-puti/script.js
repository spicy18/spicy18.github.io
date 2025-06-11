

    document.addEventListener('DOMContentLoaded', (e) => {

        if(!localStorage.getItem('PPG-initial-money')) {
            localStorage.setItem('PPG-initial-money', 1000);
        }

        if(!localStorage.getItem('PPG-bet-multiplier')) {
            localStorage.setItem('PPG-bet-multiplier', '1');
        }

        if(!localStorage.getItem('PPG-selected-color')) {
            localStorage.setItem('PPG-selected-color', 'pink');
        }


        document.getElementById('lose-streaks').value = localStorage.getItem('PPG-lose-streaks');


        const colorSelect = document.getElementById('color-select');
        //colorSelect.value = localStorage.getItem('PPG-selected-color');
        changeSelectColor(colorSelect);

        const initialMoney = document.getElementById('initial-money');
        const betMultiplier = document.getElementById('bet-multiplier');
        initialMoney.addEventListener('focus', (e) => {
            e.target.select();
        });
        betMultiplier.addEventListener('focus', (e) => {
            e.target.select();
        });
        initialMoney.value = localStorage.getItem('PPG-initial-money');
        betMultiplier.value = localStorage.getItem('PPG-bet-multiplier');
        updateResultHTML();


    });

    function randomColor() {
        const totalSquares = 144;
        const redSquares = 71;
        const whiteSquares = 71;
        const goldSquares = 2;

        // Create an array to represent all the squares
        const squares = [];

        // Populate with red squares
        for (let i = 0; i < redSquares; i++) {
            squares.push('red');
        }

        // Populate with white squares
        for (let i = 0; i < whiteSquares; i++) {
            squares.push('white');
        }

        // Populate with 'GO' squares
        for (let i = 0; i < goldSquares; i++) {
            squares.push('gold'); //Gold
        }

        // Sanity check: Ensure the array has the correct total number of squares
        if (squares.length !== totalSquares) {
            console.warn("Mismatch in total squares! Check your square counts.");
            // Adjust or handle error as needed
        }

        // Randomly select an index from the squares array
        const randomIndex = Math.floor(Math.random() * squares.length);

        // Return the type of square at the randomly selected index
        return squares[randomIndex];
    }



    function spin() {
        
        if(!localStorage.getItem('PPG-initial-money')) {
            localStorage.setItem('PPG-initial-money', 1000);
        }
        
        if(!localStorage.getItem('PPG-bet-multiplier')) {
            localStorage.setItem('PPG-bet-multiplier', '2');
        }
        const betMultiplier = parseFloat(localStorage.getItem('PPG-bet-multiplier'));

        if(!localStorage.getItem('PPG-selected-color')) {
            localStorage.setItem('PPG-selected-color', 'pink');
        }

        const colorSelect = document.getElementById('color-select');
        // Ensure initialMoney is parsed as a number.
        const initialMoney = parseInt(localStorage.getItem('PPG-initial-money'), 10); 
        let results = [];
        let multiplier = 0;
        let initialBet = 5;
        let isWin = false;
        let currentMoney = 0;
        const firstColor = randomColor(); // Assuming randomColor() is defined elsewhere
        const secondColor = randomColor(); // Assuming randomColor() is defined elsewhere
        const thirdColor = randomColor(); // Assuming randomColor() is defined elsewhere

        if(firstColor === 'red' && secondColor === 'red' && thirdColor === 'red') {
            multiplier = 7;
        }
        
        
        if(!localStorage.getItem('PPG-results')) {
            console.log(multiplier);
            
            if(multiplier === 0) {
                isWin = false;
                currentMoney = initialMoney - initialBet;
            } else {
                const totalPrize = initialBet * multiplier;
                isWin = true;
                currentMoney = initialMoney + totalPrize;
            }

            const currentResult = {
                resultNumber: 1,
                color1: firstColor,
                color2: secondColor,
                color3: thirdColor,
                bet: initialBet,
                isWin: isWin,
                change: multiplier ? initialBet * multiplier : initialBet,
                currentMoney: currentMoney
            };
            // Store the currentResult object directly, not wrapped in another object
            results.push(currentResult); 
            localStorage.setItem('PPG-results', JSON.stringify(results));
        } else {
            // Parse the results. This will be an array of result objects.
            const lsResults = JSON.parse(localStorage.getItem('PPG-results'));
            
            // Get the last result object directly
            const lastResult = lsResults[lsResults.length - 1]; 
            
            let currentBet = initialBet;
            // Access properties from lastResult directly
            if(!lastResult.isWin) { 
                currentBet = Math.ceil(lastResult.bet * betMultiplier);
            }
            
            if(multiplier <= 0) {
                isWin = false;             
                currentMoney = lastResult.currentMoney - currentBet; // Access currentMoney from lastResult
                
            } else {
                const totalPrize = currentBet * multiplier;             
                isWin = true;
                currentMoney = lastResult.currentMoney + totalPrize; // Access currentMoney from lastResult
            }

            const currentResult = {
                resultNumber: lastResult.resultNumber + 1,
                color1: firstColor,
                color2: secondColor,
                color3: thirdColor,
                bet: currentBet,
                isWin: isWin,
                change: multiplier ? currentBet * multiplier : currentBet,
                currentMoney: currentMoney 
            };
            // Push the currentResult object directly
            lsResults.push(currentResult); 
            localStorage.setItem('PPG-results', JSON.stringify(lsResults));
        }
        
        updateResultHTML();
        const currentSpins = JSON.parse(localStorage.getItem('PPG-results'));
        loseStreaksHandler(isWin, (currentSpins.length - 1));
        
    }


    function updateResultHTML() {
        let currentResults = JSON.parse(localStorage.getItem('PPG-results'));
        if(!currentResults) {
            currentResults = [];
        }
        const resultUL = document.getElementById('results-ul');
        let resultHTML = '';
        /*html*/
        const initialLi = `
            <li>
                <table>
                <!--<tr>
                    <td colspan="2" style="width: 118px;">Next Spin Bet: </td>
                    <td colspan="2" style="width: 54px;">-10</td>
                    <td>5,000</td>
                </tr>-->
                <tr>
                    <td colspan="5">
                    <p style="border-bottom: 1px solid #fff;"></p>
                    </td>
                </tr>
                <tr>
                    <td style="width: 25px;">#</td>
                    <td style="width: 118px;"><b>Results</b></td>
                    <td style="width: 47px;"><b>Bet</b></td>
                    <td style="width: 64px;"><b>+/-</b></td>
                    <td><b>My ₱</b></td>
                </tr>
                </table>
            </li>
        `;

        currentResults.sort((a, b) => b.resultNumber - a.resultNumber);
        currentResults.forEach(result => {
            /*html*/
            resultHTML += `
                <li>
                    <table>          
                    <tr>
                        <td style="width: 25px;">${result.resultNumber}</td>
                        <td class="res-color">
                        <div class="color ${result.color1}">${result.color1 === 'gold' ? 'GO' : ''}</div>
                        </td>
                        <td class="res-color">
                        <div class="color ${result.color2}">${result.color2 === 'gold' ? 'GO' : ''}</div>
                        </td>
                        <td class="res-color pd-r">
                        <div class="color ${result.color3}">${result.color3 === 'gold' ? 'GO' : ''}</div>
                        </td>
                        <td style="width: 50px;">${result.bet}</td>
                        <td style="color: ${result.isWin ? '#00ff00' : 'red'}; width: 60px;">${result.isWin ? '+' : '-'}${result.change}</td>
                        <td>${formatNumberString(result.currentMoney)}</td>
                    </tr>
                    </table>
                </li>
            `;
        });

        resultUL.innerHTML = initialLi + resultHTML;


    }

    function changeSelectColor(elem) {
        localStorage.setItem('PPG-selected-color', elem.value);
        elem.style.backgroundColor = elem.value;
        if(elem.value === 'pink' || elem.value === 'white' || elem.value === 'yellow') {
            elem.style.color = '#000';
        } else {
            elem.style.color = '#fff';
        }
    }

    function reset() {        
        let text = "Are you sure you want to RESET the session?";
        if (confirm(text) == true) {
            const initialMoney = document.getElementById('initial-money');
            const betMultiplier = document.getElementById('bet-multiplier');
            localStorage.removeItem('PPG-results');
            localStorage.removeItem('PPG-lose-streaks')
            localStorage.setItem('PPG-initial-money', initialMoney.value);
            localStorage.setItem('PPG-bet-multiplier', betMultiplier.value);
            document.getElementById('lose-streaks').value = '';
            updateResultHTML();
        }
    }

    function formatNumberString(numberString) {
        const decimalPlaces = 0;
        // 1. Convert the string to a number.
        // Using parseFloat handles both integers and decimals.
        const number = parseFloat(numberString);

        // 2. Check if the conversion resulted in a valid number.
        if (isNaN(number)) {
            return 'Invalid Number'; // Or throw an error, depending on desired behavior
        }

        // 3. Format the number:
        //    a. Use toFixed() to control the number of decimal places.
        //    b. Use toLocaleString() for thousands separators.
        //       We call toLocaleString on the result of toFixed because toFixed returns a string.
        //       Calling toLocaleString on the original number first might keep too many decimals
        //       or handle rounding differently.
        const formattedNumber = number.toFixed(decimalPlaces); // e.g., "1234567.89"
        const finalFormattedString = parseFloat(formattedNumber).toLocaleString('en-US', {
            minimumFractionDigits: decimalPlaces, // Ensure trailing zeros are kept if needed
            maximumFractionDigits: decimalPlaces
        });


        return finalFormattedString;
    }



    let spinInterval; // Declare a variable outside the function to store the interval ID

    function infiniteSpin(action) {
        const infiniteBtn = document.getElementById('infinite-spin-btn');
        const stopInfiniteBtn = document.getElementById('stop-infinite-spin-btn');
        if (action === 1) {
            infiniteBtn.style.display = 'none';
            stopInfiniteBtn.style.display = 'inline-block';
            // Start the interval
            if (spinInterval) {
                // Optional: Clear existing interval if it's already running to prevent multiple intervals
                clearInterval(spinInterval);
                console.log("Cleared existing interval before starting a new one.");
            }
            spinInterval = setInterval(() => {
                spin();
                
            }, 300);
        } else {
            infiniteBtn.style.display = 'inline-block';
            stopInfiniteBtn.style.display = 'none';
            // Stop the interval
            if (spinInterval) {
                clearInterval(spinInterval);
                console.log("Interval stopped with ID:", spinInterval);
                spinInterval = null; // Good practice to set it to null after clearing
            } else {
                console.log("No interval is currently running to stop.");
            }
        }
    }

    
    let loseStreaks = 0;
    function loseStreaksHandler(isWin, spinNumber) {        
        let loseStreaksArray = '';
        if(localStorage.getItem('PPG-lose-streaks')) {
            loseStreaksArray = localStorage.getItem('PPG-lose-streaks');
        }
        if(!isWin) {
            loseStreaks++;
            
        } else {
            if(loseStreaks >= 20) {
                loseStreaksArray += `${loseStreaks}(${spinNumber}), `;
                localStorage.setItem('PPG-lose-streaks', loseStreaksArray);
                document.getElementById('lose-streaks').value = localStorage.getItem('PPG-lose-streaks');
            }
            loseStreaks = 0;
        }
    }