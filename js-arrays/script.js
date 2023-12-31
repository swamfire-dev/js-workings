'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  // console.log(movements);
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort(function (a, b) { return a - b; }) : movements;
  movs.forEach((element, index) => {
    const type = element > 0 ? "deposit" : "withdrawal";
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${index + 1} ${type}</div>
          <div class="movements__value">${element}€</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
    // containerMovements.insertAdjacentHTML("beforeend", html);
  });
};
// displayMovements(account1.movements);
// console.log(containerMovements.innerHTML);

const calcDisplaySummary = function (acc) {
  const movements = acc.movements;
  const incomes = movements.filter(function (mov) {
    return mov > 0;
  }).reduce(function (acc, current) {
    return acc + current;
  });
  labelSumIn.textContent = `${incomes} €`;

  const out = movements.filter(function (mov) {
    return mov < 0;
  }).reduce(function (acc, current) {
    return acc + current;
  });
  labelSumOut.textContent = `${Math.abs(out)} €`;

  const interest = movements.filter(function (mov) {
    return mov > 0;
  }).map(function (mov) {
    return mov * acc.interestRate / 100;
  }).filter(function (mov) {
    return mov >= 1;
  }).reduce(function (acc, current) {
    return acc + current;
  });
  labelSumInterest.textContent = `${interest} €`;
};
// calcDisplaySummary(account1.movements);

const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner.toLowerCase().split(" ").map(function (uname) {
      return uname[0];
    }).join("");
    // return username;
  });
};

// const user = 'Steven Thomas Williams';
// const user = 'Jessica Davis';
// const user = 'Jonas Schmedtmann';
// const user = 'Sarah Smith';
createUsername(accounts);
// console.log(accounts);

const calcPrintBalance = function (acc) {
  const movements = acc.movements;
  const balance = movements.reduce(function (accumulator, current) {
    return accumulator + current;
  });
  acc.balance = balance;
  labelBalance.textContent = `${balance} €`;
};
// calcPrintBalance(account1.movements);

//update UI
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);
  // Display Balance
  calcPrintBalance(acc);
  // Display Summary
  calcDisplaySummary(acc);
};

//Event Handlers
let currentAccount;
btnLogin.addEventListener("click", function (event) {
  event.preventDefault();
  // console.log("LOGIN");
  currentAccount = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  });
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // console.log( "LOGIN");
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;
    containerApp.style.opacity = 100;
    // Clear inputs
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
  // console.log(currentAccount);
});

btnTransfer.addEventListener("click", function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  // console.log(amount);
  const receiverAcc = accounts.find(function (acc) {
    return acc.username === inputTransferTo.value;
  });
  inputTransferAmount.value = inputTransferTo.value = "";
  // console.log(receiverAcc, amount);
  if (amount > 0 && currentAccount.balance >= amount && receiverAcc && receiverAcc?.username !== currentAccount.username) {
    // console.log("Transfer Valid");
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // Update UI
    updateUI(currentAccount);
    // clear fields
  }
});

btnLoan.addEventListener("click", function (event) {
  event.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(function (mov) {
    return mov > amount * 0.1;
  })) {
    currentAccount.movements.push(amount);
    // inputLoanAmount.value = "";
    updateUI(currentAccount);
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (event) {
  event.preventDefault();
  // console.log("Close acc clicked");
  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(function (acc) {
      return acc.username === currentAccount.username;
    });
    console.log(index);
    accounts.splice(index, 1);
    inputCloseUsername.value = inputClosePin.value = "";
    labelWelcome.textContent = "Log in to get started";
    containerApp.style.opacity = 0;
  }
});

let sorted = false;
btnSort.addEventListener("click", function (event) {
  event.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////


// let arr = ["a", "b", "c", "d", "e"];
// // Slice method
// // console.log("Array Slice:", arr.slice(2)); //Array Slice
// // console.log("Array Slice:", arr.slice(2, 4)); //Array Slice
// // console.log("Array Slice:", arr.slice(-2, -1));// last index is exclusive
// // console.log(arr[2]);

// // Splice method => original array is mutated
// // console.log(arr.splice(2, 3));
// console.log(arr);
// console.log(arr.reverse());
// let arr2 = ["x", "y", "z"];

// // array concat
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

// //join method
// console.log(letters.join("-"));


// const arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(0));

// //get last element of array
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));
// console.log("Swamfire".at(-1));
// console.log("Swamfire".at(0));

// //______________________________ forEach loop ___________________________________

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements);
// // for (const trans of movements) {
// //   const output = trans > 0 ? `You deposited ${ trans; } ` : `You withdrawn ${ trans; } `;
// //   console.log(output);
// // }

// // forEach loop of arrays
// // movements.forEach((trans) => {
// //   const output = trans > 0 ? `You deposited ${ trans; } ` : `You withdrawn ${ trans; } `;
// //   console.log(output);
// // });

// // movements.forEach(function(trans) {
// //   const output = trans > 0 ? `You deposited ${ trans; } ` : `You withdrawn ${ trans; } `;
// //   console.log(output);
// // });

