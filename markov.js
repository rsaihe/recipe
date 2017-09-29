var probs_cust;
var probs_cust_char;

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

    var words = text.split(/\s+/);
    for (var i = 0; i < 4; ++i) {
        var prevs = new Array(i + 1);
        prevs.fill('');
        for (var w = 0; w < words.length; ++w) {
            var word = words[w];
            var prev = prevs.join(' ');
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

    var words = text.split('');
    for (var i = 0; i < 10; ++i) {
        var prevs = new Array(i + 1);
        prevs.fill('');
        for (var w = 0; w < words.length; ++w) {
            var word = words[w];
            var prev = prevs.join('');
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
    var prevs = new Array(prev_count).fill('');
    var wordlist = [];
    if (typeof probs === 'undefined') return '&nbsp';

    for (var i = 0; i < count; ++i) {
        var prev = prevs.join(sep);
        var word = markov(prev, probs[prev_count - 1]);
        prevs.shift();
        prevs.push(word);
        wordlist.push(word);
    }

    var output = wordlist.join(sep);
    if (/^\s*$/.test(output)) {
        return '&nbsp;'
    } else {
        return output;
    }
}

function scanCustom() {
    var text = document.getElementById('custom-text').value;
    probs_cust = scan(text);
    probs_cust_char = scanChar(text);
}

function generate() {
    var type = document.getElementById('type').value;
    var count = parseInt(document.getElementById('count').value);
    var prec = parseInt(document.getElementById('precision').value);
    prec = prec < 1 ? 1 : prec;
    var text;
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
