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
    
    // Additional elements
    const overallDescription = document.getElementById('overallDescription');
    const listeningDescription = document.getElementById('listeningDescription');
    const readingDescription = document.getElementById('readingDescription');
    const writingDescription = document.getElementById('writingDescription');
    const speakingDescription = document.getElementById('speakingDescription');
    const listeningCorrect = document.getElementById('listeningCorrect');
    const readingCorrect = document.getElementById('readingCorrect');
    const writingTask = document.getElementById('writingTask');
    const writingCoherence = document.getElementById('writingCoherence');
    const speakingFluency = document.getElementById('speakingFluency');
    const speakingPronunciation = document.getElementById('speakingPronunciation');
    const strengthsList = document.getElementById('strengthsList');
    const improvementList = document.getElementById('improvementList');
    const overallProgress = document.getElementById('overallProgress');

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
        // Simulate loading
        searchBtn.disabled = true;
        searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
        
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
            })
            .finally(() => {
                searchBtn.disabled = false;
                searchBtn.innerHTML = '<i class="fas fa-arrow-right"></i> View Results';
            });
    }

    function displayResult(student) {
        errorMsg.style.display = 'none';
        
        // Set student info
        resultSymbol.textContent = student.symbol;
        resultName.textContent = student.name;
        
        // Set scores with appropriate color classes
        setBandScore(overallScore, student.overall);
        setBandScore(listeningScore, student.listening);
        setBandScore(readingScore, student.reading);
        setBandScore(writingScore, student.writing);
        setBandScore(speakingScore, student.speaking);
        
        // Set band descriptions
        overallDescription.textContent = getBandDescription(student.overall);
        listeningDescription.textContent = getBandDescription(student.listening);
        readingDescription.textContent = getBandDescription(student.reading);
        writingDescription.textContent = getBandDescription(student.writing);
        speakingDescription.textContent = getBandDescription(student.speaking);
        
        // Set additional details
        listeningCorrect.textContent = calculateCorrectAnswers(student.listening);
        readingCorrect.textContent = calculateCorrectAnswers(student.reading);
        writingTask.textContent = student.writing;
        writingCoherence.textContent = Math.max(student.writing - 0.5, 1).toFixed(1);
        speakingFluency.textContent = student.speaking;
        speakingPronunciation.textContent = (student.speaking - 0.5).toFixed(1);
        
        // Set progress bar
        overallProgress.style.width = `${(student.overall / 9) * 100}%`;
        
        // Set comments
        examinerComments.textContent = student.comments;
        
        // Set strengths and improvements
        setStrengthsAndImprovements(student);
        
        // Show result section
        resultSection.classList.remove('hidden');
        
        // Scroll to results
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    function setBandScore(element, score) {
        element.textContent = score;
        element.className = 'band-score band-' + Math.floor(score);
    }

    function calculateCorrectAnswers(score) {
        // Simplified calculation for demo purposes
        if (score >= 8.5) return 39;
        if (score >= 8.0) return 37;
        if (score >= 7.5) return 35;
        if (score >= 7.0) return 32;
        if (score >= 6.5) return 29;
        if (score >= 6.0) return 26;
        if (score >= 5.5) return 23;
        if (score >= 5.0) return 19;
        if (score >= 4.5) return 15;
        return 12;
    }

    function getBandDescription(score) {
        const band = Math.floor(score);
        const descriptions = {
            9: "Expert user - Full operational command of the language",
            8: "Very good user - Fully operational command with occasional inaccuracies",
            7: "Good user - Operational command though with occasional inaccuracies",
            6: "Competent user - Generally effective command despite some inaccuracies",
            5: "Modest user - Partial command of the language coping with overall meaning",
            4: "Limited user - Basic competence is limited to familiar situations"
        };
        return descriptions[band] || "Basic user - Conveys only general meaning with frequent breakdowns";
    }

    function setStrengthsAndImprovements(student) {
        // Clear previous items
        strengthsList.innerHTML = '';
        improvementList.innerHTML = '';
        
        // Generate strengths based on scores
        const strengths = [];
        const improvements = [];
        
        if (student.listening >= 7.5) {
            strengths.push("Excellent listening comprehension skills");
        } else if (student.listening <= 6.0) {
            improvements.push("Need more practice with different English accents");
        }
        
        if (student.reading >= 7.5) {
            strengths.push("Strong reading comprehension and skimming skills");
        } else if (student.reading <= 6.0) {
            improvements.push("Improve reading speed and vocabulary range");
        }
        
        if (student.writing >= 7.0) {
            strengths.push("Good academic writing style");
        } else if (student.writing <= 6.0) {
            improvements.push("Work on writing task achievement and coherence");
        }
        
        if (student.speaking >= 7.0) {
            strengths.push("Fluent speaking with good pronunciation");
        } else if (student.speaking <= 6.0) {
            improvements.push("Practice speaking fluency and grammatical range");
        }
        
        // Add default items if none
        if (strengths.length === 0) {
            strengths.push("Good foundation in English language skills");
        }
        
        if (improvements.length === 0) {
            improvements.push("Continue practicing all skills to maintain current level");
        }
        
        // Add to DOM
        strengths.forEach(strength => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check-circle"></i> ${strength}`;
            strengthsList.appendChild(li);
        });
        
        improvements.forEach(improvement => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${improvement}`;
            improvementList.appendChild(li);
        });
    }

    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
        resultSection.classList.add('hidden');
    }
});
