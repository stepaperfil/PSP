window.onload = function() {
    let expression = '';
    let preview = '';
    let justEvaluated = false;

    const BINARY_OPERATORS = ['+', '-', '*', '/', '×'];

    const resultValueSpan = document.querySelector('#result .result-value');
    const previewDiv = document.getElementById('preview');

    const resultDiv = document.getElementById('result');
    if (previewDiv && resultDiv && previewDiv.parentNode !== resultDiv) {
        resultDiv.appendChild(previewDiv);
    }

    const signButton = document.getElementById('btn_op_sign');
    if (signButton) signButton.textContent = '±';

    function updateDisplay() {
        resultValueSpan.textContent = expression || '0';
        previewDiv.textContent = preview ? '=' + preview : '';
        resultValueSpan.scrollLeft = resultValueSpan.scrollWidth;
        previewDiv.scrollLeft = previewDiv.scrollWidth;
    }


    function findLastBinaryOperatorIndex(expr) {
        let lastOpIndex = -1;
        let i = 0;
        while (i < expr.length) {
            const ch = expr[i];
            if (BINARY_OPERATORS.includes(ch)) {

                if (ch === '-') {

                    if (i === 0 || BINARY_OPERATORS.includes(expr[i-1]) || expr[i-1] === '(') {
                        i++;
                        continue;
                    }
                }

                lastOpIndex = i;
            }
            i++;
        }
        return lastOpIndex;
    }

    function getLastToken() {
        if (!expression) return null;
        const lastOpIndex = findLastBinaryOperatorIndex(expression);
        const token = expression.substring(lastOpIndex + 1);
        return { token, start: lastOpIndex + 1 };
    }

    function evaluateExpression(expr) {
        if (!expr) return null;

        const safeSqrt = (x) => {
            if (x < 0) throw new Error('Корень из отрицательного числа');
            return Math.sqrt(x);
        };

        let evalStr = expr
            .replace(/×/g, '*')
            .replace(/\^2/g, '**2')
            .replace(/√\(/g, 'safeSqrt(')
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/lg\(/g, 'Math.log10(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/(?:\(?)(-?\d+(?:\.\d+)?)(?:\)?)!/g, 'factorial($1)');

        try {
            const factorial = (n) => {
                n = Number(n);
                if (n < 0 || !Number.isInteger(n)) return NaN;
                let result = 1;
                for (let i = 2; i <= n; i++) result *= i;
                return result;
            };
            const func = new Function('factorial', 'safeSqrt', 'return ' + evalStr);
            const result = func(factorial, safeSqrt);
            return isFinite(result) ? result.toString() : 'Ошибка';
        } catch {
            return 'Ошибка';
        }
    }

    function formatResultForDisplay(resultStr) {
        if (resultStr === 'Ошибка') return resultStr;
        if (resultStr.length > 15) {
            const num = Number(resultStr);
            if (!isNaN(num) && isFinite(num)) return num.toPrecision(10);
        }
        return resultStr;
    }

    function updatePreview() {
        if (!expression || justEvaluated) {
            preview = '';
        } else {
            const result = evaluateExpression(expression);
            preview = (result && result !== 'Ошибка') ? formatResultForDisplay(result) : '';
        }
        updateDisplay();
    }

    document.querySelectorAll('[id^="btn_digit_"]').forEach(btn => {
        btn.onclick = function() {
            const digit = btn.textContent;
            if (justEvaluated) {
                expression = preview || '';
                preview = '';
                justEvaluated = false;
            }
            const tokenInfo = getLastToken();
            const token = tokenInfo ? tokenInfo.token : '';
            if (digit === '.') {
                if (token.includes('.')) return;
                expression += token === '' ? '0.' : '.';
            } else {
                if (token === '0') {
                    expression = expression.slice(0, -1) + digit;
                } else {
                    expression += digit;
                }
            }
            updatePreview();
        };
    });

    function handleBinaryOperation(opDisplay) {
        if (justEvaluated) {
            expression = preview || '';
            preview = '';
            justEvaluated = false;
        }
        if (!expression) return;
        const lastChar = expression[expression.length - 1];
        if (BINARY_OPERATORS.includes(lastChar)) {
            expression = expression.slice(0, -1) + opDisplay;
        } else {
            expression += opDisplay;
        }
        updatePreview();
    }

    document.getElementById('btn_op_plus').onclick = () => handleBinaryOperation('+');
    document.getElementById('btn_op_minus').onclick = () => handleBinaryOperation('-');
    document.getElementById('btn_op_mult').onclick = () => handleBinaryOperation('×');
    document.getElementById('btn_op_div').onclick = () => handleBinaryOperation('/');

    function handleUnaryOperation(transformFunc) {
        if (justEvaluated) {
            expression = preview || '';
            preview = '';
            justEvaluated = false;
        }
        const tokenInfo = getLastToken();
        if (!tokenInfo) return;
        const { token, start } = tokenInfo;
        if (!token) return;
        expression = expression.substring(0, start) + transformFunc(token);
        updatePreview();
    }

    document.getElementById('btn_op_square').onclick = () => handleUnaryOperation(t => `(${t})^2`);
    document.getElementById('btn_op_sqrt').onclick = () => handleUnaryOperation(t => `√(${t})`);
    document.getElementById('btn_op_factorial').onclick = () => handleUnaryOperation(t => `${t}!`);
    document.getElementById('btn_op_sin').onclick = () => handleUnaryOperation(t => `sin(${t})`);
    document.getElementById('btn_op_cos').onclick = () => handleUnaryOperation(t => `cos(${t})`);
    document.getElementById('btn_op_lg').onclick = () => handleUnaryOperation(t => `lg(${t})`);
    document.getElementById('btn_op_ln').onclick = () => handleUnaryOperation(t => `ln(${t})`);
    if (signButton) signButton.onclick = () => handleUnaryOperation(t => `(-${t})`);
    document.getElementById('btn_op_reciprocal').onclick = () => handleUnaryOperation(t => `(1/(${t}))`);

    document.getElementById('btn_op_percent').onclick = function() {
        if (justEvaluated) {
            expression = preview || '';
            preview = '';
            justEvaluated = false;
        }
        if (!expression) return;

        // Используем ту же функцию поиска последнего бинарного оператора
        let lastOpIndex = findLastBinaryOperatorIndex(expression);

        const token = expression.substring(lastOpIndex + 1);
        if (!token) return;

        const num = Number(token);
        if (isNaN(num)) return;

        let newToken;
        if (lastOpIndex === -1) {
            newToken = (num / 100).toString();
        } else {
            const op = expression[lastOpIndex];
            const firstPart = expression.substring(0, lastOpIndex);
            let firstOpIndex = findLastBinaryOperatorIndex(firstPart);
            const firstToken = firstPart.substring(firstOpIndex + 1);
            const firstNum = Number(firstToken);
            if (isNaN(firstNum)) return;

            if (op === '+' || op === '-') {
                newToken = (firstNum * num / 100).toString();
            } else {
                newToken = (num / 100).toString();
            }
        }

        expression = expression.substring(0, lastOpIndex + 1) + newToken;
        updatePreview();
    };

    document.getElementById('btn_op_000').onclick = function() {
        if (justEvaluated) {
            expression = preview || '';
            preview = '';
            justEvaluated = false;
        }

        const tokenInfo = getLastToken();
        if (!tokenInfo) {
            expression = '000';
            updatePreview();
            return;
        }

        const { token, start } = tokenInfo;

        if (token === '') {
            expression += '000';
        } else if (token === '0') {
            expression = expression.substring(0, start) + '000';
        } else if (/^0+$/.test(token) && token.length >= 3) {
            return;
        } else {
            expression = expression.substring(0, start) + token + '000';
        }

        updatePreview();
    };

    document.getElementById('btn_op_equal').onclick = function() {
        if (!expression || justEvaluated) return;
        const result = evaluateExpression(expression);
        if (result && result !== 'Ошибка') {
            expression = result;
            preview = '';
            justEvaluated = true;
        } else {
            expression = 'Ошибка';
            preview = '';
            justEvaluated = true;
        }
        updateDisplay();
    };

    document.getElementById('btn_op_clear').onclick = function() {
        expression = '';
        preview = '';
        justEvaluated = false;
        updateDisplay();
    };

    document.getElementById('btn_op_backspace').onclick = function() {
        if (justEvaluated) {
            expression = preview || '';
            preview = '';
            justEvaluated = false;
        }
        expression = expression.slice(0, -1);
        updatePreview();
    };

    let memory = 0;
    document.getElementById('btn_op_mplus_text').onclick = function() {
        const val = preview ? Number(preview) : (expression ? Number(expression) : 0);
        memory += val;
    };
    document.getElementById('btn_op_mminus_text').onclick = function() {
        const val = preview ? Number(preview) : (expression ? Number(expression) : 0);
        memory -= val;
    };

    const bgColors = [
        'linear-gradient(135deg, #3a1a6a, #b07cf0)',
        'linear-gradient(135deg, #1e3c72, #2a5298)',
        'linear-gradient(135deg, #4568DC, #B06AB3)',
        'linear-gradient(135deg, #43C6AC, #F8FFAE)',
        'linear-gradient(135deg, #FF512F, #DD2476)'
    ];
    let bgIndex = 0;
    document.getElementById('btn_op_bgcolor').onclick = function() {
        bgIndex = (bgIndex + 1) % bgColors.length;
        document.body.style.background = bgColors[bgIndex];
    };

    const resultColors = ['rgba(0,0,0,0.3)', '#2c3e50', '#8e44ad', '#16a085', '#c0392b'];
    let resColorIndex = 0;
    document.getElementById('btn_op_resultcolor').onclick = function() {
        resColorIndex = (resColorIndex + 1) % resultColors.length;
        document.querySelector('.result').style.backgroundColor = resultColors[resColorIndex];
    };

    updateDisplay();
};
