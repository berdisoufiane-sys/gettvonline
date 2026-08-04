import { auth } from '../assets/js/firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { parse as parseCSV } from './importer/csv-parser.js';
import { importPosts } from './importer/importer-service.js';

document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('main');
    const logoutButton = document.getElementById('logout-button');

    // UI Sections
    const uploadSection = document.getElementById('upload-section');
    const previewSection = document.getElementById('preview-section');
    const progressSection = document.getElementById('progress-section');
    const resultsSection = document.getElementById('results-section');

    // Drop Zone
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const fileNameDisplay = document.getElementById('file-name');

    // Preview
    const previewHead = document.getElementById('preview-head');
    const previewBody = document.getElementById('preview-body');

    // Controls
    const importBtn = document.getElementById('import-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    // Progress
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const importedCount = document.getElementById('imported-count');
    const skippedCount = document.getElementById('skipped-count');

    // Results
    const successMessage = document.getElementById('success-message');
    const finalImported = document.getElementById('final-imported');
    const finalSkipped = document.getElementById('final-skipped');
    const finalTotal = document.getElementById('final-total');
    const errorsContainer = document.getElementById('errors-container');
    const errorsTableBody = document.getElementById('errors-table-body');

    let parsedData = [];

    // --- Auth & Page Init ---
    onAuthStateChanged(auth, (user) => {
        if (user) {
            mainContent.style.visibility = 'visible';
        } else {
            window.location.href = 'login.html';
        }
    });

    if (logoutButton) {
        logoutButton.addEventListener('click', () => signOut(auth));
    }

    // --- File Handling ---
    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drop-zone-active');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drop-zone-active'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drop-zone-active');
        const files = e.dataTransfer.files;
        if (files.length) {
            handleFile(files[0]);
        }
    });
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            handleFile(fileInput.files[0]);
        }
    });

    function handleFile(file) {
        if (file.type !== 'text/csv') {
            alert('Please upload a valid .csv file.');
            return;
        }
        fileNameDisplay.textContent = `Selected file: ${file.name}`;
        const reader = new FileReader();
        reader.onload = (e) => {
            const { headers, data } = parseCSV(e.target.result);
            parsedData = data;
            displayPreview(headers, data.slice(0, 5));
            uploadSection.classList.add('hidden');
            previewSection.classList.remove('hidden');
        };
        reader.readAsText(file);
    }

    // --- UI Updates ---
    function displayPreview(headers, data) {
        previewHead.innerHTML = `<tr>${headers.map(h => `<th scope="col" class="px-6 py-3">${h}</th>`).join('')}</tr>`;
        previewBody.innerHTML = data.map(row =>
            `<tr>${headers.map(h => `<td class="px-6 py-4 truncate max-w-xs" title="${row[h]}">${row[h] || ''}</td>`).join('')}</tr>`
        ).join('');
    }

    function resetUI() {
        parsedData = [];
        fileInput.value = '';
        fileNameDisplay.textContent = '';

        uploadSection.classList.remove('hidden');
        previewSection.classList.add('hidden');
        progressSection.classList.add('hidden');
        resultsSection.classList.add('hidden');

        progressBar.style.width = '0%';
        progressText.textContent = 'Processed 0 / 0';
        importedCount.textContent = '0';
        skippedCount.textContent = '0';
        errorsTableBody.innerHTML = '';
    }

    // --- Import Process ---
    cancelBtn.addEventListener('click', resetUI);

    importBtn.addEventListener('click', async () => {
        previewSection.classList.add('hidden');
        progressSection.classList.remove('hidden');
        importBtn.disabled = true;
        cancelBtn.disabled = true;

        try {
            const results = await importPosts(parsedData, (progress) => {
                const percentage = (progress.processed / progress.total) * 100;
                progressBar.style.width = `${percentage}%`;
                progressText.textContent = `Processed ${progress.processed} / ${progress.total}`;
                importedCount.textContent = progress.imported;
                skippedCount.textContent = progress.skipped;
            });

            displayResults(results);

        } catch (error) {
            console.error("Fatal import error:", error);
            alert(`A fatal error occurred during the import: ${error.message}`);
        } finally {
            progressSection.classList.add('hidden');
            resultsSection.classList.remove('hidden');
            importBtn.disabled = false;
            cancelBtn.disabled = false;
        }
    });

    function displayResults(results) {
        finalImported.textContent = results.imported;
        finalSkipped.textContent = results.skipped;
        finalTotal.textContent = results.total;

        if (results.errors.length > 0) {
            errorsContainer.classList.remove('hidden');
            errorsTableBody.innerHTML = results.errors.map(err => `
                <tr class="border-b border-gray-800">
                    <td class="p-2 text-red-400">${err.row}</td>
                    <td class="p-2">${err.message}</td>
                    <td class="p-2 text-gray-500 truncate max-w-xs" title="${err.data.title}">${err.data.title}</td>
                </tr>
            `).join('');
        } else {
            errorsContainer.classList.add('hidden');
        }

        if (results.imported > 0 && results.errors.length === 0) {
            successMessage.classList.remove('hidden');
        }
    }
});