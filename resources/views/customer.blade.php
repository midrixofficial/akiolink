<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/png" href="/favicon.png">
    <title>Storefront - Akiolink</title>
    @vite(['resources/css/app.css', 'resources/svelte/app.js'])
</head>
<body class="bg-gray-50 text-gray-900 antialiased">
    <!-- Embed merchant slug as global config so Svelte can read it -->
    <script>
        window.merchantSlug = "{{ $slug }}";
    </script>
    <div id="customer-app"></div>
</body>
</html>
