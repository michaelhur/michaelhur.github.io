### This notebook explores and attempts to systemically extract data from the MLB Stats API. The approach aligns with [this blog post](https://michaelhur.github.io/PyMLB)

This post has three goals:

1. From the `schedule` key, we extract the `game_pk` of the opening game of 2021 season.
2. Using this `game_pk`, we extract the `play-By-Play` data of the corresponding `game_pk.`
3. Putting it all together so that we can extract other data with a simple change to the query.

## Import Libraries

```python
import requests
import json
```

### 1. Extract `game_pk` from the `schedule` endpoints

A quick tip: 
- The schedule endpoint requires either 'sportId' or 'game_pk'.
- Former will be used to obtain schedule on the given date(s).
- Latter is used to obtain schedule given the unique game ID. Which seems like a backward operation, but think of the scenario where we want to figure out the detailed schedule such as date, venue or home/away of the specific game.
- Parameter 'sportId' should be 1

```python
## Production version url
schedule_url = 'http://statsapi.mlb.com/api/v1/schedule?sportId=1&date=04/01/2021'
```

```python
schedule_response = requests.get(schedule_url)
schedule_content = schedule_response.content
schedule_json_content = json.loads(schedule_content)
```

After a successful load of the content, we want to see what it looks like:

```python
schedule_json_content
```
A quick skim of the content implies that the most of the contents are under the key "dates." To check there are more endpoints of the schedule endpoints:

```python
schedule_json_content.keys()
```
Since there is no other keys in this json object, we will explore more of the "dates" key.

```python
dates_content = schedule_json_content['dates']
dates_content
```
The output object is a list of json object(s). Since we queried only on a single date, we will have one json object in the list. Each 'date' json object has multiple "games" tags. Each tag corresponds to a game played on the given date.

```python
games_content = dates_content[0]['games']
games_content
```
Again, it returns a list of 'game' json object. Each 'game' object contains the information about each game played on the given date. These information include:

- gamePk: The unique ID assigned to each game
- link: The API link to this game
- gameType: 'R' if regular game, 'P' if post-season, 'N' if pre-season
- gameDate, officialDate: self-explanatory
- status: has children tags such as detailedState, which tells us if the game is finished, cancelled, delayed, etc
- teams: teams played the game, their current standings, scores, home/away status

Since are interested in obtaining 'gamePk' of the opening game:

```python
gamePk_opening = games_content[0]['gamePk']
gamePk_opening
```

```python
634642
```

To sum it up, we can find 'gamePk' parameter in the following order:

- schedule -> dates -> games -> gamePk.

Or (not so) Pythonically:


```python
gamePk_opening_alt = schedule_json_content['dates'][0]['games'][0]['gamePk']
gamePk_opening_alt
```

```python
634642
```


### 2. Using `gamePk` to extract `at-bat` data

