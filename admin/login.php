<?php
require __DIR__ . '/_auth.php';

$cfg = cfg();
$error = '';

if($_SERVER['REQUEST_METHOD'] === 'POST'){
  $user = trim($_POST['user'] ?? '');
  $pass = (string)($_POST['pass'] ?? '');

  if($user === $cfg['user'] && password_verify($pass, $cfg['pass_hash'])){
    $_SESSION['fw_logged_in'] = true;
    $_SESSION['fw_user'] = $user;
    header('Location: index.php');
    exit;
  }
  $error = 'Login fehlgeschlagen.';
}
?><!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Login · Einsatz-Einpflege</title>
  <link rel="stylesheet" href="../styles.css" />
</head>
<body>
  <main>
    <section class="section">
      <div class="container" style="max-width:720px">
        <div class="card panel">
          <div class="kicker">Intern</div>
          <h1 class="h2">Einsatz-Einpflege</h1>
          <p class="section-note">Bitte anmelden.</p>

          <?php if($error): ?>
            <div class="card" style="border-color: rgba(179,0,0,.35); background: rgba(179,0,0,.06); margin: 10px 0;">
              <b><?php echo htmlspecialchars($error); ?></b>
            </div>
          <?php endif; ?>

          <form class="form" method="post" autocomplete="off">
            <div class="field">
              <label for="user">Benutzer</label>
              <input id="user" name="user" placeholder="webteam" required />
            </div>
            <div class="field">
              <label for="pass">Passwort</label>
              <input id="pass" name="pass" type="password" required />
            </div>
            <div class="cta-row">
              <button class="btn primary" type="submit">Anmelden</button>
              <a class="btn" href="../intern.html">Zurück</a>
            </div>
          </form>

          <p class="section-note" style="margin-top:10px">
            Admin-Login läuft über PHP-Session (funktioniert auf IONOS Webhosting mit PHP).
          </p>
        </div>
      </div>
    </section>
  </main>
</body>
</html>
