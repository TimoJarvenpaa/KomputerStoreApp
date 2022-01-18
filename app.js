
// DOM elements to be referenced later
const balanceElement = document.getElementById('balance');
const loanElement = document.getElementById('loan');
const payElement = document.getElementById('pay');

const computerMenuElement = document.getElementById('computers');
const computerFeaturesElement = document.getElementById('features');

const computerImageElement = document.getElementById('computer-image');
const computerTitleElement = document.getElementById('computer-title');
const computerDescriptionElement = document.getElementById('computer-description');
const computerPriceElement = document.getElementById('computer-price');

const loanButtonElement = document.getElementById('btn-loan');
const bankButtonElement = document.getElementById('btn-bank');
const workButtonElement = document.getElementById('btn-work');
const repayButtonElement = document.getElementById('btn-repay');
const buyButtonElement = document.getElementById('btn-buy');

// initial values for main variables
let balance = 0.00;
let loan = 0.00;
let pay = 0.00;
let computers = [];
let currentSelectedComputer = 0;
let baseUrl = 'https://noroff-komputer-store-api.herokuapp.com/'

// API request for computers
fetch(baseUrl + 'computers')
    .then(response => response.json())
    .then(data => computers = data)
    .then(computers => {
        addComputersToMenu(computers)
        fixApiMistake(computers)
    });


// fixes the incorrect file extension on computer #5
const fixApiMistake = (computers) => {
    computers.forEach(computer => {
        if (computer.id == 5) {
            computer.image = 'assets/images/5.png'
        }
    })
}

// populates the select menu with computers
const addComputersToMenu = (computers) => {
    computers.forEach(c => addComputerToMenu(c))
    updateComputerInfo(computers[0])
}

// appends a single computer to the computer select menu
const addComputerToMenu = (computer) => {
    const computerElement = document.createElement('option');
    computerElement.value = computer.id;
    computerElement.appendChild(document.createTextNode(computer.title));
    computerMenuElement.appendChild(computerElement);
}

// used for updating all the necessary information when the selected computer changes
const updateComputerInfo = (computer) => {
    currentSelectedComputer = computer;
    computerImageElement.src = `${baseUrl}` + `${computer.image}`;
    computerTitleElement.innerHTML = computer.title;
    computerDescriptionElement.innerHTML = computer.description;
    computerPriceElement.innerHTML = formatCurrency(computer.price);
    computerFeaturesElement.innerHTML = '';
    computer.specs.forEach(feature => {
        const featureItem = document.createElement('li')
        featureItem.innerHTML = feature;
        computerFeaturesElement.appendChild(featureItem);
    });
}

// event handler for the 'Work' button
const handleWorkClick = () => {
    pay += 100.00;
    payElement.innerText = formatCurrency(pay);
}

// event handler for the 'Bank' button
const handleBankClick = () => {
    if (loan > 0.00) {
        if (loan <= 0.1 * pay) {
            pay -= loan;
            loan = 0.00;
        } else {
            loan -= 0.1 * pay;
            pay = 0.9 * pay;
        }
    }

    balance += pay;
    pay = 0.00;

    balanceElement.innerText = formatCurrency(balance);
    payElement.innerText = formatCurrency(pay);

    if (loan == 0.00) {
        loanElement.innerText = '';
        repayButtonElement.style.display = 'none';
    } else {
        loanElement.innerText = `Current loan ${formatCurrency(loan)}`;
        repayButtonElement.style.display = 'block';
    }
}

// event handler for the 'Get a loan' button
const handleLoanClick = () => {

    if (loan > 0.00) {
        alert('The previous loan must first be paid back in full.');
        return;
    }

    const enteredAmount = parseFloat(prompt("Please enter the amount of loan you'd like to take: "));

    if (isNaN(enteredAmount) || enteredAmount <= 0) {
        alert('Invalid input.');
        return;
    } else if (enteredAmount > 2 * balance) {
        alert('Amount cannot be more than double the current balance.');
        return;
    } else {
        balance += enteredAmount;
        loan += enteredAmount;
        balanceElement.innerText = formatCurrency(balance);
        loanElement.innerText = `Current loan ${formatCurrency(loan)}`;
        repayButtonElement.style.display = 'block';
    }
}

// event handler for the 'Repay Loan' button
const handleRepayClick = () => {
    if (pay == 0.00) {
        return;
    }

    if (loan > pay && pay != 0.00) {
        loan -= pay;
        pay = 0.00;
    } else {
        pay -= loan;
        loan = 0.00;
    }

    if (loan == 0.00) {
        loanElement.innerText = '';
        payElement.innerText = formatCurrency(pay);
        repayButtonElement.style.display = 'none';
    } else {
        loanElement.innerText = `Current loan ${formatCurrency(loan)}`;
        payElement.innerText = formatCurrency(pay);
        repayButtonElement.style.display = 'block';
    }
}

// event handler for the computer menu
const handleComputerMenuChange = e => {
    const selectedComputer = computers[e.target.selectedIndex];
    currentSelectedComputer = selectedComputer;
    updateComputerInfo(selectedComputer);
}

// event handler for the 'Buy Now' button
const handleBuyClick = () => {
    let price = currentSelectedComputer.price;
    if (price > balance) {
        alert('You cannot afford this computer.');
        return;
    } else {
        balance -= price;
        balanceElement.innerText = formatCurrency(balance);
        alert('You have successfully purchased this computer.');
    }
}

// event listeners for the interactive elements
workButtonElement.addEventListener('click', handleWorkClick);
bankButtonElement.addEventListener('click', handleBankClick);
loanButtonElement.addEventListener('click', handleLoanClick);
repayButtonElement.addEventListener('click', handleRepayClick);
computerMenuElement.addEventListener('change', handleComputerMenuChange);
buyButtonElement.addEventListener('click', handleBuyClick);

// helper function that transforms numbers into a correct currency format
const formatCurrency = (number) => {
    return new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR' }).format(number);
}
