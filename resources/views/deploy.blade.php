<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deploy Akiolink</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 flex items-center justify-center min-h-screen font-sans">
    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl">
        <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Deploy Application</h1>
            <p class="text-gray-500">Run git pull, npm install, and npm run build</p>
        </div>

        <div class="flex justify-center mb-6">
            <button id="deployBtn" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2">
                <svg id="spinner" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deploy Now
            </button>
        </div>

        <div class="bg-gray-900 rounded-xl p-4 overflow-x-auto h-80 relative">
            <pre id="output" class="text-green-400 font-mono text-sm whitespace-pre-wrap">Waiting for deployment...</pre>
        </div>
    </div>

    <script>
        document.getElementById('deployBtn').addEventListener('click', async () => {
            const btn = document.getElementById('deployBtn');
            const spinner = document.getElementById('spinner');
            const outputEl = document.getElementById('output');
            
            // UI Loading state
            btn.disabled = true;
            btn.classList.add('opacity-75', 'cursor-not-allowed');
            spinner.classList.remove('hidden');
            outputEl.textContent = 'Running deployment commands... This may take a minute or two.\n\n';

            try {
                const response = await fetch('/deploy', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}'
                    }
                });

                const data = await response.json();
                outputEl.textContent += data.output || 'Deployment successful with no output.';
            } catch (error) {
                outputEl.textContent += '\n\nError: ' + error.message;
            } finally {
                // UI Reset state
                btn.disabled = false;
                btn.classList.remove('opacity-75', 'cursor-not-allowed');
                spinner.classList.add('hidden');
            }
        });
    </script>
</body>
</html>