[The API document](https://beta-statsapi.mlb.com/docs/#!/game/playByPlay) says that we need to input the following url:

`http://statsapi.mlb.com/api/v1/game/{game_pk}/playByPlay`


```python
playbyplay_url = "http://statsapi.mlb.com/api/v1/game/634642/playByPlay"
```

Following the same steps as we did with the schedule endpoints:


```python
playbyplay_response = requests.get(playbyplay_url)
playbyplay_content = playbyplay_response.content
playbyplay_json_content = json.loads(playbyplay_content)
```

```python
playbyplay_json_content
```

A quick skim of the content implies that the most of the contents are under the key `allPlays`. 

```python
allPlays_content = playbyplay_json_content['allPlays']
allPlays_content
```

Again, this `allPlays` object is a list of `plays`. So we only dig into one for the exploratory work.


```python
Play1 = allPlays_content[0]
Play1
```

```python
Play1.keys()
```

Looking at the available keys of this endpoint, `result` key obviously contains the information we want: the outcome of each at bat.

```python
Play1['result']
```

    {'type': 'atBat',
     'event': 'Groundout',
     'eventType': 'field_out',
     'description': 'Marcus Semien grounds out, shortstop Gleyber Torres to first baseman Jay Bruce.',
     'rbi': 0,
     'awayScore': 0,
     'homeScore': 0}


Here we are. We need to cautious here. `type` attributes implies that there could be play type that is not `atBat`.

So we loop through each play and filter out ones whose type is not `atBat`.


```python
play_dict = {}
play_count = 0

for play in allPlays_content:
    if play['result']['type'] != 'atBat':
        pass
    
    play_count += 1
    play_outcome = play['result']['eventType']
    
    play_dict.update({play_count: play_outcome})
    
```


```python
play_dict
```

    {1: 'field_out',
     2: 'strikeout',
     3: 'field_out',
     4: 'field_out',
     5: 'strikeout',
     6: 'strikeout',
     7: 'single',
     8: 'single',
     9: 'single',
     10: 'field_out',
     11: 'strikeout',
     12: 'strikeout',
     13: 'field_out',
     14: 'single',
     15: 'strikeout',
     16: 'home_run',
     17: 'field_out',
     18: 'field_out',
     19: 'strikeout',
     20: 'strikeout',
     21: 'field_out',
     22: 'field_out',
     23: 'field_out',
     24: 'strikeout',
     25: 'walk',
     26: 'strikeout',
     27: 'field_out',
     28: 'strikeout',
     29: 'field_out',
     30: 'strikeout',
     31: 'field_out',
     32: 'single',
     33: 'field_out',
     34: 'field_out',
     35: 'field_out',
     36: 'field_out',
     37: 'walk',
     38: 'single',
     39: 'field_out',
     40: 'strikeout',
     41: 'home_run',
     42: 'walk',
     43: 'grounded_into_double_play',
     44: 'single',
     45: 'force_out',
     46: 'strikeout',
     47: 'walk',
     48: 'field_out',
     49: 'field_out',
     50: 'single',
     51: 'field_out',
     52: 'caught_stealing_2b',
     53: 'single',
     54: 'field_out',
     55: 'single',
     56: 'walk',
     57: 'grounded_into_double_play',
     58: 'strikeout',
     59: 'field_out',
     60: 'field_out',
     61: 'walk',
     62: 'strikeout',
     63: 'field_out',
     64: 'strikeout',
     65: 'single',
     66: 'field_out',
     67: 'strikeout',
     68: 'field_out',
     69: 'walk',
     70: 'strikeout',
     71: 'walk',
     72: 'fielders_choice_out',
     73: 'strikeout',
     74: 'double',
     75: 'strikeout',
     76: 'strikeout',
     77: 'strikeout',
     78: 'strikeout',
     79: 'strikeout',
     80: 'strikeout'}



Finally, we achieved what we wanted. The outcome of each at-bat.

 
### 3. Putting it altogether

First we build a helper function that can be used generally.


```python
import time

def get_json(url):
    ## get_json: str -> json
    ## get_json() function takes 'url' and returns the response in json format from the MLB Stats API.
    
    response = requests.get(url)
    if (response.status_code != 200):
        print('status code: %s' % response.status_code)
        time.sleep(1.0)
        get_json(url)
    else:
        content = response.content
        json_content = json.loads(content)
        return(json_content)
```


```python
def extract_game_id(schedule_json):
    ## extract_game_id: json -> listof int
    ## extract_game_id() function takes a schedule response object and returns a list of game IDs.
    
    if schedule_json == {}:
        return []

    gameID_list = []
    
    dates = schedule_json['dates']
    
    for day in dates:
        games = day['games']
        
        for game in games:
            gameID = game['gamePk']
            gameID_list.append(gameID)
   
    
    return(gameID_list)
```


```python
def get_game_ids(date, endDate = None, teamId = None):
    ## get_game_ids: str int str str -> listof int
    ## get_game_ids() function returns the list of game IDs.
    ## date must be of format "YYYY-MM-DD". 
    ## If date is used without end_date, then it returns the list of game IDs on the input date.
    ## If end_date is inputted, then it returns the list of game IDs in the period of date and end_date.
    ## If teamID is inputted, then it will return game ID's that the corresponding team played; otherwise, all.
    
    
    base_schedule_url = "http://statsapi.mlb.com/api/v1/schedule?sportId=1"
    alt_base_url = "https://beta-statsapi.mlb.com:443/api/v1/schedule?sportId=1"
    suffix = ""

    if endDate is not None:
        suffix = "&startDate=" + date + "&endDate=" + endDate
    
    else:
        suffix = "&date=" + date
        
    if teamId is not None:
        suffix = suffix + "&teamId=" + str(teamId)
        
    
    try:
        url = base_schedule_url + suffix
        #print(url)
        schedule_content = get_json(url)
        #print('status code: %s' % response.status_code)

    except:
        #print('Trying alternate route...')
        url = alt_base_url + suffix
        #print(url)
        schedule_content = get_json(url)
   
    gameIDs = extract_game_id(schedule_content)

    return(gameIDs)
```


```python
def get_atbat_outcome(listofgameIDs):
    
    gameID_dict = {}
    
    for gameID in listofgameIDs:
        
        try:
            url =  "http://statsapi.mlb.com/api/v1/game/" + str(gameID) + "/playByPlay"
            playbyplay_content = get_json(url)
            
        except:
            #print('Trying alternate route...')
            url = "https://beta-statsapi.mlb.com:443/api/v1/game" + str(gameID) + "/playByPlay"
            playbyplay_content = get_json(url)

    
        allPlays_content = playbyplay_content['allPlays']
    
        play_dict = {}
        play_count = 0

        for play in allPlays_content:
            if play['result']['type'] != 'atBat':
                pass

            play_count += 1
            play_outcome = play['result']['eventType']

            play_dict.update({play_count: play_outcome})
            
        gameID_dict.update({gameID:play_dict})
        
    return(gameID_dict)
```
