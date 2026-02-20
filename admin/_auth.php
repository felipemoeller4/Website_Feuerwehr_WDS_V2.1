<?php
session_start();

function cfg(){
  static $c = null;
  if($c === null) $c = require __DIR__ . '/config.php';
  return $c;
}

function require_login(){
  if(empty($_SESSION['fw_logged_in'])){
    header('Location: login.php');
    exit;
  }
}
