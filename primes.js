for (let i = 2; ; i++) {
    let isDivisible = false;
    for (let j = 2; j < i; j++) {
        if (i % j == 0) {
            isDivisible = true;
            break;
        }
    }

    if (!isDivisible) {
        console.log(`${i} is a prime number`);
    }
}