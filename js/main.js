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
        if (e.key === 'Enter') {
            searchResult();
        }
    });

    function searchResult() {
        const symbol = symbolInput.value.trim().toUpperCase();
        
        if (!symbol) {
            showError('Please enter your symbol number');
            return;
        }

        fetchResults(symbol);
    }

    function fetchResults(symbol) {
        // In a real implementation, you would fetch from an API
        // Here we're using the local JSON data
        fetch('/_data/students.json')
            .then(response => response.json())
            .then(data => {
                const student = data.students.find(s => s.symbol === symbol);
                
                if (student) {
                    displayResult(student);
                } else {
                    showError('Symbol number not found. Please check and try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showError('An error occurred while fetching results. Please try again later.');
            });
    }

    function displayResult(student) {
        errorMsg.style.display = 'none';
        
        // Set student info
        resultSymbol.textContent = student.symbol;
        resultName.textContent = student.name;
        
        // Set scores with appropriate color classes
        overallScore.textContent = student.overall;
        overallScore.className = 'band-score band-' + Math.floor(student.overall);
        
        listeningScore.textContent = student.listening;
        listeningScore.className = 'band-score band-' + Math.floor(student.listening);
        
        readingScore.textContent = student.reading;
        readingScore.className = 'band-score band-' + Math.floor(student.reading);
        
        writingScore.textContent = student.writing;
        writingScore.className = 'band-score band-' + Math.floor(student.writing);
        
        speakingScore.textContent = student.speaking;
        speakingScore.className = 'band-score band-' + Math.floor(student.speaking);
        
        // Set comments
        examinerComments.textContent = student.comments;
        
        // Show result section
        resultSection.classList.remove('hidden');
        
        // Scroll to results
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
        resultSection.classList.add('hidden');
    }
});
