---
title: "PyMLB to plot Pitch f/x data"
tags:
  - Python
  - API
  - Wrapper
  - Baseball
  - MLB
  - Data
  - Plotly
toc: true
toc_label: "On this page"
---


This time we will look at what the strike zone looks like for a Korean Pitcher "Ryu Hyun-Jin." 


```python
from PyMLB import *
```

#### 1. Pull schedule data

First we need to pull all the game ID for this particular pitcher for this season. Using [get_schedule() function we coded last time](https://michaelhur.github.io/PyMLB/), we will extract schedule data. 

Unfortunately, we can only pull the schedule data at the team level. So we will extract all the game his team "Toronto Blue Jays" has played this season, then filter the games he has played.


```python
bluejays_schedule = get_schedule(teamId = 141, startDate = "2021-04-01", endDate = yesterday)
```

The output looks like this:


```python
next(iter(bluejays_schedule.values()))
```

    [{'gamePk': 634642,
      'home': {'ID': 147, 'name': 'New York Yankees'},
      'away': {'ID': 141, 'name': 'Toronto Blue Jays'}}]

From this schedule dictionary, we will extract only the `gamePk` which will be used to pull pitch f/x data for that particular game.


```python
gamePks = [v[0]['gamePk'] for k, v in bluejays_schedule.items()]
```

And the first 10 gamePk's look like:


```python
gamePks[0:10]
```

    [634642,
     634644,
     634607,
     634612,
     634635,
     634583,
     634545,
     634512,
     632227,
     632208]



#### 2. Pitch fx data

Next step is to extract pitch fx data for each game. We will loop through each of gamePks we obtains above. Again, using get_pitchfx() function we coded last time:


```python
pitchfx = get_pitchfx(634642)
```

As a reminder, get_pitchfx() returns pitch f/x data as a dictionary object, where each key on the top level corresponds to each "at bat". The second tier dictionary stores the pitch fx data we want, so we will extact them systematically.

In order to make analysis easier (or coding for the analysis easier), we will convert this dictionary object to a dataframe object. We remove the non-pitchfx data from the dictionary:


```python
pitches = {k:v for k, v in pitchfx.items() if k != "home_umpire"}
```


```python
next(iter(pitches.values()))
```

    {'inning': 1,
     'home': 'home',
     'pitcher': {'id': 543037,
      'fullName': 'Gerrit Cole',
      'link': '/api/v1/people/543037'},
     'batter': {'id': 543760,
      'fullName': 'Marcus Semien',
      'link': '/api/v1/people/543760'},
     'pitchHand': 'R',
     'batSide': 'R',
     'pitchData': [{'call': 'ball',
       'sz_top': 3.25,
       'sz_bottom': 1.53,
       'x': -0.5,
       'z': 3.54}]}


We will carry (almost) all the data in the dictionary into the dataframe object.

1. Define an empty dataframe
2. Loop through each at bat
3. Loop through each pitch
4. Concatenate one row in each loop


```python
import pandas as pd

## Since we are carrying all the information to the dataframe object,
## we will label all the columns as is.
pd_index = ["atbat", "pitchCount", "inning", "home", "pitcher", "pitcherId", "pitchHand",
             "batter", "batterId", "batSide", "sz_top", "sz_bottom", "x", "z", "call", "actual"]

## Create an empty dataframe with only the column names defined.
new_df = pd.DataFrame(index = pd_index).T

## For loop through each at bat
for k, v in pitches.items():
    atbat = k
    inning = v['inning']
    home = v['home']
    pitcher = v['pitcher']['fullName']
    pitcherId = v['pitcher']['id']
    pitchHand = v['pitchHand']
    batter = v['batter']['fullName']
    batterId = v['batter']['id']
    batSide = v['batSide']

    pitchCount = 0
    
    ## For loop through each pitch
    for p in v['pitchData']:
        pitchCount += 1
        sz_top = p['sz_top']
        sz_bottom = p['sz_bottom']
        x = p['x']
        z = p['z']
        call = p['call']
        
        ## Given the actual strike zone, determine whether the call made was strike or not
        actual = "strike" if (sz_bottom <= z <= sz_top) and (-0.71 < x < 0.71) else "ball"
        
        ## Each pitch will be turned into a single-row dataframe
        new_row = [atbat, pitchCount, inning, home, pitcher, pitcherId, pitchHand,
                   batter, batterId, batSide, sz_top, sz_bottom, x, z, call, actual]

        new_df1 = pd.DataFrame(new_row, index = pd_index).T
        
        ## This newly defined data frame will be concatenated to the already existing dataframe.
        new_df = pd.concat([new_df,new_df1])

## New column definitions:
## 'calledRight': Each entry is a boolean, whether the call made is correct or not
new_df['calledRight'] = (new_df['call'] == new_df['actual'])
new_df['umpire'] = pitchfx['home_umpire']
new_df.reset_index(drop = True)
```

We will put this into the function so that we can apply it to any other pitch fx data.


```python
def to_df(pitchfx):
    
    pitches = {k:v for k, v in pitchfx.items() if k != "home_umpire"}    

    pd_index = ["atbat", "pitchCount", "inning", "home", "pitcher", "pitcherId", "pitchHand",
                 "batter", "batterId", "batSide", "sz_top", "sz_bottom", "x", "z", "call", "actual"]

    new_df = pd.DataFrame(index = pd_index).T

    for k, v in pitches.items():
        atbat = k
        inning = v['inning']
        home = v['home']
        pitcher = v['pitcher']['fullName']
        pitcherId = v['pitcher']['id']
        pitchHand = v['pitchHand']
        batter = v['batter']['fullName']
        batterId = v['batter']['id']
        batSide = v['batSide']

        pitchCount = 0   

        for p in v['pitchData']:
            pitchCount += 1
            sz_top = p['sz_top']
            sz_bottom = p['sz_bottom']
            x = p['x']
            z = p['z']
            call = p['call']

            actual = "strike" if (sz_bottom <= z <= sz_top) and (-0.71 < x < 0.71) else "ball"

            new_row = [atbat, pitchCount, inning, home, pitcher, pitcherId, pitchHand,
                       batter, batterId, batSide, sz_top, sz_bottom, x, z, call, actual]

            new_df1 = pd.DataFrame(new_row, index = pd_index).T
            new_df = pd.concat([new_df,new_df1])

    new_df['calledRight'] = (new_df['call'] == new_df['actual'])
    new_df['umpire'] = pitchfx['home_umpire']
    new_df.reset_index(drop = True)
    
    return(new_df)
```

Using one of the gamePk, we will try plot pitch fx data. Once succeed, we will apply to all gamePks.


```python
df_634642 = to_df(pitchfx)
```

```python
import plotly.express as px

## Plot scatter plot, grouped by strike and ball calls
fig = px.scatter(df_634642, x="x", y="z", color="call")

## Draw a rectangle that represents the strike zone
fig.add_shape(type="rect",
    xref = "x", yref = "y",
    x0 = -0.71, y0 = 1.5,
    x1 = 0.71, y1 = 3.5,
    line=dict(
        color="RoyalBlue",
        width=3,
    )
)
fig.update_traces(marker=dict(size=12,
                              line=dict(width=2,
                                        color='DarkSlateGrey')),
                  selector=dict(mode='markers'))

fig.show()
```

![](https://michaelhur.github.io/images/20210611/1.png)

In this game, we see quite a number of strikes that were placed well outside the strike zone. On the contrary, we see relatively fewer `ball` called even if it passed through the strike zone.

We want to see how they differ depending on home/away.


```python
fig = px.scatter(df_634642, x="x", y="z", color="call", facet_col="home",
          labels={"call": "Call"})

fig.add_shape(type="rect",
    xref = "x", yref = "y",
    x0 = -0.71, y0 = 1.5,
    x1 = 0.71, y1 = 3.5,
    line=dict(
        color="RoyalBlue",
        width=3,
    )
)

fig.add_shape(type="rect",
    xref = "x2", yref = "y",
    x0 = -0.71, y0 = 1.5,
    x1 = 0.71, y1 = 3.5,
    line=dict(
        color="RoyalBlue",
        width=3,
    )
)

fig.update_traces(marker=dict(size=12,
                              line=dict(width=2,
                                        color='DarkSlateGrey')),
                  selector=dict(mode='markers'))

fig.show()
```

![](https://michaelhur.github.io/images/20210611/2.png)



Interestingly, of all pitches placed in the lower right corner of the strike zone, there were more pitches called `ball` for the away team's pitcher than the home team's pitcher.

Now we look at all the strike calls and see where they landed at.


```python
print(df_634642[df_634642.call == "strike"]['calledRight'].value_counts(normalize = True)*100)
print("\n")
print(df_634642[df_634642.call == "strike"].groupby(['home'])['calledRight'].value_counts(normalize = True)*100)
```

    True     52.941176
    False    47.058824
    Name: calledRight, dtype: float64
    
    
    home  calledRight
    away  True           53.703704
          False          46.296296
    home  True           52.083333
          False          47.916667
    Name: calledRight, dtype: float64


Interestingly of all `strike` calls in this game, only 52.9% of the calls were called correctly. In other words, 47.1% of all strike calls should have been called `ball`.

On the bright side, the proportion of correctly called strikes to incorrectly called strikes are almost the same at the home/away level. So the umpire was not biased againt the away team.

Visual inspection shows:


```python
fig = px.scatter(df_634642[df_634642.call == "strike"], x="x", y="z", color="calledRight", facet_col="home",
          labels={"call": "Call"})

fig.add_shape(type="rect",
    xref = "x", yref = "y",
    x0 = -0.71, y0 = 1.5,
    x1 = 0.71, y1 = 3.5,
    line=dict(
        color="RoyalBlue",
        width=3,
    )
)

fig.add_shape(type="rect",
    xref = "x2", yref = "y",
    x0 = -0.71, y0 = 1.5,
    x1 = 0.71, y1 = 3.5,
    line=dict(
        color="RoyalBlue",
        width=3,
    )
)

fig.update_traces(marker=dict(size=12,
                              line=dict(width=2,
                                        color='DarkSlateGrey')),
                  selector=dict(mode='markers'))

fig.show()
```

![](https://michaelhur.github.io/images/20210611/3.png)


- Looking at the home team pitcher's strike zone, we see only 3 strike calls that are labelled "incorrectly called" that lie in the strike zone. This is due to the process of fixing the strike zone for all batters. 

- For the home pitchers, most of the incorrectly called strikes are placed on the bottom right corner of the plot. On the other hand, for the away pitchers, it were mostly `wide pitches` that were called strike incorrectly.

Now look at all the `ball` calls.


```python
print(df_634642[df_634642.call == "ball"]['calledRight'].value_counts(normalize = True)*100)
print("\n")
print(df_634642[df_634642.call == "ball"].groupby(['home'])['calledRight'].value_counts(normalize = True)*100)
```

    True     97.744361
    False     2.255639
    Name: calledRight, dtype: float64
    
    
    home  calledRight
    away  True           98.717949
          False           1.282051
    home  True           96.363636
          False           3.636364
    Name: calledRight, dtype: float64


Umpires are doing better job on this side of the call. 97% of all `balls` are called correctly. My guess is that umpires are more conservative on calling `balls` than `strikes`.

Enough with the opening game of the season, let's get back in the game. Follow the same process for all of Ryu's game.


```python
from tqdm import tqdm
```


```python
pd_index = ["atbat", "pitchCount", "inning", "home", "pitcher", "pitcherId", "pitchHand",
                 "batter", "batterId", "batSide", "sz_top", "sz_bottom", "x", "z", "call", "actual"]

ryu_df = pd.DataFrame(index = pd_index).T

for gamePk in tqdm(gamePks):
    #print(gamePk)
    df_new = to_df(get_pitchfx(gamePk))
    ryu_df = pd.concat([ryu_df,df_new])

ryu_df = ryu_df[ryu_df.pitcherId == 547943]
ryu_df = ryu_df.reset_index(drop = True)
```

    100%|██████████| 66/66 [01:14<00:00,  1.13s/it]



```python
fig = px.scatter(ryu_df, x="x", y="z", color="call")

fig.add_shape(type="rect",
    xref = "x", yref = "y",
    x0 = -0.71, y0 = 1.5,
    x1 = 0.71, y1 = 3.5,
    line=dict(
        color="RoyalBlue",
        width=3,
    )
)
fig.update_traces(marker=dict(size=12,
                              line=dict(width=2,
                                        color='DarkSlateGrey')),
                  selector=dict(mode='markers'))

fig.show()
```


![](https://michaelhur.github.io/images/20210611/4.png)


Looking at only the `strike` calls:


```python
fig = px.scatter(ryu_df[ryu_df['call'] == 'strike'], x="x", y="z")

fig.add_shape(type="rect",
    xref = "x", yref = "y",
    x0 = -0.71, y0 = 1.5,
    x1 = 0.71, y1 = 3.5,
    line=dict(
        color="RoyalBlue",
        width=3,
    )
)
fig.update_traces(marker=dict(size=12,
                              line=dict(width=2,
                                        color='DarkSlateGrey')),
                  selector=dict(mode='markers'))

fig.show()
```

![](https://michaelhur.github.io/images/20210611/5.png)


Visual inspection implies that Ryu's strike zone is wider to both sides. However, when we also look at all the `ball` calls, we see:


```python
fig = px.scatter(ryu_df, x="x", y="z", color="calledRight", facet_col="call",
          labels={"calledRight": "called Right"})

fig.add_shape(type="rect",
    xref = "x", yref = "y",
    x0 = -0.71, y0 = 1.5,
    x1 = 0.71, y1 = 3.5,
    line=dict(
        color="RoyalBlue",
        width=3,
    )
)

fig.add_shape(type="rect",
    xref = "x2", yref = "y",
    x0 = -0.71, y0 = 1.5,
    x1 = 0.71, y1 = 3.5,
    line=dict(
        color="RoyalBlue",
        width=3,
    )
)

fig.update_traces(marker=dict(size=12,
                              line=dict(width=2,
                                        color='DarkSlateGrey')),
                  selector=dict(mode='markers'))

fig.show()
```

![](https://michaelhur.github.io/images/20210611/6.png)


Almost all `ball` calls are called correctly, and there are so many `ball` calls landed at the same region as those `strike` calls to the sides of the strike zone. This implies that he has pitches they moves horizontally, leading to `swinging strikes`.

These are some of the very few insights one can derive from the visualization of pitch fx data. One can inspect this at the umpire level and see how they perform.

#### Try it yourself!

Using the following code, you can try plotting them yourself.


```python
from PyMLB import *
import pandas as pd

def to_df(pitchfx):
    
    pitches = {k:v for k, v in pitchfx.items() if k != "home_umpire"}    

    pd_index = ["atbat", "pitchCount", "inning", "home", "pitcher", "pitcherId", "pitchHand",
                 "batter", "batterId", "batSide", "sz_top", "sz_bottom", "x", "z", "call", "actual"]

    new_df = pd.DataFrame(index = pd_index).T

    for k, v in pitches.items():
        atbat = k
        inning = v['inning']
        home = v['home']
        pitcher = v['pitcher']['fullName']
        pitcherId = v['pitcher']['id']
        pitchHand = v['pitchHand']
        batter = v['batter']['fullName']
        batterId = v['batter']['id']
        batSide = v['batSide']

        pitchCount = 0   

        for p in v['pitchData']:
            pitchCount += 1
            sz_top = p['sz_top']
            sz_bottom = p['sz_bottom']
            x = p['x']
            z = p['z']
            call = p['call']

            actual = "strike" if (sz_bottom <= z <= sz_top) and (-0.71 < x < 0.71) else "ball"

            new_row = [atbat, pitchCount, inning, home, pitcher, pitcherId, pitchHand,
                       batter, batterId, batSide, sz_top, sz_bottom, x, z, call, actual]

            new_df1 = pd.DataFrame(new_row, index = pd_index).T
            new_df = pd.concat([new_df,new_df1])

    new_df['calledRight'] = (new_df['call'] == new_df['actual'])
    new_df['umpire'] = pitchfx['home_umpire']
    new_df.reset_index(drop = True)
    
    return(new_df)
```
