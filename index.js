var trump_speeches = "";
var nlp = window.nlp_compromise;
var tokens = [];


function createTokens() {
    var nlp_text = nlp.text(trump_speeches);
    var terms = nlp_text.terms();
    for (var i = 0; i < terms.length; i++) {
        tokens.push(terms[i].text);
    }
}


function chooseStartingToken() {
    var index = Math.floor(Math.random() * tokens.length);
    return tokens[index];
}


function findNextWord(prevWords) {
    var nextWords = [];
    for (var w = 0; w < tokens.length - 1; w++) {
        if (prevWords.length > 0 && w - prevWords.length > 0) {
            let matchNgram = true;
            for (let i = 0; i < prevWords.length; i++) {
                if (tokens[w - i] != prevWords[prevWords.length - 1 -i]) {
                    matchNgram = false;
                    break;
                }
            }
            if (matchNgram === true) {
                nextWords.push(tokens[w + 1]);
            }
        } 
    }
    var word = nextWords[Math.floor(Math.random() * nextWords.length)]; // choose a random next word
    return word;
}

function generate(len, gramlen) {
    var currentWord = chooseStartingToken();
    var prev = [];
    prev.push(currentWord);
    var sentence = currentWord + " ";
    var wordcount = 0;
    while (wordcount < len || currentWord.indexOf(".") < 0) { // while we haven't found a period
        currentWord = findNextWord(prev);
        sentence += currentWord + " ";
        prev.push(currentWord);
        if (prev.length > gramlen) {
            prev.shift();
        }
        wordcount++;
    }
    // return sentence;
    document.getElementById('speech').innerHTML = sentence;
    
}


function start() {
    const url = './speeches.txt';
    const GRAM_LEN = 2;
    const OUT_MIN_LEN = 20;
    fetch(url)
        .then(function (resp) {
            console.log('loading');
            resp.text().then(speech => {
                trump_speeches = speech;
                createTokens();
                generate(OUT_MIN_LEN, GRAM_LEN);
                console.log(`loaded, length ${OUT_MIN_LEN}, ${GRAM_LEN}-gram`);
            })
            document.getElementById("generate").addEventListener("click", () => generate(OUT_MIN_LEN, GRAM_LEN));
        })
        .catch(function (error) {
            console.log(error);
        });   
}

start();

