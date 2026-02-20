<?php
// === Einsatz-Einpflege (Version 2) ===
// WICHTIG: Ändere diese Zugangsdaten vor Livegang!
// Tipp: Passwort-Hash erzeugen: https://www.php.net/manual/de/function.password-hash.php

return [
  // Benutzername
  'user' => 'webteam',

  // Passwort-Hash (Standardpasswort: "feuerwehr")
  // Bitte ersetzen!
  'pass_hash' => '$2y$10$E8v1lq7bQapXwUqP2l7T2uO1qO.9OkZxGfA4rC8b3T9c4S/7H4u8C',

  // Pfade
  'data_file' => __DIR__ . '/../data/einsaetze.json',
  'upload_dir' => __DIR__ . '/uploads',
  'max_upload_mb' => 6,
];
