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


function findNextWord(currentWord) {
    var nextWords = [];
    for (var w = 0; w < tokens.length - 1; w++) {
        if (tokens[w] == currentWord) {
            nextWords.push(tokens[w + 1]);
        }
    }
    var word = nextWords[Math.floor(Math.random() * nextWords.length)]; // choose a random next word
    return word;
}

function generate(num) {
    var currentWord = chooseStartingToken();
    var sentence = currentWord + " ";
    var wordcount = 0;
    while (wordcount < num || currentWord.indexOf(".") < 0) { // while we haven't found a period
        currentWord = findNextWord(currentWord);
        sentence += currentWord + " ";
        wordcount++;
    }
    // return sentence;
    document.getElementById('speech').innerHTML = sentence;
    
}


function start() {
    const url = './speeches.txt';
    fetch(url)
        .then(function (resp) {
            console.log('loading');
            resp.text().then(speech => {
                trump_speeches = speech;
                createTokens();
                generate(20);
                console.log('loaded');
            })
            document.getElementById("generate").addEventListener("click", () => generate(20));
        })
        .catch(function (error) {
            console.log(error);
        });   
}

start();

