document.addEventListener('DOMContentLoaded', function() {
    const symbolInput = document.getElementById('symbolInput');
    const searchBtn = document.getElementById('searchBtn');
    const errorMsg = document.getElementById('errorMsg');
    const resultSection = document.getElementById('resultSection');
    
    // Result elements
    const resultSymbol = document.getElementById('resultSymbol');
    const resultName = document.getElementById('resultName');
    const overallScore = document.getElementById('overallScore');
    const listeningScore = document.getElementById('listeningScore');
    const readingScore = document.getElementById('readingScore');
    const writingScore = document.getElementById('writingScore');
    const speakingScore = document.getElementById('speakingScore');
    const examinerComments = document.getElementById('examinerComments');

    searchBtn.addEventListener('click', searchResult);
    symbolInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchResult();
    });

    function searchResult() {
        const symbol = symbolInput.value.trim().toUpperCase();
        
        if (!symbol) {
            showError('Please enter a symbol number');
            return;
        }

        fetchResult(symbol);
    }

    function fetchResult(symbol) {
        // Show loading state
        searchBtn.disabled = true;
        searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
        
        fetch('data/students.json')
            .then(response => {
                if (!response.ok) throw new Error('Network error');
                return response.json();
            })
            .then(data => {
                const student = data.students.find(s => s.symbol === symbol);
                if (student) {
                    displayResult(student);
                } else {
                    showError('Symbol number not found');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showError('Failed to load results. Please try again.');
            })
            .finally(() => {
                searchBtn.disabled = false;
                searchBtn.innerHTML = '<i class="fas fa-search"></i> Search';
            });
    }

    function displayResult(student) {
        errorMsg.style.display = 'none';
        
        // Set student info
        resultSymbol.textContent = student.symbol;
        resultName.textContent = student.name;
        
        // Set scores
        setBandScore(overallScore, student.overall);
        setBandScore(listeningScore, student.listening);
        setBandScore(readingScore, student.reading);
        setBandScore(writingScore, student.writing);
        setBandScore(speakingScore, student.speaking);
        
        // Set comments
        examinerComments.textContent = student.comments;
        
        // Show result
        resultSection.classList.remove('hidden');
    }

    function setBandScore(element, score) {
        element.textContent = score;
        element.className = 'band-score band-' + Math.floor(score);
    }

    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
        resultSection.classList.add('hidden');
    }
});