// // order of arguments are fixed
// // continue, break, exit() keywords dont work for forEach loop
// movements.forEach(function (trans, index, array) {
//   console.log(index);
//   const output = trans > 0 ? `You deposited ${ trans; } ` : `You withdrawn ${ trans; } `;
//   console.log(output);
// });

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);
// console.log(currencies);
// // currencies.forEach(function (value, key, map) {
// //   console.log(`${ key; }: ${ value; } `);
// // });

// currencies.forEach((value, key, map) => {
//   console.log(`${ key; }: ${ value; } `);
// });

// const uniqueCurrencies = new Set(["INR", "USD", "EUR", "GBP", "INR"]);
// console.log(uniqueCurrencies);
// // Sets dont have keys, values pairs
// uniqueCurrencies.forEach((value, key, set) => {
//   console.log(`Set:${ set; } \t${ key; }:${ value; } `);
// });

// //___________________ Challenge #2 _____________________________________

// const checkDogs = function (dogsJulia, dogsKate) {
//   const dogsJuliaCorrected = dogsJulia.slice();
//   dogsJuliaCorrected.splice(0, 1);
//   dogsJuliaCorrected.splice(-2);
//   console.log(dogsJuliaCorrected);
//   const dogs = dogsJuliaCorrected.concat(dogsKate);
//   console.log(dogs);
//   dogs.forEach(function (dog, i) {
//     if (dog > 3) {
//       console.log("Dog is adult");
//     }
//     else {
//       console.log("Still a puppy");
//     }
//   });
// };
// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);


// //______________________________ MAP Method ___________________________

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const eurToUsd = 1.1;
// // const movementsUsd = movements.map(function (mov) {
// //   return mov * eurToUsd;
// // });
// const movementsUsd = movements.map(mov => mov * eurToUsd);
// console.log(movements);
// console.log(movementsUsd);

// movements.map(function (value, key, arr) {
//   console.log(value, key, arr);
// });


// // _________________ FILTER Method _____________________________________

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements);
// const deposits = movements.filter(function (trans) {
//   return trans > 0;
// });
// console.log(deposits);

// const withdrawals = movements.filter((trans) => {
//   return trans < 0;
// });
// console.log(withdrawals);


// // ______________________ REDUCE Method ___________________________________

// // const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// // const movements = [200, -200, 340, -300, -20, 50, 400, -460];
// const movements = [5000, 3400, -150, -790, -3210, -1000, 8500, -30];
// console.log(movements);
// const balance = movements.reduce(function (accumulator, current, index, arr) {
//   return accumulator + current;
// });

// console.log(balance);

// const maxMove = movements.reduce(function (acc, current) {
//   return current > acc ? current : acc;
// }, movements[0]);
// console.log(maxMove);

// const minMove = movements.reduce(function (acc, current) {
//   return current < acc ? current : acc;
// }, movements[0]);
// console.log(minMove);

// //_____________________ Challenge #2 ________________________________________
// const calcAverageHumanAge = function (ages) {
//   console.log(ages);
//   const humanAges = ages.map(function (age) {
//     return age <= 2 ? 2 * age : 16 + 4 * age;
//   });
//   const adultDogs = humanAges.filter(function (age) {
//     return age >= 18;
//   });
//   const average = adultDogs.reduce(function (acc, current) {
//     return acc + current;
//   }) / adultDogs.length;
//   console.log(humanAges);
//   console.log(adultDogs);
//   console.log(average);
// };

// const test1 = [5, 2, 4, 1, 15, 8, 3];
// const test2 = [16, 6, 10, 5, 6, 1, 4];
// calcAverageHumanAge(test1);

// //____________________ CHAINING MAGIC _____________________________
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// // const movements = [200, -200, 340, -300, -20, 50, 400, -460];
// // const movements = [5000, 3400, -150, -790, -3210, -1000, 8500, -30];
// // console.log(movements);
// const eurToUsd = 1.1;
// const totalDeposits = movements.filter(function (mov) {
//   return mov > 0;
// }).map(function (mov) {
//   return mov * eurToUsd;
// }).reduce(function (acc, current) {
//   return acc + current;
// });
// // console.log(totalDeposits);

