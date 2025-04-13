"""Provides ranking algorithm for a list of games."""
import requests

RAWG_GAME_URL = "https://api.rawg.io/api/games/{}"
API_KEY = "1af69e1cf8664df59d23e49cd5aca2ea"

def create_ranking(preferences, game_ids):
    """Creates a list that ranks games in order based on preferences."""
    ranked_games = []
    for game_id in game_ids:
        response = requests.get(RAWG_GAME_URL.format(game_id), params={'key': API_KEY}, timeout=15)
        if response.status_code == 200:
            game_data = response.json()
            ranked_games.append({
                'id': game_id,
                'weight': weight_game(preferences, game_data),
                'name': game_data['name']
            })
    ranked_games.sort(key=lambda x: x['weight'], reverse=True)
    return ranked_games

def weight_game(preference, game_data):
    """Weights a game based on user preferences."""
    weight = 100

    if isinstance(preference['completionTime'], int) and isinstance(game_data.get('playtime'), int):
        weight -= abs(preference['completionTime'] - game_data['playtime'])

    if game_data.get('esrb_rating') and preference.get('esrbRating'):
        if game_data['esrb_rating']['name'] in preference['esrbRating']:
            weight += 50

    if preference.get('platforms'):
        for platform in game_data.get('platforms', []):
            if platform['platform']['name'] in preference['platforms']:
                weight += 50

    if preference.get('genre'):
        for genre in game_data.get('genres', []):
            if genre['name'] in preference['genre']:
                weight += 50

    if game_data.get('metacritic') is not None and preference.get('use_reviews'):
        weight += game_data['metacritic']

    return weight
