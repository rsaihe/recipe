String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function markov(prev, probs) {
    if (probs.hasOwnProperty(prev)) {
        return probs[prev][Math.floor(Math.random() * probs[prev].length)];
    } else {
        return '';
    }
}

function markov_gen(count, probs, prev_count) {
    var prevs = new Array(prev_count).fill('');
    var wordlist = [];

    for (var i = 0; i < count; ++i) {
        var prev = prevs.join(' ');
        var word = markov(prev, probs[prev_count - 1]);
        prevs.shift();
        prevs.push(word);
        wordlist.push(word);
    }

    return wordlist.join(' ');
}

function markov_gen_char(count, probs, prev_count) {
    var prevs = new Array(prev_count).fill('');
    var wordlist = [];

    for (var i = 0; i < count; ++i) {
        var prev = prevs.join('');
        var word = markov(prev, probs[prev_count - 1]);
        prevs.shift();
        prevs.push(word);
        wordlist.push(word);
    }

    return wordlist.join('');
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
    }
    document.getElementById('output-text').innerHTML = text;
}

function doRecipe(c, p) {
    return markov_gen(c < 1 ? 30 : c, probs_recipe, p > 4 ? 4 : p);
}

function doLovecraft(c, p) {
    return markov_gen(c < 1 ? 30 : c, probs, p > 4 ? 4 : p);
}

function doChars(c, p) {
    return markov_gen_char(c < 1 ? 200 : c, probs_char, p > 10 ? 10 : p);
}
