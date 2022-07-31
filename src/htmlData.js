export const headerSection = `<!doctype html> <html lang='en'><head>
<meta charset='utf-8'>
<meta http-equiv='X-UA-Compatible' content='IE=edge'>
<meta name='viewport' content='width=device-width, initial-scale=1'>
<title>Appium Server Report</title>
<link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bootstrap@3.4.1/dist/css/bootstrap.min.css' integrity='sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu' crossorigin='anonymous'>
<script src='https://code.jquery.com/jquery-1.12.4.min.js' integrity='sha384-nvAa0+6Qg9clwYCGGPpDQLVpLNn0fRaROjHqs13t4Ggj3Ez50XnGQqc/r8MhnRDZ' crossorigin='anonymous'></script>
<script src='https://cdn.jsdelivr.net/npm/bootstrap@3.4.1/dist/js/bootstrap.min.js' integrity='sha384-aJ21OjlMXNL5UyIl/XNwTMqvzeRMZH2w8c5cRVpzpU8Y5bApTppSuUkhZXN0VxHd' crossorigin='anonymous'></script>
</head>`;

export const titleContext = `<body style='padding-top: 20px; padding-bottom: 20px;'>
<nav class='navbar navbar-inverse navbar-static-top'>
<div class='container-fluid'>
<div class='navbar-header'>
<a class='navbar-brand' id='testname' href='#'>Report From Server</a>
</div></div></nav>`;

export const cmdDataStart = `<div class='container-fluid'>
  <div class='row padding-md'>
  <div class='col-sm-1 col-md-2 sidebar'>
  <ul class='nav nav-sidebar' id='cmd'>`;

export const cmdDataEnd = '</ul></div>';

export const screenshotSection = `<div class='col-sm-8 main  overflow-auto'>
    <h1 class='page-header'>Dashboard</h1>
    <img id='cmd-context' src='' alt='No Image'></img>
  <div class='row placeholders'>
  <div class='col-xs-6 col-sm-3 placeholder'>
  </div></div></div></div></div>`;

export const onclickfunction = `<script lang='javascript'>
function setData(key) {
    let img = data['data'][key];
    if(img) { 
        document.getElementById('cmd-context').src = img; 
    } else { 
        document.getElementById('cmd-context').src = noImg; 
    }
    }
    </script>`;

export const end = '</body></html>';

// eslint-disable-next-line prettier/prettier
export const noImage =
  'data:image/jpeg;base64,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';