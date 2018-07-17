
export const recoveryPassword = ({ fullname, link }) => (`
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="Content-Type" content="text/html;" charset="utf-8" />
    <!-- view port meta tag -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Projekto</title>
    <style type="text/css">
        /* hacks */
        
        * {
            -webkit-text-size-adjust: none;
            -ms-text-size-adjust: none;
            max-height: 1000000px;
        }
        
        table {
            border-collapse: collapse !important;
        }
        
        #outlook a {
            padding: 0;
        }
        
        .ReadMsgBody {
            width: 100%;
        }
        
        .ExternalClass {
            width: 100%;
        }
        
        .ExternalClass * {
            line-height: 100%;
        }
        
        .ios_geo a {
            color: #1c1c1c !important;
            text-decoration: none !important;
        }
        /* responsive styles */
        
        @media only screen and (max-width: 600px) {
            /* global styles */
            .hide {
                display: none !important;
                display: none;
            }
            .blockwrap {
                display: block !important;
            }
            .showme {
                display: block !important;
                width: auto !important;
                overflow: visible !important;
                float: none !important;
                max-height: inherit !important;
                max-width: inherit !important;
                line-height: auto !important;
                margin-top: 0px !important;
                visibility: inherit !important;
            }
            *[class].movedown {
                display: table-footer-group !important;
            }
            *[class].moveup {
                display: table-header-group !important;
            }
            /* font styles */
            *[class].textright {
                text-align: right !important;
            }
            *[class].textleft {
                text-align: left !important;
            }
            *[class].textcenter {
                text-align: center !important;
            }
            *[class].font27 {
                font-size: 27px !important;
                font-weight: normal !important;
                line-height: 27px !important;
            }
            /* width and heights */
            *[class].hX {
                height: Xpx !important;
            }
            *[class].wX {
                width: Xpx !important;
            }
        }
    </style>
</head>

<body>
    <h1>Ninja ${fullname}</h1>
    <p>Alguien solicito tu cambio de contraseña para <strong><a href="https://tecninja.io">tecninja.io</a></strong></p>
    <p>Puedes hacerlo en el siguiente enlace:</p>
    <br>
    <a href='${link}'>${link}</a>
    <br>
    <p>Aun no se ha hecho ningun cambio en tu cuenta, si tiene alguna duda, háganoslo
    saber de inmediato. en https://www.tecninja.io/soporte/.</p>
    <br> El equipo de Tecninja.io ♥
</body>
</html>
`)
