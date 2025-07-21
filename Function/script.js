const positiveWords = [
    'amazing', 'awesome', 'excellent', 'fantastic', 'great', 'love', 'wonderful',
    'brilliant', 'outstanding', 'perfect', 'superb', 'incredible', 'magnificent',
    'marvelous', 'spectacular', 'terrific', 'fabulous', 'good', 'nice', 'happy',
    'excited', 'thrilled', 'delighted', 'pleased', 'satisfied', 'beautiful',
    'gorgeous', 'stunning', 'impressive', 'remarkable', 'exceptional', 'phenomenal'
];

const negativeWords = [
    'awful', 'terrible', 'horrible', 'bad', 'worst', 'hate', 'disgusting',
    'pathetic', 'useless', 'disappointing', 'annoying', 'frustrating', 'boring',
    'stupid', 'ridiculous', 'waste', 'disaster', 'failure', 'poor', 'sad',
    'angry', 'upset', 'depressed', 'miserable', 'unhappy', 'worried', 'scared',
    'stressed', 'anxious', 'concerned', 'troubled', 'disturbed', 'uncomfortable'
];

const intensifiers = {
    'very': 1.5,
    'extremely': 2.0,
    'incredibly': 1.8,
    'absolutely': 1.7,
    'totally': 1.6,
    'completely': 1.5,
    'really': 1.3,
    'quite': 1.2,
    'rather': 1.1,
    'somewhat': 0.8,
    'slightly': 0.7,
    'barely': 0.6,
    'hardly': 0.5
};

function setExample(text) {
    document.getElementById('textInput').value = text;
}

function clearAll() {
    document.getElementById('textInput').value = '';
    document.getElementById('results').style.display = 'none';
}

function analyzeSentiment() {
    const text = document.getElementById('textInput').value.trim();
    
    if (!text) {
        alert('Please enter some text to analyze!');
        return;
    }

    document.getElementById('loading').style.display = 'block';
    document.getElementById('results').style.display = 'none';

    setTimeout(() => {
        const analysis = performSentimentAnalysis(text);
        displayResults(analysis);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('results').style.display = 'block';
    }, 1500);
}

function performSentimentAnalysis(text) {
    const words = text.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(word => word.length > 0);
    let positiveScore = 0, negativeScore = 0, wordCount = words.length;

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        let multiplier = 1;
        if (i > 0 && intensifiers[words[i - 1]]) multiplier = intensifiers[words[i - 1]];
        if (positiveWords.includes(word)) positiveScore += multiplier;
        else if (negativeWords.includes(word)) negativeScore += multiplier;
    }

    const totalScore = positiveScore - negativeScore;
    const normalizedScore = Math.max(-1, Math.min(1, totalScore / Math.max(1, wordCount * 0.3)));

    let sentiment, confidence;
    if (normalizedScore > 0.1) {
        sentiment = 'positive';
        confidence = Math.min(95, 50 + (normalizedScore * 45));
    } else if (normalizedScore < -0.1) {
        sentiment = 'negative';
        confidence = Math.min(95, 50 + (Math.abs(normalizedScore) * 45));
    } else {
        sentiment = 'neutral';
        confidence = Math.max(60, 80 - (Math.abs(normalizedScore) * 20));
    }

    return {
        sentiment,
        score: normalizedScore,
        confidence: Math.round(confidence),
        wordCount,
        positiveWords: positiveScore,
        negativeWords: negativeScore
    };
}

function displayResults(analysis) {
    document.getElementById('sentimentBadge').textContent = `${analysis.sentiment.toUpperCase()} SENTIMENT`;
    document.getElementById('sentimentBadge').className = `sentiment-badge ${analysis.sentiment}`;

    const fill = document.getElementById('confidenceFill');
    fill.style.width = `${analysis.confidence}%`;
    fill.className = `confidence-fill ${analysis.sentiment}`;

    document.getElementById('confidenceValue').textContent = `${analysis.confidence}%`;
    document.getElementById('wordCount').textContent = analysis.wordCount;
    document.getElementById('sentimentScore').textContent = analysis.score.toFixed(2);
}

document.getElementById('textInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
        analyzeSentiment();
    }
});
