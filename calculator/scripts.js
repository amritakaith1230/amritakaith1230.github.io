let displayValue = '';

function appendToDisplay(value) {
    displayValue += value;
    document.getElementById('display').textContent = displayValue;
}

function clearDisplay() {
    displayValue = '';
    document.getElementById('display').textContent = '0';
}

function deleteChar() {
    displayValue = displayValue.slice(0, -1);
    document.getElementById('display').textContent = displayValue || '0';
}

function calculatePercentage() {
    if (displayValue) {
        displayValue = (parseFloat(displayValue) / 100).toString();
        document.getElementById('display').textContent = displayValue;
    }
}

function calculateResult() {
    try {
        displayValue = eval(displayValue).toString();
        document.getElementById('display').textContent = displayValue;
    } catch (error) {
        document.getElementById('display').textContent = 'Error';
    }
}
