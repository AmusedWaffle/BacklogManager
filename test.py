import requests

RAWG_SEARCH_URL = "https://api.rawg.io/api/games"
API_KEY = "1af69e1cf8664df59d23e49cd5aca2ea"
"""
params = {
        'key': API_KEY,  
        'search': "elden ring"
    }

response = requests.get(RAWG_SEARCH_URL, params=params)
results = response.json().get('results', [])
games = [{'id': game['id'], 'name': game['name']} for game in results]
print(games)"""

RAWG_GAME_DETAILS_URL = "https://api.rawg.io/api/games/{}"

results = []

response = requests.get(RAWG_GAME_DETAILS_URL.format(326243), params={'key': API_KEY})
if response.status_code == 200:
    game_data = response.json()
    results.append({'name': game_data['name'], 'image': game_data['ratings'], 'release': game_data['released']})
"""    genres = [genre["name"] for genre in game_data.get("genres", [])]
    developers = [dev["name"] for dev in game_data.get("developers", [])]
    platforms = [p['platform']['name'] for p in game_data['platforms']]
    print("Genres:", genres)
    print("Developers:", developers)
    print("platform:", platforms)"""
print(results)