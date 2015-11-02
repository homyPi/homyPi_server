
module.exports = {
    "server_config" : {
        "PORT" : process.env.HOMYPI_SERVER_PORT,
        "MONGO_URI" : process.env.HOMYPI_MONGO_URI
    },
    "google_config" : {
        "CLIENT_ID" : process.env.HOMYPI_GOOGLE_CLIENT_ID,
        "HOMYPI_GOOGLE_PROJECT_NUMBER" : process.env.HOMYPI_GOOGLE_PROJECT_NUMBER,
        "CLIENT_SECRET" : process.env.HOMYPI_GOOGLE_CLIENT_SECRET,
        "REDIRECT_URL" : process.env.HOMYPI_GOOGLE_REDIRECT_URL,
        "SERVER_KEY": process.env.HOMYPI_GOOGLE_SERVER_KEY
    },
    "musicgraph_config" : {
        "api_key": process.env.HOMYPI_MUSICGRAPH_API_KEY,
        "api_url": "http://api.musicgraph.com/api/v2/"
    },
    "gracenote_config": {
        "api_key": process.env.HOMYPI_GRACENOTE_API_KEY,
        "client_id": process.env.HOMYPI_GRACENOTE_CLIENT_ID
    },
    "spotify_config": {
        "client_id": process.env.HOMYPI_SPOTIFY_CLIENT_ID,
        "client_secret": process.env.HOMYPI_SPOTIFY_CLIENT_SECRET,
        "redirect_url": process.env.HOMYPI_SPOTIFY_REDIRECT_URL,
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
    "session_secret":process.env.HOMYPI_SESSION_SECRET,
    "sign_in_required":true,
    "jwtSecret": process.env.HOMYPI_JWT_SECRET,
    "host_url": "http://localhost:3000"
}
