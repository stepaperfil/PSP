function fill(arraySize, data) {
    const accountSlots = [];
    for (let i = 0; i < arraySize; i++) {
        accountSlots.push(
            data !== null && typeof data === 'object' ? { ...data } : data
        );
    }
    return accountSlots;
}


function isEqualObj(firstAccount, secondAccount) {
    if (
        typeof firstAccount  !== 'object' || firstAccount  === null || Array.isArray(firstAccount)  ||
        typeof secondAccount !== 'object' || secondAccount === null || Array.isArray(secondAccount)
    ) {
        return false;
    }

    const firstKeys  = Object.keys(firstAccount);
    const secondKeys = Object.keys(secondAccount);

    if (firstKeys.length !== secondKeys.length) return false;

    for (const key of firstKeys) {
        const firstVal  = firstAccount[key];
        const secondVal = secondAccount[key];

        const bothObjects =
            firstVal  !== null && typeof firstVal  === 'object' &&
            secondVal !== null && typeof secondVal === 'object';

        if (bothObjects) {
            if (!isEqualObj(firstVal, secondVal)) return false;
        } else {
            if (firstVal !== secondVal) return false;
        }
    }

    return true;
}


function canBeRearranged(firstClientProducts, secondClientProducts) {
    if (firstClientProducts.length !== secondClientProducts.length) {
        return {
            result: false,
            report: `Наборы продуктов не совпадают: ` +
                    `у первого клиента ${firstClientProducts.length} продукт(а/ов), ` +
                    `у второго — ${secondClientProducts.length}.`
        };
    }

    const frequencyMap = {};
    firstClientProducts.forEach(productId => {
        frequencyMap[productId] = (frequencyMap[productId] || 0) + 1;
    });

    const productKeys = Object.keys(frequencyMap);
    let keyIndex = 0;
    let mismatchedProduct = null;

    do {
        const productId = productKeys[keyIndex];
        const countInSecond = secondClientProducts.filter(id => String(id) === productId).length;

        if (frequencyMap[productId] !== countInSecond) {
            mismatchedProduct = productId;
            break;
        }
        keyIndex++;
    } while (keyIndex < productKeys.length);

    const result = mismatchedProduct === null;

    const report = result
        ? ` Наборы совпадают! Портфели клиентов идентичны: [${firstClientProducts.join(', ')}].`
        : ` Наборы не совпадают: расхождение по продукту с ID "${mismatchedProduct}".`;

    return { result, report };
}


function groupAnagrams(productNames) {
    const anagramMap = {};

    productNames.forEach(name => {
        const key = name.toLowerCase().split('').sort().join('');
        if (!anagramMap[key]) anagramMap[key] = [];
        anagramMap[key].push(name);
    });

    return Object.values(anagramMap)
        .filter(group => group.length >= 2)
        .map(group => group.slice().sort())
        .sort((a, b) => a[0].localeCompare(b[0]));
}



console.log('='.repeat(55));
console.log('  Задание 1.9 — fill');
console.log('='.repeat(55));

const accountTemplate = { balance: 0, currency: 'RUB', status: 'новый' };
const accountSlots = fill(3, accountTemplate);
console.log('fill(3, { balance: 0, currency: "RUB", status: "новый" })');
console.log(accountSlots);

console.log('fill(4, "пусто")');
console.log(fill(4, 'пусто'));


console.log('\n' + '='.repeat(55));
console.log('  Задание 1.7 — isEqualObj');
console.log('='.repeat(55));

const accountA = { accountNumber: '40817810', currency: 'RUB', balance: 5000 };
const accountB = { accountNumber: '40817810', currency: 'RUB', balance: 5000 };
const accountC = { accountNumber: '40817810', currency: 'USD', balance: 5000 };
const accountD = { accountNumber: '40817810', currency: 'RUB', balance: 5000, limit: { daily: 100000 } };
const accountE = { accountNumber: '40817810', currency: 'RUB', balance: 5000, limit: { daily: 100000 } };

console.log('accountA:', accountA);
console.log('accountB:', accountB);
console.log('accountC:', accountC);
console.log('accountD:', accountD);
console.log('accountE:', accountE);
console.log();
console.log('isEqualObj(accountA, accountB) =>', isEqualObj(accountA, accountB));
console.log('isEqualObj(accountA, accountC) =>', isEqualObj(accountA, accountC));
console.log('isEqualObj(accountD, accountE) =>', isEqualObj(accountD, accountE));
console.log('isEqualObj(accountA, accountD) =>', isEqualObj(accountA, accountD));


console.log('\n' + '='.repeat(55));
console.log('  Задание 2.9 — canBeRearranged');
console.log('='.repeat(55));

const clientAlpha = [1, 2, 3];
const clientBeta  = [3, 1, 2];
const clientGamma = [1, 2, 4];

console.log('clientAlpha:', clientAlpha);
console.log('clientBeta: ', clientBeta);
console.log('clientGamma:', clientGamma);
console.log();

const case1 = canBeRearranged(clientAlpha, clientBeta);
console.log('canBeRearranged(clientAlpha, clientBeta):');
console.log(' result:', case1.result);
console.log(' report:', case1.report);

const case2 = canBeRearranged(clientAlpha, clientGamma);
console.log('\ncanBeRearranged(clientAlpha, clientGamma):');
console.log(' result:', case2.result);
console.log(' report:', case2.report);

const case3 = canBeRearranged([1, 2], [1, 2, 3]);
console.log('\ncanBeRearranged([1,2], [1,2,3]) — разная длина:');
console.log(' result:', case3.result);
console.log(' report:', case3.report);


console.log('\n' + '='.repeat(55));
console.log('  Задание 3.5 — groupAnagrams');
console.log('='.repeat(55));

const productCodes = ['карта', 'ратка', 'кредит', 'акрат', 'тикред', 'депозит', 'вклад', 'далвк'];
console.log('Входные коды продуктов:', productCodes);
console.log();

const groups = groupAnagrams(productCodes);
groups.forEach((group, i) => {
    console.log(`Группа ${i + 1}:`, group);
});

console.log('\n' + '='.repeat(55));
