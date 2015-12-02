
module.exports = {
    "server_config" : {
        "PORT" : 3000,
        "MONGO_URI" : "mongodb://localhost/hommyPi"
    },
    "google_config" : {
        "CLIENT_ID" : "585409898471-446ka7i3uu1n67rcvpglmc22rpjo0rul.apps.googleusercontent.com",
        "CLIENT_SECRET" : "zjO81hUD9zjn0ildKRsLDEin",
        "REDIRECT_URL" : "http://localhost:3000/api/google-auth/oauth2callback",
        "SERVER_KEY": "AIzaSyAGOhEfmahiZtUt2taBEK_7yNY4lewCXVs"
    },
    "soundcloud_config" : {
        "client_id": "cae89f9e5e48577f19f35cfd8c19b695",
        "client_secret": "7e1a929796e22ca7c83e6439757f793f",
        "redirect_url": "/api/soundcloud/oauth2callback",
        "response_type": "code"
    },
    "musicgraph_config" : {
        "api_key": "2c8b98d5dd6f74fb206f97646d167ace",
        "api_url": "http://api.musicgraph.com/api/v2/"
    },
    "echonest_config": {
        "api_key": "5MJOF1RKFQB3FQEF4",
        "customer_key": "9013d531c6a5ac5d1e5bf5aa428e13a5",
        "shared_secret": "Xdh9YYibRfaoXO7ouhKb6w",
        "api_url": "http://developer.echonest.com/api/v4/"
    },
    "gracenote_config": {
        "api_key": "421519829-A7108D14C3FA83A1D3BD36ABB7BA7F06",
        "client_id": "421519829",
        "user_id_test": "280162171861276227-F23669C49AE53FEAB7A5B9142938B82A"
    },
    "spotify_config": {
        "client_id": "b218da1a9e3c44e88da9df53cc0ecdb3",
        "client_secret": "71e04edf02504390896cd4b2e18642f0",
        "redirect_url": "/api/spotify/oauth2callback",
        "response_type": "code",
        "scope": "playlist-read-private+streaming+user-read-email+user-library-read"
    },
    "default_admin" : {
        "username": "admin",
        "password": "admin"
    },
    "logging" : {
        "transports" : {
            "mongodb": {
                "db" : "heroku_app32969364",
                "host" : "ds039351.mongolab.com",
                "username" : "heroku_app32969364",
                "password" : "heroku_app32969364"
            }
        }
    },
    "session_secret":"big bada boum",
    "sign_in_required":true,
    "jwtSecret": "grtGV684ezFnJftyJtdrda",
    "host_url": "http://localhost:3000",
    "configKeys": ["HOMYPI_SERVER_PORT", "HOMYPI_MONGO_URI", "HOMYPI_SPOTIFY_CLIENT_ID"]
}
