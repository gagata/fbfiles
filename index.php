<!DOCTYPE html>
<html>
    <head lang="en">
        <meta charset="UTF-8">
        <title>Facebook files application</title>
        <!-- Latest compiled and minified CSS -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">

        <!-- Optional theme -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap-theme.min.css">
        <script src="https://code.jquery.com/jquery-2.1.1.min.js" type="text/javascript"></script>

        <!-- dialog box -->
        <link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
        <script src="//code.jquery.com/jquery-1.10.2.js"></script>
        <script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>

        <!--TODO: czy uzywamy embed.ly? bo chyba przestalo dzialac...-->
        <script src="https://cdn.embed.ly/jquery.embedly-3.1.1.min.js" type="text/javascript"></script>

        <!--facebook javascript sdk-->
        <script src="//connect.facebook.net/en_US/sdk.js"></script>

        <!-- czcionka Lato -->
        <link href='https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic&subset=latin,latin-ext' rel='stylesheet' type='text/css'>

        <link href="styles/styles.css" rel="stylesheet">

        <script src="js/core.js" type="text/javascript"></script>
        <script src="js/groups_main.js" type="text/javascript"></script>
        <script src="js/notify_main.js" type="text/javascript"></script>
        <script src="js/about_main.js" type="text/javascript"></script>
        <script src="js/contact_main.js" type="text/javascript"></script>
        <script src="js/files_main.js" type="text/javascript"></script>
        <script src="js/files_present.js" type="text/javascript"></script>
        <script src="js/utils.js" type="text/javascript"></script>

    </head>
    <body>
        <div id="fb-root"></div>

        <div class="navbar navbar-inverse navbar-fixed-top" id="bgf-navbar">
            <div class="container">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" href="/">Facebook Group Files App</a>
                </div>
                <div class="collapse navbar-collapse">
                    <ul class="nav navbar-nav">
                        <li><a href="#notify">Notify</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div><!--/.nav-collapse -->
            </div>
        </div>


        <div id="page" class="container body">
            <!-- content loaded dynamically -->
        </div>


        <!-- Latest compiled and minified JavaScript -->
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
    </body>
</html>

