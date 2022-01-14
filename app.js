
// DOM elements to be referenced later
const balanceElement = document.getElementById('balance');
const loanElement = document.getElementById('loan');
const payElement = document.getElementById('pay');
const loanButtonElement = document.getElementById('btn-loan');
const bankButtonElement = document.getElementById('btn-bank');
const workButtonElement = document.getElementById('btn-work');

// initial values for main variables
let balance = 0.00;
let loan = 0.00;
let pay = 0.00;

// event handler for the 'Work' button
const handleWorkClick = () => {
    pay += 100.00;
    payElement.innerText = `${pay.toFixed(2)} Kr`
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

    balanceElement.innerText = `${balance.toFixed(2)} Kr`;
    payElement.innerText = `${pay.toFixed(2)} Kr`;

    if (loan == 0.00) {
        loanElement.innerText = '';
    } else {
        loanElement.innerText = `Current loan ${loan.toFixed(2)} Kr`;
    }
}

// event handler for the 'Get a loan' button
const handleLoanClick = () => {

    if (loan > 0.00) {
        alert('The previous loan must first be paid back in full.');
        return;
    }

    const enteredAmount = parseFloat(prompt("Please enter the amount of loan you'd like to take: "));

    if (isNaN(enteredAmount)) {
        alert('Invalid input.');
        return;
    } else if (enteredAmount > 2 * balance) {
        alert('Amount cannot be more than double the current balance.');
        return;
    } else {
        balance += enteredAmount;
        loan += enteredAmount;
        balanceElement.innerText = `${balance.toFixed(2)} Kr`;
        loanElement.innerText = `Current loan ${loan.toFixed(2)} Kr`;
    }
}

// TODO
const handleRepayLoan = () => {
    return;
}

// event listeners for the interactive elements
workButtonElement.addEventListener('click', handleWorkClick);
bankButtonElement.addEventListener('click', handleBankClick);
loanButtonElement.addEventListener('click', handleLoanClick);