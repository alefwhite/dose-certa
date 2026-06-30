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
    const patientTypeBtns = document.querySelectorAll('.patient-type-btn');
    const medicationInput = document.getElementById('medication-name');
    const medicationIntervalInput = document.getElementById('medication-interval');

    // Schedule Selector Elements
    const scheduleBtns = document.querySelectorAll('.schedule-btn');
    const hoursIntervalWrapper = document.getElementById('hours-interval-wrapper');
    const errorInterval = document.getElementById('error-interval');
    const frequencySuffix = document.getElementById('frequency-suffix');
    const startTimeInput = document.getElementById('start-time');
    const previewList = document.getElementById('schedule-preview-list');

    const btnClear = document.getElementById('btn-clear');
    
    // Results & Actions
    const resultsPanel = document.getElementById('results-panel');
    const resultRounded = document.getElementById('result-rounded');
    const resultExact = document.getElementById('result-exact');
    const resultHelperMsg = document.getElementById('result-helper-msg');
    const resultBox = document.querySelector('.result-box');
    const resultScheduleList = document.getElementById('result-schedule-list');
    const resultScheduleHelper = document.getElementById('result-schedule-helper');
    
    const btnShareWhatsapp = document.getElementById('btn-share-whatsapp');
    const btnExportPdf = document.getElementById('btn-export-pdf');

    // --- State Variables ---
    let selectedFraction = 1.0; // Default: Inteiro
    let selectedSchedule = 'once'; // Default: once
    let selectedPatientType = 'human'; // Default: human

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

        // Validate Interval if hours schedule is selected
        if (selectedSchedule === 'hours') {
            const intervalVal = parseFloat(medicationIntervalInput.value);
            if (isNaN(intervalVal) || intervalVal <= 0) {
                showError(medicationIntervalInput, errorInterval, 'Por favor, insira um intervalo em horas válido.');
                isValid = false;
            } else if (intervalVal > 24) {
                showError(medicationIntervalInput, errorInterval, 'O intervalo máximo permitido é de 24 horas.');
                isValid = false;
            } else {
                clearError(medicationIntervalInput, errorInterval);
            }
        } else {
            clearError(medicationIntervalInput, errorInterval);
        }

        return isValid;
    };

    const showError = (input, errorContainer, message) => {
        const stepperWrapper = input.closest('.stepper-wrapper');
        if (stepperWrapper) {
            stepperWrapper.classList.add('invalid');
        }
        if (input.classList.contains('text-input')) {
            input.classList.add('invalid');
        }
        errorContainer.textContent = message;
    };

    const clearError = (input, errorContainer) => {
        const stepperWrapper = input.closest('.stepper-wrapper');
        if (stepperWrapper) {
            stepperWrapper.classList.remove('invalid');
        }
        if (input.classList.contains('text-input')) {
            input.classList.remove('invalid');
        }
        errorContainer.textContent = '';
    };

    // --- Helper to format hours interval ---
    const getIntervalText = () => {
        if (selectedSchedule === 'once') {
            return '1x ao dia';
        } else if (selectedSchedule === 'twice') {
            return 'de 12 em 12 horas';
        } else if (selectedSchedule === 'hours') {
            const val = medicationIntervalInput.value.trim();
            if (!val) return '';
            const hours = parseInt(val, 10);
            if (isNaN(hours) || hours <= 0) return '';
            return `de ${hours} em ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
        }
        return '';
    };

    // --- Time Suggestion & Schedule Preview logic ---
    const isNightDose = (timeStr) => {
        const hour = parseInt(timeStr.split(':')[0], 10);
        return hour >= 23 || hour < 6;
    };

    const getScheduleTimes = (startTimeStr, frequency) => {
        if (!startTimeStr || isNaN(frequency) || frequency <= 0) return [];
        
        const parts = startTimeStr.split(':');
        const startHours = parseInt(parts[0], 10);
        const startMinutes = parseInt(parts[1], 10);
        
        const times = [];
        
        let intervalHours;
        if (selectedSchedule === 'hours') {
            const val = parseFloat(medicationIntervalInput.value);
            if (!isNaN(val) && val > 0 && val <= 24) {
                intervalHours = val;
            } else {
                intervalHours = 24 / frequency;
            }
        } else if (selectedSchedule === 'once') {
            intervalHours = 24;
        } else if (selectedSchedule === 'twice') {
            intervalHours = 12;
        } else {
            intervalHours = 24 / frequency;
        }
        
        for (let i = 0; i < frequency; i++) {
            const totalMinutes = (startHours * 60 + startMinutes + Math.round(i * intervalHours * 60)) % (24 * 60);
            const h = Math.floor(totalMinutes / 60);
            const m = totalMinutes % 60;
            const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
            times.push(timeStr);
        }
        
        return times;
    };

    const updateSchedulePreview = () => {
        const frequency = parseInt(freqInput.value, 10);
        if (isNaN(frequency) || frequency <= 0) {
            previewList.innerHTML = '<span style="color: var(--text-muted); font-size: 0.85rem;">Insira uma frequência válida</span>';
            return;
        }
        const times = getScheduleTimes(startTimeInput.value, frequency);
        
        if (times.length === 0) {
            previewList.innerHTML = '<span style="color: var(--text-muted); font-size: 0.85rem;">Insira o intervalo para calcular</span>';
            return;
        }
        
        let hasNight = false;
        const html = times.map(t => {
            const night = isNightDose(t);
            if (night) hasNight = true;
            return `<span class="time-pill ${night ? 'night-dose' : ''}" title="${night ? 'Dose no período da madrugada (23h às 6h)' : ''}">${t}</span>`;
        }).join('');
        
        previewList.innerHTML = html;
        
        // Alerta visual de madrugada
        const parentBox = previewList.closest('.schedule-preview-box');
        if (parentBox) {
            let warnMsg = parentBox.querySelector('.night-warn-msg');
            if (hasNight) {
                if (!warnMsg) {
                    warnMsg = document.createElement('p');
                    warnMsg.className = 'helper-text night-warn-msg';
                    warnMsg.style.color = '#d97706';
                    warnMsg.style.marginTop = '0.5rem';
                    warnMsg.style.fontWeight = '600';
                    warnMsg.style.fontSize = '0.75rem';
                    warnMsg.innerHTML = '⚠️ Alguma tomada ocorre de madrugada (23h às 6h). Ajuste o início para evitar.';
                    parentBox.appendChild(warnMsg);
                }
            } else {
                if (warnMsg) {
                    warnMsg.remove();
                }
            }
        }
    };

    // --- Dynamic Frequency Updates from Schedule ---
    const updateFrequencyFromSchedule = () => {
        if (selectedSchedule === 'once') {
            freqInput.value = 1;
            hoursIntervalWrapper.classList.add('hidden-field');
            clearError(medicationIntervalInput, errorInterval);
        } else if (selectedSchedule === 'twice') {
            freqInput.value = 2;
            hoursIntervalWrapper.classList.add('hidden-field');
            clearError(medicationIntervalInput, errorInterval);
        } else if (selectedSchedule === 'hours') {
            hoursIntervalWrapper.classList.remove('hidden-field');
            const intervalVal = parseFloat(medicationIntervalInput.value);
            if (!isNaN(intervalVal) && intervalVal > 0 && intervalVal <= 24) {
                let calculatedFreq = Math.round(24 / intervalVal);
                calculatedFreq = Math.max(1, Math.min(24, calculatedFreq));
                freqInput.value = calculatedFreq;
            } else {
                if (!medicationIntervalInput.value) {
                    freqInput.value = 1;
                }
            }
        } else if (selectedSchedule === 'manual') {
            hoursIntervalWrapper.classList.add('hidden-field');
            clearError(medicationIntervalInput, errorInterval);
        }
        
        const freqVal = parseInt(freqInput.value, 10);
        if (frequencySuffix) {
            frequencySuffix.textContent = freqVal > 1 ? 'vezes ao dia' : 'vez ao dia';
        }
    };

    const handleManualFrequencyChange = () => {
        selectedSchedule = 'manual';
        scheduleBtns.forEach(btn => {
            if (btn.getAttribute('data-schedule') === 'manual') {
                btn.classList.add('active');
                btn.setAttribute('aria-checked', 'true');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-checked', 'false');
            }
        });
        hoursIntervalWrapper.classList.add('hidden-field');
        clearError(medicationIntervalInput, errorInterval);
        
        const freqVal = parseInt(freqInput.value, 10);
        if (frequencySuffix) {
            frequencySuffix.textContent = freqVal > 1 ? 'vezes ao dia' : 'vez ao dia';
        }
    };

    const setScheduleMode = (mode) => {
        selectedSchedule = mode;
        scheduleBtns.forEach(btn => {
            if (btn.getAttribute('data-schedule') === mode) {
                btn.classList.add('active');
                btn.setAttribute('aria-checked', 'true');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-checked', 'false');
            }
        });
        updateFrequencyFromSchedule();
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
        const interval = getIntervalText();
        const times = getScheduleTimes(startTimeInput.value, frequency);
        
        const printPatientRow = document.getElementById('print-patient-row');
        const printMedicationRow = document.getElementById('print-medication-row');
        const printPatientVal = document.getElementById('print-patient-val');
        const printMedicationVal = document.getElementById('print-medication-val');
        const printPrescriptionVal = document.getElementById('print-prescription-val');
        const printScheduleRow = document.getElementById('print-schedule-row');
        const printScheduleVal = document.getElementById('print-schedule-val');

        const patientEmoji = selectedPatientType === 'pet' ? '🐾' : '👤';
        const patientLabel = selectedPatientType === 'pet' ? 'Paciente (Pet)' : 'Paciente';

        if (patient) {
            printPatientVal.textContent = `${patientEmoji} ${patient} (${patientLabel.toLowerCase()})`;
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
            printMedicationVal.textContent = selectedSchedule === 'once' ? 'Uma vez ao dia' : `De ${interval}`;
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

        // Popula Cronograma de Resultados
        let hasNight = false;
        resultScheduleList.innerHTML = times.map(t => {
            const night = isNightDose(t);
            if (night) hasNight = true;
            return `<span class="time-pill ${night ? 'night-dose' : ''}">${t}</span>`;
        }).join('');

        if (hasNight) {
            resultScheduleHelper.style.color = '#d97706';
            resultScheduleHelper.innerHTML = '⚠️ Atenção: o cronograma calculado inclui tomadas de madrugada (entre 23h e 6h).';
        } else {
            resultScheduleHelper.style.color = 'var(--text-muted)';
            resultScheduleHelper.innerHTML = '✓ Todos os horários de tomada estão em períodos diurnos confortáveis.';
        }

        // Popula o cronograma no PDF
        if (printScheduleRow && printScheduleVal) {
            printScheduleVal.textContent = times.join(', ') + (hasNight ? ' (contém dose na madrugada)' : '');
            printScheduleRow.style.display = 'block';
        }

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

    // 1.2. Patient Type Selector
    patientTypeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedPatientType = btn.getAttribute('data-type');
            patientTypeBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-checked', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-checked', 'true');
        });
    });

    // 2. Stepper Buttons Click Handlers
    freqMinusBtn.addEventListener('click', () => {
        updateStepperValue(freqInput, -1, 1, 24);
        updateSchedulePreview();
    });
    freqPlusBtn.addEventListener('click', () => {
        updateStepperValue(freqInput, 1, 1, 24);
        updateSchedulePreview();
    });
    
    durMinusBtn.addEventListener('click', () => updateStepperValue(durInput, -1, 1, 365));
    durPlusBtn.addEventListener('click', () => updateStepperValue(durInput, 1, 1, 365));

    // 3. Inputs Change/Typing handlers (Live validation, no auto-calculation)
    [freqInput, durInput].forEach(input => {
        input.addEventListener('input', () => {
            if (input === freqInput) {
                handleManualFrequencyChange();
                updateSchedulePreview();
            }
        });
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
            if (input === freqInput) {
                handleManualFrequencyChange();
                updateSchedulePreview();
            }
        });
    });

    // 4. Schedule selector click listeners
    scheduleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.getAttribute('data-schedule');
            setScheduleMode(mode);
            updateSchedulePreview();
            if (mode === 'hours') {
                setTimeout(() => medicationIntervalInput.focus(), 100);
            }
        });
    });

    // Hours interval input listener
    medicationIntervalInput.addEventListener('input', () => {
        if (selectedSchedule === 'hours') {
            const intervalVal = parseFloat(medicationIntervalInput.value);
            if (!isNaN(intervalVal) && intervalVal > 0) {
                let calculatedFreq = Math.round(24 / intervalVal);
                calculatedFreq = Math.max(1, Math.min(24, calculatedFreq));
                freqInput.value = calculatedFreq;
                if (intervalVal <= 24) {
                    clearError(medicationIntervalInput, errorInterval);
                } else {
                    showError(medicationIntervalInput, errorInterval, 'O intervalo máximo permitido é de 24 horas.');
                }
            } else {
                freqInput.value = 1;
            }
            const freqVal = parseInt(freqInput.value, 10);
            if (frequencySuffix) {
                frequencySuffix.textContent = freqVal > 1 ? 'vezes ao dia' : 'vez ao dia';
            }
            updateSchedulePreview();
        }
    });

    // Start time input listener
    startTimeInput.addEventListener('input', () => {
        updateSchedulePreview();
    });

    // 5. Toggle Optional Details Info (removed "Horário" from text since it's now in step 2)
    btnToggleOptional.addEventListener('click', () => {
        const isHidden = optionalInfoFields.classList.toggle('hidden');
        btnToggleOptional.setAttribute('aria-expanded', !isHidden);
        btnToggleOptional.textContent = isHidden 
            ? '+ Adicionar detalhes (Paciente / Medicamento)' 
            : '— Ocultar detalhes (Paciente / Medicamento)';
    });

    // 6. Form Submit Handler
    calcForm.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateDose();
        // Scroll results into view on mobile screens
        resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    // 7. Share via WhatsApp
    btnShareWhatsapp.addEventListener('click', () => {
        const patient = patientInput.value.trim();
        const medication = medicationInput.value.trim();
        const interval = getIntervalText();
        const frequency = freqInput.value;
        const duration = durInput.value;
        const totalExact = resultExact.textContent;
        const totalRounded = resultRounded.textContent;
        const times = getScheduleTimes(startTimeInput.value, frequency);

        let fractionText = "Inteiro (1.0)";
        if (selectedFraction === 0.75) fractionText = "3/4 (0.75)";
        if (selectedFraction === 0.5) fractionText = "Metade (0.5)";
        if (selectedFraction === 0.25) fractionText = "1/4 (0.25)";

        // Build WhatsApp formatted string
        let message = `💊 *Dose Certa - Planejamento de Tratamento*\n\n`;
        if (patient) {
            const patientEmoji = selectedPatientType === 'pet' ? '🐾' : '👤';
            const label = selectedPatientType === 'pet' ? 'Paciente (Pet)' : 'Paciente';
            message += `${patientEmoji} *${label}:* ${patient}\n`;
        }
        if (medication) {
            message += `💊 *Medicamento:* ${medication}`;
            if (interval) message += ` (${interval})`;
            message += `\n`;
        } else if (interval) {
            message += `⏱️ *Intervalo:* ${interval.charAt(0).toUpperCase() + interval.slice(1)}\n`;
        }
        if (patient || medication || interval) message += `\n`;
        
        message += `• *Dose por tomada:* ${fractionText} comprimido\n`;
        message += `• *Frequência:* ${frequency}x ao dia${interval ? ` (${interval})` : ''}\n`;
        message += `• *Duração do Tratamento:* ${duration} dias\n`;
        if (times.length > 0) {
            message += `• *Horários das tomadas:* ${times.join(', ')}\n`;
        }
        message += `\n📊 *Total necessário:* ${totalExact} comprimidos exatos\n`;
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

        // Reset patient type to human
        selectedPatientType = 'human';
        patientTypeBtns.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-checked', 'false');
        });
        const defaultPatBtn = document.getElementById('pat-human');
        if (defaultPatBtn) {
            defaultPatBtn.classList.add('active');
            defaultPatBtn.setAttribute('aria-checked', 'true');
        }

        // Reset start time and schedule
        startTimeInput.value = '08:00';
        setScheduleMode('once');

        // Reset optional toggle fields
        optionalInfoFields.classList.add('hidden');
        optionalInfoFields.classList.remove('empty-print');
        btnToggleOptional.textContent = '+ Adicionar detalhes (Paciente / Medicamento)';
        btnToggleOptional.setAttribute('aria-expanded', 'false');

        // Clear validations & hide results
        clearError(freqInput, errorFreq);
        clearError(durInput, errorDur);
        clearError(medicationIntervalInput, errorInterval);
        resultsPanel.classList.add('hidden');

        // Run initial update for schedule preview
        updateSchedulePreview();

        // Scroll back to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Run initial update for schedule preview on startup
    updateSchedulePreview();

});
