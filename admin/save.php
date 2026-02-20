<?php
require __DIR__ . '/_auth.php';
require_login();
$cfg = cfg();

function fail($msg){
  http_response_code(400);
  echo '<p style="font-family:Arial">'.htmlspecialchars($msg).'</p><p><a href="index.php">Zurück</a></p>';
  exit;
}

$nr = trim($_POST['nr'] ?? '');
$jahr = trim($_POST['jahr'] ?? '');
$datum = trim($_POST['datum'] ?? '');
$stichwort = trim($_POST['stichwort'] ?? '');
$fahrzeuge = trim($_POST['fahrzeuge'] ?? '');

if($nr === '' || $jahr === '' || $fahrzeuge === '') fail('Bitte Einsatz-Nummer, Jahr und Fahrzeuge ausfüllen.');
if(!preg_match('/^\d{1,4}$/', $nr)) fail('Einsatz-Nummer sollte nur Zahlen enthalten (z.B. 001).');
if(!preg_match('/^\d{4}$/', $jahr)) fail('Jahr bitte vierstellig (z.B. 2026).');

$title = 'Einsatz #' . str_pad($nr, 3, '0', STR_PAD_LEFT) . ' / ' . $jahr;
$subtitle = $fahrzeuge;

// --- Bild Upload (optional) ---
$imgPath = '';
if(!empty($_FILES['bild']) && ($_FILES['bild']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE){
  if($_FILES['bild']['error'] !== UPLOAD_ERR_OK) fail('Upload fehlgeschlagen.');

  $maxBytes = (int)$cfg['max_upload_mb'] * 1024 * 1024;
  if(($_FILES['bild']['size'] ?? 0) > $maxBytes) fail('Bild zu groß.');

  $tmp = $_FILES['bild']['tmp_name'];
  $finfo = finfo_open(FILEINFO_MIME_TYPE);
  $mime = finfo_file($finfo, $tmp);
  finfo_close($finfo);

  $ext = '';
  if($mime === 'image/jpeg') $ext = 'jpg';
  elseif($mime === 'image/png') $ext = 'png';
  elseif($mime === 'image/webp') $ext = 'webp';
  else fail('Nur JPG/PNG/WebP erlaubt.');

  if(!is_dir($cfg['upload_dir'])) mkdir($cfg['upload_dir'], 0755, true);

  $safe = 'einsatz_' . $jahr . '_' . str_pad($nr, 3, '0', STR_PAD_LEFT) . '_' . time() . '.' . $ext;
  $dest = rtrim($cfg['upload_dir'], '/').'/'.$safe;

  if(!move_uploaded_file($tmp, $dest)) fail('Konnte Bild nicht speichern.');

  $imgPath = 'admin/uploads/' . $safe; // web path from site root
}

// --- JSON lesen/schreiben ---
$dataFile = $cfg['data_file'];
if(!file_exists($dataFile)){
  $base = ['version'=>1,'items'=>[]];
} else {
  $raw = file_get_contents($dataFile);
  $base = json_decode($raw, true);
  if(!is_array($base) || !isset($base['items']) || !is_array($base['items'])) $base = ['version'=>1,'items'=>[]];
}

$id = $jahr . '-' . str_pad($nr, 3, '0', STR_PAD_LEFT);
$base['items'][] = [
  'id' => $id,
  'nr' => str_pad($nr, 3, '0', STR_PAD_LEFT),
  'jahr' => $jahr,
  'datum' => $datum,
  'stichwort' => $stichwort,
  'fahrzeuge' => $fahrzeuge,
  'title' => $title,
  'subtitle' => $subtitle,
  'image' => $imgPath,
  'created_at' => date('c'),
];

file_put_contents($dataFile, json_encode($base, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

header('Location: index.php');
exit;
