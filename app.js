
// DOM elements to be referenced later
const balanceElement = document.getElementById('balance');
const loanElement = document.getElementById('loan');
const payElement = document.getElementById('pay');
const laptopMenuElement = document.getElementById('laptops');
const laptopFeaturesElement = document.getElementById('features');

const laptopImageElement = document.getElementById('laptop-image');
const laptopTitleElement = document.getElementById('laptop-title');
const laptopDescriptionElement = document.getElementById('laptop-description');
const laptopPriceElement = document.getElementById('laptop-price');

const loanButtonElement = document.getElementById('btn-loan');
const bankButtonElement = document.getElementById('btn-bank');
const workButtonElement = document.getElementById('btn-work');
const repayButtonElement = document.getElementById('btn-repay');
const buyButtonElement = document.getElementById('btn-buy');

// initial values for main variables
let balance = 0.00;
let loan = 0.00;
let pay = 0.00;
let laptops = [];
let baseUrl = 'https://noroff-komputer-store-api.herokuapp.com/'

// API request for laptops
fetch(baseUrl + 'computers')
    .then(response => response.json())
    .then(data => laptops = data)
    .then(laptops => {
        addLaptopsToMenu(laptops)
        fixApiMistake(laptops)
    });


// fixes the incorrect file extension on computer #5
const fixApiMistake = (laptops) => {
    laptops.forEach(laptop => {
        if (laptop.id == 5) {
            laptop.image = 'assets/images/5.png'
        }
    })
}

// populates the select menu with computers
const addLaptopsToMenu = (laptops) => {
    laptops.forEach(x => addLaptopToMenu(x))
    updateLaptopInfo(laptops[0])
}

// appends a single computer to the computer select menu
const addLaptopToMenu = (laptop) => {
    const laptopElement = document.createElement('option');
    laptopElement.value = laptop.id;
    laptopElement.appendChild(document.createTextNode(laptop.title));
    laptopMenuElement.appendChild(laptopElement);
}

// used for updating all the necessary information when the selected computer changes
const updateLaptopInfo = (laptop) => {
    laptopImageElement.src = `${baseUrl}` + `${laptop.image}`;
    laptopTitleElement.innerHTML = laptop.title;
    laptopDescriptionElement.innerHTML = laptop.description;
    laptopPriceElement.innerHTML = formatCurrency(laptop.price);
    laptopFeaturesElement.innerHTML = '';
    laptop.specs.forEach(feature => {
        const featureItem = document.createElement('li')
        featureItem.innerHTML = feature;
        laptopFeaturesElement.appendChild(featureItem);
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

    if (isNaN(enteredAmount)) {
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

const handleLaptopMenuChange = e => {
    const selectedLaptop = laptops[e.target.selectedIndex];
    updateLaptopInfo(selectedLaptop);
}

// event listeners for the interactive elements
workButtonElement.addEventListener('click', handleWorkClick);
bankButtonElement.addEventListener('click', handleBankClick);
loanButtonElement.addEventListener('click', handleLoanClick);
repayButtonElement.addEventListener('click', handleRepayClick);
laptopMenuElement.addEventListener('change', handleLaptopMenuChange);

// helper function that transforms numbers into a correct currency format
const formatCurrency = (number) => {
    return new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR' }).format(number);
}