// //________________________ FIND Method ______________________________________

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const firstWithdrawal = movements.find(function (mov) {
//   return mov < 0;
// });
// console.log(movements);
// console.log(firstWithdrawal); // return element itself, not an array

// console.log(accounts);
// const account = accounts.find(function (acc) {
//   return acc.owner === "Jessica Davis";
// });
// console.log(account);

// // __________________________ SOME Method ___________________________________
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements);
// console.log(movements.includes(450));
// console.log(movements.some(function (mov) {
//   return mov > 0;
// }));
// const anyDeposits = movements.some(function (mov) {
//   return mov > 0;
// });
// console.log(anyDeposits);

// //_____________________ EVERY Method ___________________________
// const movementss = [430, 1000, 700, 50, 90];
// console.log(movementss.every(function (mov) {
//   return mov > 0;
// }));


// // ____________________ FLAT Method ______________________________________
// const arr = [[1, 2], [3, 4]];
// console.log(arr.flat());

// const arrDeep = [[[1, 2], [3, 4], 5], [6, 7, 8]];
// console.log(arrDeep.flat());
// console.log(arrDeep.flat(2));

// console.log(accounts);
// const accountMovements = accounts.map(function (acc) {
//   return acc.movements;
// });
// console.log(accountMovements);
// const allMovements = accountMovements.flat();
// console.log(allMovements);

// const overallBalance = allMovements.reduce(function (acc, curr) {
//   return acc + curr;
// });
// console.log(overallBalance);

// console.log(accounts
//   .map(function (acc) { return acc.movements; })
//   .flat()
//   .reduce(function (acc, curr) { return acc + curr; })
// );


// // ____________________ FLATMAP Method _________________________________
// console.log(accounts
//   .flatMap(function (acc) { return acc.movements; })
//   .reduce(function (acc, curr) { return acc + curr; })
// );


// // ________________________ SORTING Arrays _________________________________
// const owners = ["SwamFire", "EchoEcho", "XLR8"];
// console.log(owners.sort());
// const numbers = [10, -1, 0, 2, 1];
// // SORT ASCENDING
// console.log(numbers.sort(function (a, b) {
//   return a - b;
// }));

// // SORT DESCENDING
// console.log(numbers.sort(function (a, b) {
//   return b - a;
// }));

// // _________________ Dynamic Array Creation and filling Array _________________
// const x = new Array(7);
// console.log(x);
// // x.fill(1);
// // console.log(x);

// // x.fill(1, 3);
// // console.log(x);

// x.fill(1, 3, 5);
// console.log(x);

// const arr = [1, 2, 3, 4, 5, 6, 7];
// arr.fill(23, 2, 6);
// console.log(arr);


// const y = Array.from({ length: 7 }, function () {
//   return 1;
// });
// console.log(y);
// const z = Array.from({ length: 7 }, function (curr, next) {
//   return next + 1;
// });
// console.log(z);

// labelBalance.addEventListener("click", function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll(".movements__value"),
//     function (mov) {
//       return Number(mov.textContent.replace("€", ""));
//     }
//   );
//   console.log(movementsUI);
// });


// // _________________________ Array Practice __________________________
// // // Exe.1
// // console.log(accounts);
// // // const bankDepositSum = accounts.map(acc => acc.movements);
// // // const bankDepositSum = accounts.map((acc) => (acc.movements)).flat();
// // const bankDepositSum = accounts.flatMap((acc) => (acc.movements)).reduce((acc, curr) => acc + curr);
// // console.log(bankDepositSum);

// // //Exe.2
// // // const numDeposits1000 = accounts.flatMap(acc => acc.movements).filter(mov => mov >= 1000).length;
// // const numDeposits1000 = accounts.flatMap(acc => acc.movements).reduce((acc, curr) => (curr >= 1000 ? acc + 1 : acc), 0);
// // console.log(numDeposits1000);

// //Exe.3
// // const { deposits, withdrawals } = accounts.flatMap(acc => acc.movements)
// //   .reduce((a, curr) => {
// //     (curr >= 0) ? (a.deposits += curr) : (a.withdrawals += curr);
// //     return a;
// //   }, { deposits: 0, withdrawals: 0 });

// // const { deposits, withdrawals } = accounts.flatMap(acc => acc.movements)
// //   .reduce((a, curr) => {
// //     a[(curr >= 0) ? "deposits" : "withdrawals"] += curr;
// //     return a;
// //   }, { deposits: 0, withdrawals: 0 });
// // // console.log(sums);
// // console.log(deposits, withdrawals);

// // Exe.4

// const convertTitleCase = function (title) {
//   const exceptions = ["a", "with", "or", "an", "the", "but", "in", "on", "and"];
//   const titleCase = title.toLowerCase().split(" ").map((word) => {
//     return exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1);
//   });
//   return titleCase;
// };
// console.log(convertTitleCase("this is title a case conversion EXAMPLE"));
// // console.log(convertTitleCase("this is title a case conversion EXAMPLE"))


// ____________________ CHALLENGE #4 ______________________________________
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];
// console.log(dogs);
dogs.forEach((dog) => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
// console.log(dogs);
const dogSarah = dogs.find((dog) => (dog.owners.includes("Sarah")));
console.log(dogSarah);
console.log(`Sarah\`s dog is eating ${dogSarah.curFood > dogSarah.recFood ? "too much" : "too little"}`);

const ownersEatTooMuch = dogs
  .filter((dog) => (dog.curFood > dog.recFood))
  .flatMap((dog) => (dog.owners));
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter((dog) => (dog.curFood < dog.recFood))
  .flatMap((dog) => (dog.owners));
console.log(ownersEatTooLittle);

console.log(`${ownersEatTooMuch.join(" and ")}\`s dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(" and ")}\`s dogs eat too little!`);

console.log(dogs.some((dog) => (dog.curFood === dog.recFood)));

const dogsEatingOk = dogs.filter((dog) => (dog.curFood >= dog.recFood * 0.9 && dog.curFood <= dog.recFood * 1.1));
console.log(dogsEatingOk);

const dogsSorted = dogs.slice().sort((a, b) => (a.recFood - b.recFood));
console.log(dogsSorted);