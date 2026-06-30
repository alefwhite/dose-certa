document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements Queries ---
    const calcForm = document.getElementById('calc-form');
    const fractionBtns = document.querySelectorAll('.fraction-btn');
    
    const freqInput = document.getElementById('frequency');
    const freqMinusBtn = document.getElementById('freq-minus');
    const freqPlusBtn = document.getElementById('freq-plus');
    const errorFreq = document.getElementById('error-frequency');
    
    const durInput = document.getElementById('duration');
    const durMinusBtn = document.getElementById('dur-minus');
    const durPlusBtn = document.getElementById('dur-plus');
    const errorDur = document.getElementById('error-duration');
    
    // Optional Details Info
    const btnToggleOptional = document.getElementById('btn-toggle-optional');
    const optionalInfoFields = document.getElementById('optional-info-fields');
    const patientInput = document.getElementById('patient-name');
    const medicationInput = document.getElementById('medication-name');
    const medicationIntervalInput = document.getElementById('medication-interval');

    const btnClear = document.getElementById('btn-clear');
    
    // Results & Actions
    const resultsPanel = document.getElementById('results-panel');
    const resultRounded = document.getElementById('result-rounded');
    const resultExact = document.getElementById('result-exact');
    const resultHelperMsg = document.getElementById('result-helper-msg');
    const resultBox = document.querySelector('.result-box');
    
    const btnShareWhatsapp = document.getElementById('btn-share-whatsapp');
    const btnExportPdf = document.getElementById('btn-export-pdf');

    // --- State Variables ---
    let selectedFraction = 1.0; // Default: Inteiro

    // --- Stepper Helper Functions ---
    const updateStepperValue = (input, change, min = 1, max = 365) => {
        let val = parseInt(input.value, 10);
        if (isNaN(val)) {
            val = min;
        } else {
            val = Math.max(min, Math.min(max, val + change));
        }
        input.value = val;
        // Trigger input event to run validation and auto-calculate
        input.dispatchEvent(new Event('input'));
    };

    // --- Validation Logic ---
    const validateInputs = () => {
        let isValid = true;

        // Validate Frequency
        const freqVal = parseInt(freqInput.value, 10);
        if (isNaN(freqVal) || freqVal < 1) {
            showError(freqInput, errorFreq, 'A frequência deve ser de no mínimo 1 vez ao dia.');
            isValid = false;
        } else if (freqVal > 24) {
            showError(freqInput, errorFreq, 'A frequência máxima permitida é de 24 vezes ao dia.');
            isValid = false;
        } else {
            clearError(freqInput, errorFreq);
        }

        // Validate Duration
        const durVal = parseInt(durInput.value, 10);
        if (isNaN(durVal) || durVal < 1) {
            showError(durInput, errorDur, 'A duração deve ser de no mínimo 1 dia.');
            isValid = false;
        } else if (durVal > 365) {
            showError(durInput, errorDur, 'A duração máxima permitida é de 365 dias.');
            isValid = false;
        } else {
            clearError(durInput, errorDur);
        }

        return isValid;
    };

    const showError = (input, errorContainer, message) => {
        const stepperWrapper = input.closest('.stepper-wrapper');
        if (stepperWrapper) {
            stepperWrapper.classList.add('invalid');
        }
        errorContainer.textContent = message;
    };

    const clearError = (input, errorContainer) => {
        const stepperWrapper = input.closest('.stepper-wrapper');
        if (stepperWrapper) {
            stepperWrapper.classList.remove('invalid');
        }
        errorContainer.textContent = '';
    };

    // --- Helper to format hours interval ---
    const formatInterval = (val) => {
        const raw = val.trim();
        if (!raw) return '';
        const hours = parseInt(raw, 10);
        if (isNaN(hours) || hours <= 0) return '';
        return `${hours} em ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    };

    // --- Calculation Logic ---
    const calculateDose = () => {
        if (!validateInputs()) {
            resultsPanel.classList.add('hidden');
            return;
        }

        const frequency = parseInt(freqInput.value, 10);
        const duration = parseInt(durInput.value, 10);

        // Formula: Total = Fraction * Frequency * Days
        const totalExact = selectedFraction * frequency * duration;
        const totalRounded = Math.ceil(totalExact);

        // Update result texts
        resultExact.textContent = totalExact.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
        resultRounded.textContent = totalRounded;

        // Custom styling/messages depending on fractional results
        if (totalExact !== totalRounded) {
            // Fractional pill count: visual caution / amber colors
            resultBox.classList.add('fractional');
            resultHelperMsg.innerHTML = `Total exato: <strong>${resultExact.textContent} comprimidos</strong>.<br>Como o resultado não é inteiro, você precisará providenciar <strong>${totalRounded} comprimidos inteiros</strong> para garantir todas as frações do tratamento.`;
        } else {
            // Integer pill count: success / emerald colors
            resultBox.classList.remove('fractional');
            resultHelperMsg.innerHTML = `Você precisará de precisamente <strong>${totalRounded} comprimidos inteiros</strong> para concluir o tratamento completo.`;
        }

        // Populate Print Only Text Summary
        const patient = patientInput.value.trim();
        const medication = medicationInput.value.trim();
        const interval = formatInterval(medicationIntervalInput.value);
        
        const printPatientRow = document.getElementById('print-patient-row');
        const printMedicationRow = document.getElementById('print-medication-row');
        const printPatientVal = document.getElementById('print-patient-val');
        const printMedicationVal = document.getElementById('print-medication-val');
        const printPrescriptionVal = document.getElementById('print-prescription-val');

        if (patient) {
            printPatientVal.textContent = patient;
            printPatientRow.style.display = 'block';
        } else {
            printPatientRow.style.display = 'none';
        }

        if (medication) {
            let medText = medication;
            if (interval) {
                medText += ` (${interval})`;
            }
            printMedicationVal.textContent = medText;
            printMedicationRow.style.display = 'block';
        } else if (interval) {
            printMedicationVal.textContent = `De ${interval}`;
            printMedicationRow.style.display = 'block';
        } else {
            printMedicationRow.style.display = 'none';
        }

        let fractionText = "1 comprimido (Inteiro)";
        if (selectedFraction === 0.75) fractionText = "3/4 de comprimido";
        if (selectedFraction === 0.5) fractionText = "Metade (1/2) de comprimido";
        if (selectedFraction === 0.25) fractionText = "1/4 de comprimido";

        printPrescriptionVal.innerHTML = `
            • Dose por tomada: <strong>${fractionText}</strong><br>
            • Frequência: <strong>${frequency} ${frequency > 1 ? 'vezes' : 'vez'} ao dia${interval ? ` (${interval})` : ''}</strong><br>
            • Duração do tratamento: <strong>${duration} ${duration > 1 ? 'dias' : 'dia'}</strong><br>
            • Total exato necessário: <strong>${resultExact.textContent} comprimidos</strong>
        `;

        // Show panel
        resultsPanel.classList.remove('hidden');
    };

    // --- Event Listeners ---

    // 1. Fraction Buttons (Radio simulation)
    fractionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state in UI
            fractionBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-checked', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-checked', 'true');

            // Update internal state
            selectedFraction = parseFloat(btn.getAttribute('data-value'));
        });
    });

    // 2. Stepper Buttons Click Handlers
    freqMinusBtn.addEventListener('click', () => updateStepperValue(freqInput, -1, 1, 24));
    freqPlusBtn.addEventListener('click', () => updateStepperValue(freqInput, 1, 1, 24));
    
    durMinusBtn.addEventListener('click', () => updateStepperValue(durInput, -1, 1, 365));
    durPlusBtn.addEventListener('click', () => updateStepperValue(durInput, 1, 1, 365));

    // 3. Inputs Change/Typing handlers (Live validation, no auto-calculation)
    [freqInput, durInput].forEach(input => {
        input.addEventListener('blur', () => {
            // Force integer values on blur
            let val = parseInt(input.value, 10);
            const min = parseInt(input.getAttribute('min'), 10) || 1;
            const max = parseInt(input.getAttribute('max'), 10) || 365;
            
            if (isNaN(val) || val < min) {
                input.value = min;
            } else if (val > max) {
                input.value = max;
            } else {
                input.value = val;
            }
        });
    });

    // 4. Toggle Optional Details Info
    btnToggleOptional.addEventListener('click', () => {
        const isHidden = optionalInfoFields.classList.toggle('hidden');
        btnToggleOptional.setAttribute('aria-expanded', !isHidden);
        btnToggleOptional.textContent = isHidden 
            ? '+ Adicionar detalhes (Paciente / Medicamento / Horário)' 
            : '— Ocultar detalhes (Paciente / Medicamento / Horário)';
    });

    // 5. Form Submit Handler
    calcForm.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateDose();
        // Scroll results into view on mobile screens
        resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    // 6. Share via WhatsApp
    btnShareWhatsapp.addEventListener('click', () => {
        const patient = patientInput.value.trim();
        const medication = medicationInput.value.trim();
        const interval = formatInterval(medicationIntervalInput.value);
        const frequency = freqInput.value;
        const duration = durInput.value;
        const totalExact = resultExact.textContent;
        const totalRounded = resultRounded.textContent;

        let fractionText = "Inteiro (1.0)";
        if (selectedFraction === 0.75) fractionText = "3/4 (0.75)";
        if (selectedFraction === 0.5) fractionText = "Metade (0.5)";
        if (selectedFraction === 0.25) fractionText = "1/4 (0.25)";

        // Build WhatsApp formatted string
        let message = `💊 *Dose Certa - Planejamento de Tratamento*\n\n`;
        if (patient) message += `👤 *Paciente:* ${patient}\n`;
        if (medication) {
            message += `💊 *Medicamento:* ${medication}`;
            if (interval) message += ` (${interval})`;
            message += `\n`;
        } else if (interval) {
            message += `⏱️ *Intervalo:* ${interval}\n`;
        }
        if (patient || medication || interval) message += `\n`;
        
        message += `• *Dose por tomada:* ${fractionText} comprimido\n`;
        message += `• *Frequência:* ${frequency}x ao dia${interval ? ` (${interval})` : ''}\n`;
        message += `• *Duração do Tratamento:* ${duration} dias\n\n`;
        message += `📊 *Total necessário:* ${totalExact} comprimidos exatos\n`;
        message += `📦 *Comprar:* ${totalRounded} comprimidos inteiros\n\n`;
        message += `_Calcule suas doses em: Dose Certa_`;

        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });

    // 7. Save / Export as PDF (Native window print)
    btnExportPdf.addEventListener('click', () => {
        window.print();
    });

    // 8. Clear Button Handler
    btnClear.addEventListener('click', () => {
        // Reset inputs
        freqInput.value = 1;
        durInput.value = 7;
        patientInput.value = '';
        medicationInput.value = '';
        medicationIntervalInput.value = '';
        
        // Reset selected fraction to "Inteiro" (1.0)
        fractionBtns.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-checked', 'false');
        });
        const defaultBtn = document.getElementById('fraction-1');
        if (defaultBtn) {
            defaultBtn.classList.add('active');
            defaultBtn.setAttribute('aria-checked', 'true');
        }
        selectedFraction = 1.0;

        // Reset optional toggle fields
        optionalInfoFields.classList.add('hidden');
        optionalInfoFields.classList.remove('empty-print');
        btnToggleOptional.textContent = '+ Adicionar detalhes (Paciente / Medicamento / Horário)';
        btnToggleOptional.setAttribute('aria-expanded', 'false');

        // Clear validations & hide results
        clearError(freqInput, errorFreq);
        clearError(durInput, errorDur);
        resultsPanel.classList.add('hidden');

        // Scroll back to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

});
