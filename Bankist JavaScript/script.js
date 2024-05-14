"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Rudra Gupta",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  username: "js",
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  username: "jd",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  username: "stw",
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  username: "ss",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const display = function (movements, sort = false) {
  containerMovements.innerHTML = "";
  const mov = sort ? movements.slice().sort((a, b) => a - b) : movements;
  mov.forEach(function (mo, i) {
    const type = mo > 0 ? "deposit" : "withdrawal";
    const html = ` <div class="movements__row">
    <div class="movements__type movements__type--${type}">
      ${i + 1} ${type}
    </div>
    <div class="movements__value">${mo}</div>
  </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
const displayBalance = function (acs) {
  acs.balance = acs.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acs.balance} EUR`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((num) => num > 0)
    .reduce((acc, num) => num + acc, 0);
  labelSumIn.textContent = `${incomes}`;

  const out = acc.movements
    .filter((num) => num < 0)
    .reduce((acc, num) => num + acc, 0);
  labelSumOut.textContent = `${Math.abs(out)}`;

  const interest = acc.movements
    .filter((num) => num > 0)
    .map((num) => (num * acc.interestRate) / 100)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest}`;
};
//function display all

const displayUI = function (acc) {
  displayBalance(acc);
  display(acc.movements);
  calcDisplaySummary(acc);
};
// Event handlers
let currentAccount;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value))
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(" ")[0]
    }`;
  containerApp.style.opacity = 100;
  inputLoginUsername.value = inputLoginPin.value = "";
  inputLoginPin.blur();
  displayUI(currentAccount);
});
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";
  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance > amount &&
    receiverAccount != currentAccount
  ) {
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);
    displayUI(currentAccount);
  }
});
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    Number(inputLoanAmount.value) > 0 &&
    currentAccount.movements.some(
      (mov) => mov > Number(inputLoanAmount.value) * 0.1
    )
  ) {
    currentAccount.movements.push(Number(inputLoanAmount.value));
    displayUI(currentAccount);
  }
  inputLoanAmount.value = "";
});
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  display(currentAccount.movements, !sorted);
  sorted = !sorted;
});
