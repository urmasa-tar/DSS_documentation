// manual/static/manual/js/diagnostic.js

class DiagnosticSystem {
    constructor(data) {
        this.questions = data.questions;
        this.currentQuestionId = 1;
        this.answerHistory = [];
        this.currentStep = 1;
        this.totalSteps = 3; // Можно динамически вычислять
        
        this.init();
    }
    
    init() {
        this.loadQuestion(this.currentQuestionId);
        this.updateProgress();
        this.setupEventListeners();
    }
    
    loadQuestion(questionId) {
        const question = this.questions.find(q => q.id === questionId);
        if (!question) return;
        
        const questionArea = document.getElementById('question-area');
        
        if (question.is_final) {
            this.showSolution(question.solution);
            return;
        }
        
        let html = `
            <div class="diagnostic-question fade-in">
                <h4 class="mb-4">${question.text}</h4>
                <div class="row">
        `;
        
        question.answers.forEach((answer, index) => {
            html += `
                <div class="col-md-${question.answers.length <= 2 ? '6' : '4'} mb-3">
                    <button class="btn btn-light answer-btn w-100 h-100" 
                            data-next="${answer.next_question}"
                            data-question="${questionId}">
                        ${answer.text}
                    </button>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
        
        questionArea.innerHTML = html;
        document.getElementById('solution-area').classList.add('d-none');
        questionArea.classList.remove('d-none');
        
        // Обновляем номер шага
        document.getElementById('current-step').textContent = `Шаг ${this.currentStep} из ${this.totalSteps}`;
    }
    
    showSolution(solution) {
        const solutionArea = document.getElementById('solution-area');
        const questionArea = document.getElementById('question-area');
        
        let stepsHtml = '';
        solution.steps.forEach((step, index) => {
            stepsHtml += `
                <li class="list-group-item">
                    <span class="badge bg-primary me-2">${index + 1}</span>
                    ${step}
                </li>
            `;
        });
        
        solutionArea.innerHTML = `
            <div class="solution-card">
                <div class="alert alert-success">
                    <h4><i class="bi bi-check-circle"></i> Диагностика завершена!</h4>
                    <p class="mb-0">Определена неисправность: <strong>${solution.title}</strong></p>
                </div>
                
                <div class="card mb-4">
                    <div class="card-header bg-success text-white">
                        <h5 class="mb-0"><i class="bi bi-wrench"></i> Рекомендуемые действия</h5>
                    </div>
                    <ul class="list-group list-group-flush">
                        ${stepsHtml}
                    </ul>
                </div>
                
                <div class="card">
                    <div class="card-header bg-info text-white">
                        <h5 class="mb-0"><i class="bi bi-lightbulb"></i> Дополнительные рекомендации</h5>
                    </div>
                    <div class="card-body">
                        <ul>
                            <li>Проверьте актуальность версии библиотеки</li>
                            <li>Ознакомьтесь с документацией в разделе "Справочная информация"</li>
                            <li>Запланируйте выполнение соответствующих регламентных работ</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        questionArea.classList.add('d-none');
        solutionArea.classList.remove('d-none');
        
        // Обновляем прогресс на 100%
        this.updateProgress(100);
        document.getElementById('current-step').textContent = 'Завершено';
    }
    
    updateProgress(percent = null) {
        const progressBar = document.getElementById('progress-bar');
        if (percent !== null) {
            progressBar.style.width = percent + '%';
            progressBar.setAttribute('aria-valuenow', percent);
        } else {
            // Автоматический расчет прогресса
            const progress = Math.min((this.currentStep - 1) / (this.totalSteps - 1) * 100, 100);
            progressBar.style.width = progress + '%';
            progressBar.setAttribute('aria-valuenow', progress);
        }
    }
    
    setupEventListeners() {
        // Делегирование событий для кнопок ответов
        document.getElementById('question-area').addEventListener('click', (e) => {
            if (e.target.classList.contains('answer-btn')) {
                const nextQuestionId = parseInt(e.target.dataset.next);
                const currentQuestionId = parseInt(e.target.dataset.question);
                
                // Сохраняем историю
                this.answerHistory.push({
                    questionId: currentQuestionId,
                    answerText: e.target.textContent.trim(),
                    nextQuestionId: nextQuestionId
                });
                
                // Увеличиваем счетчик шагов
                this.currentStep++;
                this.currentQuestionId = nextQuestionId;
                
                // Загружаем следующий вопрос
                this.loadQuestion(nextQuestionId);
                this.updateProgress();
                
                // Активируем кнопку "Назад"
                document.getElementById('prev-btn').disabled = false;
            }
        });
        
        // Кнопка "Назад"
        document.getElementById('prev-btn').addEventListener('click', () => {
            if (this.answerHistory.length > 0) {
                const lastAnswer = this.answerHistory.pop();
                this.currentQuestionId = lastAnswer.questionId;
                this.currentStep--;
                
                this.loadQuestion(this.currentQuestionId);
                this.updateProgress();
                
                // Деактивируем кнопку "Назад", если история пуста
                if (this.answerHistory.length === 0) {
                    document.getElementById('prev-btn').disabled = true;
                }
            }
        });
        
        // Кнопка "Начать заново"
        document.getElementById('restart-btn').addEventListener('click', () => {
            if (confirm('Вы уверены, что хотите начать диагностику заново? Все прогресс будет сброшен.')) {
                this.currentQuestionId = 1;
                this.answerHistory = [];
                this.currentStep = 1;
                
                this.loadQuestion(1);
                this.updateProgress();
                document.getElementById('prev-btn').disabled = true;
            }
        });
    }
}

// Инициализация диагностики при загрузке страницы
function initDiagnostic(data) {
    window.diagnosticSystem = new DiagnosticSystem(data);
}