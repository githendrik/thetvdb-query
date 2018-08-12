curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d "{
  \"apikey\": \"$1\",
  \"userkey\": \"$2\",
  \"username\": \"$3\"
}" https://api.thetvdb.com/login > .authToken.json