$k = Get-Content "C:\Users\achun\.openclaw\workspace\.secrets\openai_key.txt"
$env:OPENAI_API_KEY = $k
node C:\Users\achun\.openclaw\workspace\yeppo-voice-assistant\server.js
