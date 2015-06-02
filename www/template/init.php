<?
//debug on
error_reporting( E_ALL & ~E_NOTICE & ~E_DEPRECATED );
//error_reporting(E_ALL ^ E_DEPRECATED);
ini_set('display_startup_errors', 1);
ini_set('display_errors' , 1);

//paths
//http
define('CUR_URI',$_SERVER["REQUEST_URI"]);
$curUri = explode('?',CUR_URI);
$curUri = reset($curUri);
define('CUR_PAGE',$curUri);
define('SITE_TEMPLATE_PATH','/www/template');
define('SITE_IMG_PATH',SITE_TEMPLATE_PATH.'/build/img/');
?>