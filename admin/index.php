<?php
require __DIR__ . '/_auth.php';
require_login();
$cfg = cfg();

function read_data($file){
  if(!file_exists($file)) return ['version'=>1,'items'=>[]];
  $raw = file_get_contents($file);
  $j = json_decode($raw, true);
  if(!is_array($j) || !isset($j['items']) || !is_array($j['items'])) return ['version'=>1,'items'=>[]];
  return $j;
}

$data = read_data($cfg['data_file']);
$items = $data['items'];

?><!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Einsatz einpflegen · Intern</title>
  <link rel="stylesheet" href="../styles.css" />
</head>
<body>
<header class="header">
  <div class="container nav">
    <a class="brand" href="../index.html">
      <img src="../assets/Stauferlöwe.jpg" alt="Logo" class="brand-logo" />
      <span class="brand-name">FREIWILLIGE FEUERWEHR WEIL DER STADT</span>
    </a>
    <nav class="nav-links" style="gap:10px">
      <a href="../intern.html">Intern</a>
      <a href="logout.php" class="pill">Logout</a>
    </nav>
  </div>
</header>

<main>
  <section class="section">
    <div class="container" style="max-width:980px">
      <div class="section-head">
        <h1 class="h2">Einsatz einpflegen</h1>
        <p class="section-note">Fülle die Felder aus und speichere. Bilder sind optional.</p>
      </div>

      <div class="card panel">
        <form class="form" method="post" action="save.php" enctype="multipart/form-data">
          <div class="grid3">
            <div class="field">
              <label for="nr">Einsatz-Nummer</label>
              <input id="nr" name="nr" placeholder="001" required />
            </div>
            <div class="field">
              <label for="jahr">Jahr</label>
              <input id="jahr" name="jahr" placeholder="2026" inputmode="numeric" required />
            </div>
            <div class="field">
              <label for="datum">Datum (optional)</label>
              <input id="datum" name="datum" placeholder="26.01.2026" />
            </div>
          </div>

          <div class="field">
            <label for="stichwort">Stichwort / Titel (optional)</label>
            <input id="stichwort" name="stichwort" placeholder="z.B. Brandmeldeanlage" />
          </div>

          <div class="field">
            <label for="fahrzeuge">Eingesetzte Fahrzeuge (wie auf der Einsatz-Seite angezeigt)</label>
            <input id="fahrzeuge" name="fahrzeuge" placeholder="z.B. HLF 20/16, DLK 23/12, ELW 1" required />
          </div>

          <div class="field">
            <label for="bild">Bild (optional, JPG/PNG/WebP, max. <?php echo (int)$cfg['max_upload_mb']; ?> MB)</label>
            <input id="bild" name="bild" type="file" accept="image/*" />
          </div>

          <div class="cta-row">
            <button class="btn primary" type="submit">Speichern</button>
            <a class="btn" href="../einsaetze.html" target="_blank" rel="noopener">Einsätze ansehen</a>
          </div>
        </form>
      </div>

      <div class="section-head" style="margin-top:22px">
        <h2 class="h2" style="font-size:20px">Letzte Einträge</h2>
        <p class="section-note">Zur Kontrolle. (Löschen/Ändern kann später ergänzt werden.)</p>
      </div>

      <div class="card panel">
        <div class="list">
          <?php
            $slice = array_slice(array_reverse($items), 0, 8);
            if(empty($slice)){
              echo '<div class="list-item"><b>—</b><span>Noch keine Einsätze erfasst.</span></div>';
            } else {
              foreach($slice as $it){
                $t = htmlspecialchars($it['title'] ?? 'Einsatz');
                $s = htmlspecialchars($it['subtitle'] ?? '');
                echo '<div class="list-item"><b>'.$t.'</b><span>'.$s.'</span></div>';
              }
            }
          ?>
        </div>
      </div>

      <p class="section-note" style="margin-top:12px">
        Technischer Hinweis: Einsätze werden in <code>data/einsaetze.json</code> gespeichert.
      </p>

    </div>
  </section>
</main>
</body>
</html>
