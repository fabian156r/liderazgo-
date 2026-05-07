// Base de datos de preguntas
const questions = [
    {
        q: "1. ¿Qué es el liderazgo operativo?",
        options: [
            "Enfoque utilizado para gestionar la ejecución de las actividades diarias.",
            "Estrategia para definir la misión corporativa a largo plazo.",
            "Proceso exclusivo para autorizar presupuestos anuales.",
            "Método enfocado únicamente en la contratación de gerentes."
        ],
        correct: 0
    },
    {
        q: "2. ¿Cómo optimizan el tiempo los líderes operativos?",
        options: [
            "Trabajando horas extras y delegando sin supervisión.",
            "Reduciendo los tiempos de descanso del personal.",
            "Planificación eficaz, organización de los recursos y motivación del personal.",
            "Evitando las reuniones de equipo para ahorrar minutos."
        ],
        correct: 2
    },
    {
        q: "3. La cultura organizacional se conforma de valores, creencias y prácticas.",
        options: ["Verdadero", "Falso"],
        correct: 0
    },
    {
        q: "4. En el apartado de 'Alto desempeño', ¿qué se menciona sobre la innovación?",
        options: [
            "Se prohíbe terminantemente para evitar pérdidas financieras.",
            "Solo la alta dirección puede proponer e implementar nuevas ideas.",
            "Depende exclusivamente de la compra de tecnología de punta.",
            "Se fomenta permitiendo riesgos calculados y apoyando la experimentación."
        ],
        correct: 3
    },
    {
        q: "5. ¿En qué consiste la 'Mentalidad de Cadena' en el trabajo en equipo?",
        options: [
            "En que cada área trabaje de forma completamente aislada.",
            "En que las áreas estén comunicadas y comprendan los objetivos comunes.",
            "En obligar a los empleados a permanecer en su misma estación.",
            "En establecer una jerarquía autoritaria donde nadie opine."
        ],
        correct: 1
    },
    {
        q: "6. Su objetivo es buscar que entre equipos todos ganen, evitar que los equipos compitan entre sí. ¿De qué es este concepto?",
        options: [
            "Líder como mediador.",
            "Ruptura de comunicación.",
            "Gestión de desempeño.",
            "Mentalidad competitiva aislada."
        ],
        correct: 0
    },
    {
        q: "7. El liderazgo operativo se trata solo de dar órdenes y supervisar que se cumplan las tareas diarias.",
        options: ["Verdadero", "Falso"],
        correct: 1
    },
    {
        q: "8. ¿Qué abarca el manejo de personal en producción?",
        options: [
            "Selección del personal y su capacitación, evaluar competencias y valores.",
            "Exclusivamente el cálculo y pago de la nómina semanal.",
            "Solamente el mantenimiento preventivo de la maquinaria.",
            "El diseño de campañas publicitarias para los productos."
        ],
        correct: 0
    },
    {
        q: "9. ¿Qué implica encontrar al candidato ideal en el proceso de reclutamiento?",
        options: [
            "Contratar a la primera persona que entregue una solicitud.",
            "Buscar a un candidato que exija el menor salario posible.",
            "Analizar la adaptación cultural, el potencial de crecimiento y el currículum.",
            "Evaluar únicamente la cercanía de su domicilio a la empresa."
        ],
        correct: 2
    },
    {
        q: "10. ¿Cuál de los siguientes NO se menciona como parte del manejo de personal?",
        options: [
            "Evaluación de Desempeño.",
            "Planes de Carrera y Sucesión.",
            "Cálculo de costos de producción por unidad.",
            "Retención de Talento."
        ],
        correct: 2
    }
];

// Variables de estado
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let timeLeft = 40;
let participantName = "";
let userResults = []; 

// Elementos del DOM
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const timerDisplay = document.getElementById('timer-display');
const questionCounter = document.getElementById('question-counter');
const feedbackMessage = document.getElementById('feedback-message');
const downloadPdfBtn = document.getElementById('download-pdf-btn');
const restartBtn = document.getElementById('restart-btn');
const nameInput = document.getElementById('username');

// Iniciar Cuestionario
startBtn.addEventListener('click', () => {
    participantName = nameInput.value.trim();
    if (!participantName) {
        alert("Por favor, ingresa tu nombre para comenzar.");
        return;
    }
    startScreen.classList.remove('active');
    quizScreen.classList.add('active');
    loadQuestion();
});

