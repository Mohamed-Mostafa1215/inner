export function renderErrorPage(error?: any): string {
  const errorDetails = error
    ? `<div style="text-align: left; background: #fee2e2; border: 1px solid #fca5a5; padding: 1rem; border-radius: 0.375rem; margin-top: 1.5rem; font-family: monospace; overflow-x: auto; white-space: pre-wrap; color: #991b1b; direction: ltr;">
        <strong>Error:</strong> ${error.message || String(error)}<br/>
        ${error.stack ? `<pre style="margin: 0.5rem 0 0; font-size: 0.85rem; line-height: 1.4; overflow-x: auto;">${error.stack}</pre>` : ""}
       </div>`
    : "";

  return `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <title>لم يتم تحميل الصفحة</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; direction: rtl; }
      .card { max-width: 36rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>لم يتم تحميل الصفحة</h1>
      <p>حدث خطأ من جانبنا. يمكنك المحاولة مجددًا أو العودة للصفحة الرئيسية.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">حاول مجددًا</button>
        <a class="secondary" href="/">الصفحة الرئيسية</a>
      </div>
      ${errorDetails}
    </div>
  </body>
</html>`;
}

