let probs_cust;
let probs_cust_char;
let toUpdate = false;

function markov(prev, probs) {
    if (probs.hasOwnProperty(prev)) {
        return probs[prev][Math.floor(Math.random() * probs[prev].length)];
    } else {
        return '';
    }
}

function scan(text, probs) {
    if (typeof probs === 'undefined') {
        probs = [{}, {}, {}, {}];
    }

    let words = text.split(/\s+/);
    for (let i = 0; i < 4; ++i) {
        let prevs = new Array(i + 1);
        prevs.fill('');
        for (let w = 0; w < words.length; ++w) {
            let word = words[w];
            let prev = prevs.join(' ');
            if (!probs[i].hasOwnProperty(prev)) {
                probs[i][prev] = [];
            }
            probs[i][prev].push(word);
            prevs.shift();
            prevs.push(word);
        }
    }

    return probs;
}

function scanChar(text, probs) {
    if (typeof probs === 'undefined') {
        probs = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
    }

    let words = text.split('');
    for (let i = 0; i < 10; ++i) {
        let prevs = new Array(i + 1);
        prevs.fill('');
        for (let w = 0; w < words.length; ++w) {
            let word = words[w];
            let prev = prevs.join('');
            if (!probs[i].hasOwnProperty(prev)) {
                probs[i][prev] = [];
            }
            probs[i][prev].push(word);
            prevs.shift();
            prevs.push(word);
        }
    }

    return probs;
}

function markovGen(count, probs, prev_count, sep) {
    let prevs = new Array(prev_count).fill('');
    let wordlist = [];
    if (typeof probs === 'undefined') return '&nbsp';

    for (let i = 0; i < count; ++i) {
        let prev = prevs.join(sep);
        let word = markov(prev, probs[prev_count - 1]);
        prevs.shift();
        prevs.push(word);
        wordlist.push(word);
    }

    let output = wordlist.join(sep);
    if (/^\s*$/.test(output)) {
        return '&nbsp;'
    } else {
        return output;
    }
}

function scanCustom() {
    let custText = document.getElementById('custom-text').value;
    probs_cust = scan(custText);
    probs_cust_char = scanChar(custText);
}

function generate() {
    // Update custom text
    if (toUpdate) {
        let custText = document.getElementById('custom-text').value;
        probs_cust = scan(custText)
        probs_cust_char = scanChar(custText);
        toUpdate = false;
    }

    let type = document.getElementById('type').value;
    let count = parseInt(document.getElementById('count').value);
    let prec = parseInt(document.getElementById('precision').value);
    prec = prec < 1 ? 1 : prec;
    let text;
    switch (type) {
        case 'char':
            text = doChars(count, prec);
            break;
        case 'love':
            text = doLovecraft(count, prec);
            break;
        case 'recipe':
            text = doRecipe(count, prec);
            break;
        case 'cust':
            text = doCustom(count, prec);
            break;
        case 'custchar':
            text = doCustomChars(count, prec);
            break;
    }
    document.getElementById('output-text').innerHTML = text;
}

function doRecipe(c, p) {
    return markovGen(c < 1 ? 30 : c, probs_recipe, p > 4 ? 4 : p, ' ');
}

function doLovecraft(c, p) {
    return markovGen(c < 1 ? 30 : c, probs, p > 4 ? 4 : p, ' ');
}

function doChars(c, p) {
    return markovGen(c < 1 ? 200 : c, probs_char, p > 10 ? 10 : p, '');
}

function doCustom(c, p) {
    return markovGen(c < 1 ? 30 : c, probs_cust, p > 4 ? 4 : p, ' ');
}

function doCustomChars(c, p) {
    return markovGen(c < 1 ? 200 : c, probs_cust_char, p > 10 ? 10 : p, '');
}