function loadQuestion() {
    const currentQ = questions[currentQuestionIndex];
    questionText.textContent = currentQ.q;
    questionCounter.textContent = `Pregunta ${currentQuestionIndex + 1} de ${questions.length}`;
    
    optionsContainer.innerHTML = '';
    feedbackMessage.classList.add('hidden');
    feedbackMessage.className = 'feedback hidden';

    currentQ.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-btn');
        button.addEventListener('click', () => handleAnswer(index, button));
        optionsContainer.appendChild(button);
    });

    timeLeft = 40;
    timerDisplay.textContent = `Tiempo: ${timeLeft}s`;
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    timeLeft--;
    timerDisplay.textContent = `Tiempo: ${timeLeft}s`;
    
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        handleAnswer(-1, null); // -1 significa que se acabó el tiempo
    }
}

function handleAnswer(selectedIndex, selectedButton) {
    clearInterval(timerInterval);
    const currentQ = questions[currentQuestionIndex];
    const isCorrect = selectedIndex === currentQ.correct;
    
    // Deshabilitar todos los botones
    const allButtons = optionsContainer.querySelectorAll('.option-btn');
    allButtons.forEach(btn => btn.disabled = true);

    // Guardar resultado para el PDF
    userResults.push({
        pregunta: currentQ.q,
        respuestaUsuario: selectedIndex >= 0 ? currentQ.options[selectedIndex] : "Tiempo Agotado",
        respuestaCorrecta: currentQ.options[currentQ.correct],
        esCorrecto: isCorrect
    });

    feedbackMessage.classList.remove('hidden');

    if (isCorrect) {
        if(selectedButton) selectedButton.classList.add('correct');
        feedbackMessage.textContent = "¡Correcto!";
        feedbackMessage.classList.add('success');
        score++;
    } else {
        if(selectedButton) selectedButton.classList.add('incorrect');
        // Resaltar la correcta
        allButtons[currentQ.correct].classList.add('correct');
        feedbackMessage.textContent = "Incorrecto. La respuesta correcta era: " + currentQ.options[currentQ.correct];
        feedbackMessage.classList.add('error');
    }

    // Pasar a la siguiente pregunta después de 3 segundos
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }, 3000);
}

function showResults() {
    quizScreen.classList.remove('active');
    resultScreen.classList.add('active');
    document.getElementById('final-score-text').textContent = 
        `${participantName}, tu puntuación final es: ${score} de ${questions.length}`;
}

// Generación de PDF con jsPDF
downloadPdfBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Reporte de Resultados: Liderazgo Operativo", 15, 20);
    
    doc.setFontSize(12);
    doc.text(`Participante: ${participantName}`, 15, 30);
    doc.text(`Puntuación: ${score} / ${questions.length}`, 15, 38);
    
    let yPos = 50;
    
    userResults.forEach((result, index) => {
        // Añadir nueva página si llegamos al final del documento
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
        
        doc.setFont("helvetica", "bold");
        const splitTitle = doc.splitTextToSize(`${index + 1}. ${result.pregunta}`, 180);
        doc.text(splitTitle, 15, yPos);
        yPos += (splitTitle.length * 6);
        
        doc.setFont("helvetica", "normal");
        const status = result.esCorrecto ? "CORRECTO" : "INCORRECTO";
        doc.setTextColor(result.esCorrecto ? 0 : 255, result.esCorrecto ? 128 : 0, 0); // Verde o Rojo
        doc.text(`Resultado: ${status}`, 15, yPos);
        doc.setTextColor(0, 0, 0); // Volver a negro
        yPos += 7;
        
        const splitUserAns = doc.splitTextToSize(`Tu respuesta: ${result.respuestaUsuario}`, 180);
        doc.text(splitUserAns, 15, yPos);
        yPos += (splitUserAns.length * 6);

        if (!result.esCorrecto) {
            const splitCorrAns = doc.splitTextToSize(`Respuesta Correcta: ${result.respuestaCorrecta}`, 180);
            doc.text(splitCorrAns, 15, yPos);
            yPos += (splitCorrAns.length * 6);
        }
        
        yPos += 5; // Espacio entre preguntas
    });

    doc.save(`Resultados_${participantName.replace(/\s+/g, '_')}.pdf`);
});

// Reiniciar cuestionario
restartBtn.addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    userResults = [];
    nameInput.value = '';
    resultScreen.classList.remove('active');
    startScreen.classList.add('active');
});