

    
    
    let initialBetDefault = 200;

    document.addEventListener('DOMContentLoaded', (e) => {

        initializeLS();

        const colorSelect = document.getElementById('color-select');
        colorSelect.value = localStorage.getItem('EUR2-selected-color');
        changeSelectColor(colorSelect);

        const betPlusMinus = document.getElementById('bet-plus-minus');
        const initialMoney = document.getElementById('initial-money');
        const initialBet = document.getElementById('initial-bet');
        const currentBet = document.getElementById('current-bet');

        betPlusMinus.addEventListener('focus', (e) => {
            e.target.select();
        });
        initialMoney.addEventListener('focus', (e) => {
            e.target.select();
        });
        initialBet.addEventListener('focus', (e) => {
            e.target.select();
        });
        currentBet.addEventListener('focus', (e) => {
            e.target.select();
        });

        betPlusMinus.value = localStorage.getItem('EUR2-bet-plus-minus');
        initialMoney.value = localStorage.getItem('EUR2-initial-money');
        initialBet.value = localStorage.getItem('EUR2-initial-bet');
        currentBet.value = localStorage.getItem('EUR2-current-bet');

        updateResultHTML();
        colorCounter();

        
        

    });

    function initializeLS() {

        if(!localStorage.getItem('EUR2-bet-plus-minus')) {
            localStorage.setItem('EUR2-bet-plus-minus', 10);
        }
        
        if(!localStorage.getItem('EUR2-initial-money')) {
            localStorage.setItem('EUR2-initial-money', 1000);
        }

        if(!localStorage.getItem('EUR2-initial-bet')) {
            localStorage.setItem('EUR2-initial-bet', initialBetDefault);
        }

        if(!localStorage.getItem('EUR2-selected-color')) {
            localStorage.setItem('EUR2-selected-color', '0');
        }

        if(!localStorage.getItem('EUR2-current-money')) {
            const initialMoney = parseInt(localStorage.getItem('EUR2-initial-money'), 10);
            localStorage.setItem('EUR2-current-money', initialMoney);
        }

        if(!localStorage.getItem('EUR2-current-bet')) {
            localStorage.setItem('EUR2-current-bet', initialBetDefault);
        }

        if(!localStorage.getItem('EUR2-results')) {
            localStorage.setItem('EUR2-results', '[]');
        }


    }

    function randomColor() {
        const totalNumbers = 37;
        const redNumbers = 18;
        const blackNumbers = 18;
        const greenNumbers = 1;

        const numbers = [];

        for (let i = 0; i < redNumbers; i++) {
            numbers.push('red');
        }

        for (let i = 0; i < blackNumbers; i++) {
            numbers.push('black');
        }

        for (let i = 0; i < greenNumbers; i++) {
            numbers.push('green');
        }

        if (numbers.length !== totalNumbers) {
            console.warn("Mismatch in total numbers! Check your number counts.");
        }

        const randomIndex = Math.floor(Math.random() * numbers.length);

        return numbers[randomIndex];
    }

    function changeSelectColor(elem) {

        localStorage.setItem('EUR2-selected-color', elem.value);

        let selectedColor = elem.value;
        if(elem.value === '0') {
            selectedColor = 'transparent';
        }
        localStorage.setItem('EUR-selected-color', selectedColor);
        elem.style.backgroundColor = selectedColor;
    }

    function spin(spinsAlot = null) {

        
        initializeLS();

        let colorSelect = localStorage.getItem('EUR2-selected-color');
        if(spinsAlot) {
            colorSelect = spinsAlot;
        }
        console.log(colorSelect);
        
        const currentBetTextbox = document.getElementById('current-bet');
        
        const initialMoney = parseInt(localStorage.getItem('EUR2-initial-money'), 10);
        const initialBet = parseInt(localStorage.getItem('EUR2-initial-bet'), 10);
        const betPlusMinus = parseInt(localStorage.getItem('EUR2-bet-plus-minus'), 10);

        const currentMoney = parseInt(localStorage.getItem('EUR2-current-money'), 10);
        const currentBet = parseInt(currentBetTextbox.value, 10);

        let results = [];
        let resultNumber = 0;
        if(localStorage.getItem('EUR2-results')) {
            results = JSON.parse(localStorage.getItem('EUR2-results'));
            resultNumber = results.length;
        }
        let isWin = false;
        let nextBet = 0;
        let nextMoney = 0;
        let currentResult = {};

        const color = randomColor();
        

        if(colorSelect !== '0') { // With bet

            
            if(colorSelect === color) { // WIN
                nextBet = currentBet - betPlusMinus;
                nextMoney = currentMoney + currentBet;
                isWin = true;
                
            } else { // LOSE
                nextBet = currentBet + betPlusMinus;
                nextMoney = currentMoney - currentBet;
                isWin = false;
            }

            currentResult = {
                resultNumber: resultNumber++,
                color: color,
                bet: currentBet,
                isWin: isWin,
                change: currentBet,
                currentMoney: nextMoney
            }

        } else { // Without bet


            nextBet = currentBet;
            nextMoney = currentMoney;

            currentResult = {
                resultNumber: resultNumber++,
                color: color,
                bet: 0,
                isWin: true,
                change: 0,
                currentMoney: nextMoney
            }

        }
        

        
        results.push(currentResult);

        localStorage.setItem('EUR2-results', JSON.stringify(results));
        localStorage.setItem('EUR2-current-bet', nextBet);
        localStorage.setItem('EUR2-current-money', nextMoney);
        currentBetTextbox.value = nextBet;
        
        if(nextBet > nextMoney) {
            document.getElementById('spin-btn').disabled = true;
        }

        updateResultHTML();
        colorCounter();
    }


    function updateResultHTML() {
        let currentResults = JSON.parse(localStorage.getItem('EUR2-results'));
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
        const resultLimit = 20;
        let i = 1;
        currentResults.forEach(result => {
            if(i > resultLimit) {
                return;
            }
            /*html*/
            resultHTML += `
                <li>
                    <table>          
                    <tr>
                        <td style="width: 25px;">${result.resultNumber}</td>
                        <td class="res-color">
                             <div class="triangle-left tc-left-${result.color}"></div>
                        </td>
                        <td class="res-color">
                            <div class="triangle-right tc-right-${result.color}"></div>
                        </td>
                        <td class="res-color pd-r">
                            <div class="color"></div>
                        </td>
                        <td style="width: 50px;">${result.bet}</td>
                        <td style="color: ${result.isWin ? '#00ff00' : 'red'}; width: 60px;">${result.isWin ? '+' : '-'}${result.change}</td>
                        <td>${formatNumberString(result.currentMoney)}</td>
                    </tr>
                    </table>
                </li>
            `;
            i++;
        });

        resultUL.innerHTML = initialLi + resultHTML;


    }
    

    function reset() {

        const betPlusMinus = document.getElementById('bet-plus-minus');
        const initialBet = document.getElementById('initial-bet');
        const initialMoney = document.getElementById('initial-money');
        
        const greensSpan = document.getElementById('greens');
        const redsSpan = document.getElementById('reds');
        const blacksSpan = document.getElementById('blacks');

        const currentBet = document.getElementById('current-bet');
        const selectedColor = document.getElementById('color-select');
        const spinBtn = document.getElementById('spin-btn');

        localStorage.setItem('EUR2-results', '[]');
        localStorage.setItem('EUR2-bet-plus-minus', betPlusMinus.value);
        localStorage.setItem('EUR2-initial-bet', initialBet.value);
        localStorage.setItem('EUR2-current-bet', initialBet.value);
        localStorage.setItem('EUR2-initial-money', initialMoney.value);
        localStorage.setItem('EUR2-selected-color', '0');
        localStorage.setItem('EUR2-current-money', initialMoney.value);

        currentBet.value = initialBet.value;
        spinBtn.disabled = false;
        selectedColor.value = '0';
        selectedColor.style.backgroundColor = 'transparent';
        

        greensSpan.innerHTML = 0;
        redsSpan.innerHTML = 0;
        blacksSpan.innerHTML = 0;

        document.getElementById('red-diff').innerHTML = '';
        document.getElementById('black-diff').innerHTML = '';
        
        updateResultHTML();
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

    function colorCounter() {        
        let greens = 0;
        let reds = 0;
        let blacks = 0;

        let results = JSON.parse(localStorage.getItem('EUR2-results'));
        if(!results) {
            results = [];
        }
        results.forEach(result => {
            
            if(result.color === 'red') {
                reds++;
            } else 
            if(result.color === 'black') {
                blacks++;
            }
            else {
                greens++;
            }
        });
        


        const greenPercentage = (greens / results.length) * 100;
        const redPercentage = (reds / results.length) * 100;
        const blackPercentage = (blacks / results.length) * 100;

        const greensSpan = document.getElementById('greens');
        const redsSpan = document.getElementById('reds');
        const blacksSpan = document.getElementById('blacks');

        const greenPSpan = document.getElementById('green-percentage');
        const redPSpan = document.getElementById('red-percentage');
        const blackPSpan = document.getElementById('black-percentage');

        greensSpan.innerHTML = greens;
        redsSpan.innerHTML = reds;
        blacksSpan.innerHTML = blacks;
        
        greenPSpan.innerHTML = greenPercentage.toFixed(2)+' %';
        redPSpan.innerHTML = redPercentage.toFixed(2)+' %';
        blackPSpan.innerHTML = blackPercentage.toFixed(2)+' %';

        
        const redDiffSpan = document.getElementById('red-diff');
        const blackDiffSpan = document.getElementById('black-diff');
        
        const redDiff = reds - blacks;
        const blacksDiff = blacks - reds;

        if(redDiff > 0 || blacksDiff > 0) {

            if(redDiff > 0) {
                redDiffSpan.innerHTML = '+'+redDiff;
                redDiffSpan.style.color = '';

                blackDiffSpan.innerHTML = '<--';
                blackDiffSpan.style.color = '#00ff00';

            }
            if(blacksDiff > 0) {
                blackDiffSpan.innerHTML = '+'+blacksDiff;
                blackDiffSpan.style.color = '';

                redDiffSpan.innerHTML = '<--';
                redDiffSpan.style.color = '#00ff00';
            }

        } else {
            redDiffSpan.innerHTML = '';
            blackDiffSpan.innerHTML = '';
        }
        

    }

    

    function spinsAlot() {
        const spinBtn = document.getElementById('initial-bet');

        reset();
        for (let index = 0; index < 1000; index++) {
            
            if(parseInt(localStorage.getItem('EUR2-current-money')) <= 0) {
                break;
            }
            spin('black');
            
        }
    }