---
title: "Sudoku: A systemic approach to Sudoku - Part 2"
tags:
  - Python
  - Sudoku
  - Crook
  - Algorithm
toc: false
---

## Rule of Sudoku

- Every square has to contain a single number

- Only the numbers between 1 and 9 (inclusive) can be used

- Each 3×3 subgrid can only contain each number from 1 to 9 once

- Each column can only contain each number from 1 to 9 once

- Each row can only contain each number from 1 to 9 once

## Approaches

Given an unsolved sudoku puzzle, our approach is to

### 2. [Crook's algorithm](https://www.ams.org/notices/200904/rtx090400460p.pdf)

Crook's algorithm is basically is how a human being would solve the problem. There are a few terms that we need to define in order to put them together

1. `Mark-up`: a `mark-up` of a cell is a list of all the possible given the numbers that are already in the grid. For example, the `mark-up` of the very first cell of the grid below is `5` and `7`. We can use mark-up instead of trying each number between 1 and 9. This means a fewer cheks to do and shorter computing time.

![An example of mark-up](http://pi.math.cornell.edu/~mec/Summer2009/meerkamp/Site/Solving_any_Sudoku_II_files/markup.png)

2. `Preemptive set` is a list of `k` numbers (2 <= k <= 8), each between 1 and 9, with the property that only those k numbers can fill k cells. For example, `mark-ups` in cell (1,1) and (2,1) for a preemptive set of (5, 7). Those `2` cells can be filled in by only (5, 7) which is a set of `2` numbers. 

    This might sound ambiguous, but is very useful when eliminating candidates from the mark-up of a cell in the same column (or row or 3x3 subgrid). Since numbers 5 and 7 must each occupy one of cells (1, 1) and (2, 1), 5 cannot be in the cell (8,1) in the same column. 5 is then eliminated from the `mark-up` of the cell (8,1), leaving it with the only one candidate 4. i.e. the cell (8,1) must be filled with 4.


![An example of preemptive set](http://pi.math.cornell.edu/~mec/Summer2009/meerkamp/Site/Solving_any_Sudoku_II_files/preemptive_odd.png)

#### Crook's Algorithm

1. Mark up all the empty cells.

    a) If the mark-up consists of only one number, fill in the cell with the number.
    
    b) Remove such number from the mark-up of the cells in the same row, column and subgrid.
    
2. Find preemptive sets.

    a) Whenever a preemptive set is found, cross out the numbers in the preemptive set from the `mark-up` of the cells in the same row, column or subgrid.
    
    b) Repeat until you find no more preemtive set or rule of Sudoku is violated.
    
3. If the sudoku is not solved by then, or rule of sudoku has not been violated, apply backtracking method from here, but only using the numbers the mark-up instead of all the numbers from 1 to 9.

#### Helper Functions

We will build helper functions that check rules of sudoku.


```python
## This puts above two rule checkers together into one function.

def check_conditions(grid, row, col, n):   
    ## check_conditions: list of lists, int, int, int -> boolean
    
    if n in grid[row]:
        return False
    
    if any([r[col] == n for r in grid]):
        return False
    
    r_start = (row // 3) * 3
    c_start = (col // 3) * 3
    
    for r, c in itertools.product(range(3),range(3)):
        if grid[r_start + r][c_start + c] == n:
            return False
        
    return True
```


```python
def next_empty(grid):
    ## next_empty(): listof lists -> int, int
    ## next_empty() is a helper function that searches for the next empty cell in the given sudoku puzzle
    for row in grid:
        if 0 in row:
            return (grid.index(row), row.index(0))
        
    return None, None
```


```python
def validateSolution(sudoku):
    ## To check if it is a valid solution:
    
    ## If any cell is empty:
    if any([0 in row for row in sudoku]):
        return(False)
    
    for n in range(1,10):
        for row in sudoku:
            if n not in row:
                return(False)
            
            for col in range(9):
                if n not in [r[col] for r in sudoku]:
                    return(False)
                
    
        ## In fact, if row and column-wise conditions are met, then subgrid condition is automatically met. 
        ## But we want to check it explicitly.
        for r_start, c_start in itertools.product(range(3),range(3)):
            if not any([n not in row[c_start * 3: c_start * 3 + 3] for row in grid[r_start * 3: r_start * 3 + 3]]):
                return(False)
            
    return(True)
```

 

## Crook's Algorithm

1. Mark up all the empty cells.

    a) If the mark-up consists of only one number, fill in the cell with the number.
    
    b) Remove such number from the mark-up of the cells in the same row, column and subgrid.
    
2. Find preemptive sets.

    a) Whenever a preemptive set is found, cross out the numbers in the preemptive set from the `mark-up` of the cells in the same row, column or subgrid.
    
    b) Repeat until you find no more preemtive set or rule of Sudoku is violated.
    
3. If the sudoku is not solved by then, or rule of sudoku has not been violated, pick any empty cell. Make a guess (i.e. pick a number from the markups), then repeat steps 1 and 2 until you can reduce it as much as possible. Repeat step 3 until the rule is violated or the puzzle is solved.

#### Breakdowns:

#### Mark up

1. Define a function that finds the mark-up of an empty cell.

- check_conditions() function come in handy.

- Hunch is that we find the row and column index of an empty cell using the next_empty() function, then use check_conditions() function to find mark-ups.


```python
grid = [[2,9,5,7,0,0,8,6,0],
         [0,3,1,8,6,5,0,2,0],
         [8,0,6,0,0,0,0,0,0],
         [0,0,7,0,5,0,0,0,6],
         [0,0,0,3,8,7,0,0,0],
         [5,0,0,0,1,6,7,0,0],
         [0,0,0,5,0,0,1,0,9],
         [0,2,0,6,0,0,3,5,0],
         [0,5,4,0,0,8,6,7,2]]
```

Or more easier to read:

![An example of mark-up](http://pi.math.cornell.edu/~mec/Summer2009/meerkamp/Site/Solving_any_Sudoku_II_files/mepham_imcomp_real.png)


```python
## Working with one empty cell. The last cell in the first row.
r1, c1 = 0, 8
```


```python
import itertools 

markup = []
for candidate in range(1,10):
    if check_conditions(grid, r1, c1, candidate):
        markup.append(candidate)
    
markup
```




    [1, 3, 4]



In order to apply this We cannot use next_empty() without making some manipulation to the function, since there is no insertion at this point. So we will simply loop through each and every cell for the time being


```python
markup_list = []

for row in range(9):
    r = [[]]*9
    
    for col in range(9):
        markup = []
        if grid[row][col] != 0:
            continue

        for candidate in range(1,10):
            if check_conditions(grid, row, col, candidate):
                markup.append(candidate)

        r[col] = markup

    markup_list.append(r)
```


```python
markup_list
```




    [[[], [], [], [], [3, 4], [1, 3, 4], [], [], [1, 3, 4]],
     [[4, 7], [], [], [], [], [], [4, 9], [], [4, 7]],
     [[],
      [4, 7],
      [],
      [1, 2, 4, 9],
      [2, 3, 4, 9],
      [1, 2, 3, 4, 9],
      [4, 5, 9],
      [1, 3, 4, 9],
      [1, 3, 4, 5, 7]],
     [[1, 3, 4, 9],
      [1, 4, 8],
      [],
      [2, 4, 9],
      [],
      [2, 4, 9],
      [2, 4, 9],
      [1, 3, 4, 8, 9],
      []],
     [[1, 4, 6, 9],
      [1, 4, 6],
      [2, 9],
      [],
      [],
      [],
      [2, 4, 5, 9],
      [1, 4, 9],
      [1, 4, 5]],
     [[], [4, 8], [2, 3, 8, 9], [2, 4, 9], [], [], [], [3, 4, 8, 9], [3, 4, 8]],
     [[3, 6, 7], [6, 7, 8], [3, 8], [], [2, 3, 4, 7], [2, 3, 4], [], [4, 8], []],
     [[1, 7, 9], [], [8, 9], [], [4, 7, 9], [1, 4, 9], [], [], [4, 8]],
     [[1, 3, 9], [], [], [1, 9], [3, 9], [], [], [], []]]



![](http://pi.math.cornell.edu/~mec/Summer2009/meerkamp/Site/Solving_any_Sudoku_II_files/mepham_markup.png)


Putting it into a function so that we can use it repeatedly.


```python
def get_markup(grid):
    ## get_markup(): listof listof int -> listof listof int
    ## This helper function returns a list of list of integers
    ## where each list of integer is a markup of a corresponding cell 
    markup_list = []

    for row in range(9):
        r = [[]]*9

        for col in range(9):
            markup = []
            if grid[row][col] != 0:
                continue

            for candidate in range(1,10):
                if check_conditions(grid, row, col, candidate):
                    markup.append(candidate)

            r[col] = markup

        markup_list.append(r)
        
    return(markup_list)
```


```python
markups = get_markup(grid)
markups
```




    [[[], [], [], [], [3, 4], [1, 3, 4], [], [], [1, 3, 4]],
     [[4, 7], [], [], [], [], [], [4, 9], [], [4, 7]],
     [[],
      [4, 7],
      [],
      [1, 2, 4, 9],
      [2, 3, 4, 9],
      [1, 2, 3, 4, 9],
      [4, 5, 9],
      [1, 3, 4, 9],
      [1, 3, 4, 5, 7]],
     [[1, 3, 4, 9],
      [1, 4, 8],
      [],
      [2, 4, 9],
      [],
      [2, 4, 9],
      [2, 4, 9],
      [1, 3, 4, 8, 9],
      []],
     [[1, 4, 6, 9],
      [1, 4, 6],
      [2, 9],
      [],
      [],
      [],
      [2, 4, 5, 9],
      [1, 4, 9],
      [1, 4, 5]],
     [[], [4, 8], [2, 3, 8, 9], [2, 4, 9], [], [], [], [3, 4, 8, 9], [3, 4, 8]],
     [[3, 6, 7], [6, 7, 8], [3, 8], [], [2, 3, 4, 7], [2, 3, 4], [], [4, 8], []],
     [[1, 7, 9], [], [8, 9], [], [4, 7, 9], [1, 4, 9], [], [], [4, 8]],
     [[1, 3, 9], [], [], [1, 9], [3, 9], [], [], [], []]]



#### Preemptive set

Here, we will work with the markups to find the preemptive set. First we will try to find the preemptive set then find a way to find smaller set by eliminating.

For a list of m numbers to be preemptive, it must have m different cells with the same m markups.


```python
## r2 is the second row of the grid
r2 =   [[4, 7], [], [], [], [], [], [4, 9], [], [4, 7]]
r2
```




    [[4, 7], [], [], [], [], [], [4, 9], [], [4, 7]]




```python
preemptive_list = []

for m in r2:
    if len(m) != 0:
        if len(m) == r2.count(m):
            if m not in preemptive_list:
                preemptive_list.append(m)
                
preemptive_list            
```




    [[4, 7]]



Now we want to eliminate these numbers from other cell's markups.


```python
for p in preemptive_list:
    print([[y for y in x if (y not in p)] if x != p else p for x in r2])
```

    [[4, 7], [], [], [], [], [], [9], [], [4, 7]]


This can be easily manipulated to be applied to column-wise and subgrid-wise operation.

Putting it altogether so that we find preemptive sets for each column, row and subgrid, then eliminate markups using those preemptive sets.

We will first define functions to do so:


```python
def get_preemptive(listofMarkup):
    
    preemptive_list = []
    for m in listofMarkup:
        if len(m) != 0:
            if len(m) == listofMarkup.count(m):
                if m not in preemptive_list:
                    preemptive_list.append(m)
    return(preemptive_list)
```


```python
get_preemptive(get_markup(grid)[1])
```




    [[4, 7]]




```python
def reduce_markup(listofMarkup, preemptive_list):
    # compute row-, col- or subgrid-wise
    if len(preemptive_list) == 0:
        return(listofMarkup)
    
    for p in preemptive_list:
        return([[m for m in l if (m not in p)] if l != p else p for l in listofMarkup])
```


```python
grid = [[2,9,5,7,0,0,8,6,0],
         [0,3,1,8,6,5,0,2,0],
         [8,0,6,0,0,0,0,0,0],
         [0,0,7,0,5,0,0,0,6],
         [0,0,0,3,8,7,0,0,0],
         [5,0,0,0,1,6,7,0,0],
         [0,0,0,5,0,0,1,0,9],
         [0,2,0,6,0,0,3,5,0],
         [0,5,4,0,0,8,6,7,2]]
```


```python
reduce_markup(get_markup(grid)[1], get_preemptive(get_markup(grid)[1]))
```




    [[4, 7], [], [], [], [], [], [9], [], [4, 7]]



#### Now putting it all together...

1. We will find markups for all empty cells in the grid

2. Find preemptive sets for all rows, columns and subgrids, then eliminate candidates from markups

3. If only the markup consists of only one candidate, fill in the cell with such number, then remove this number from all markups in the same row, column and subgrid.

4. Repeat until we cannot reduce the markups



```python
for row in range(9):
    markup = markups[row]
    preemptives = get_preemptive(markup)
    markup = reduce_markup(markup, preemptives)
```

This line will eliminate markups using preemptive sets in each row. Column can be done in the same manner. We will use `list(map(list, zip(*l)))`, where `l` is a list of our interest, to transpose the list. Will do the same as we do with the row-wise operation, then transpose back.

For the subgrid, we will use list index to extract the 3x3 subgrid, find preemptive sets and reduce markups, row by row but with only 3 markups per row.


```python
for r_s, c_s in itertools.product(range(3), range(3)):
    markup = [r[c_s * 3:c_s * 3 + 3] for r in markups[r_s * 3:r_s * 3 + 3]]
    markup = list(itertools.chain(*markup))
    preemptives = get_preemptive(markup)
    markup = reduce_markup(markup, preemptives)
    #print(markup)
    #markup_subgrid = [markup[k*3:k*3+3] for k in range(3)]

    for i in range(3):
        markups[r_s * 3 + i][c_s * 3: c_s * 3 + 3] = markup[i * 3:i * 3 + 3]
```

Putting it all together. This block of codes will keep reducing until we cannot reduce markups. Note that we will enter the markup into the grid if there is only one candidate for the cell. We will define a function that will find a cell with only one candidate, in the similar manner as the next_empty() function in the previous part.


```python
markups = get_markup(grid)
[[len(m) for m in listofm] for listofm in markups]
```




    [[0, 0, 0, 0, 2, 3, 0, 0, 3],
     [3, 0, 0, 0, 0, 0, 2, 0, 3],
     [0, 4, 0, 4, 4, 5, 3, 4, 5],
     [5, 4, 0, 3, 0, 3, 3, 5, 0],
     [4, 3, 2, 0, 0, 0, 4, 3, 3],
     [0, 3, 4, 3, 0, 0, 0, 4, 3],
     [4, 4, 2, 0, 4, 3, 0, 2, 0],
     [4, 0, 2, 0, 3, 3, 0, 0, 2],
     [3, 0, 0, 2, 2, 0, 0, 0, 0]]



This line gives the length (or the number of) of markups in each cell. 0 implies the cell that is already filled in.


```python
grid = [[2,9,5,7,0,0,8,6,0],
         [0,3,1,8,6,5,0,2,0],
         [8,0,6,0,0,0,0,0,0],
         [0,0,7,0,5,0,0,0,6],
         [0,0,0,3,8,7,0,0,0],
         [5,0,0,0,1,6,7,0,0],
         [0,0,0,5,0,0,1,0,9],
         [0,2,0,6,0,0,3,5,0],
         [0,5,4,0,0,8,6,7,2]]

markups = get_markup(grid)
previous_markups = []

def next_definite(markups):
    markup_len = [[len(m) for m in listofm] for listofm in markups]
    
    for row in markup_len:
        if 1 in row:
            return (markup_len.index(row), row.index(1))
        
    return None, None


while markups != previous_markups:
    
    previous_markups = markups
    
    def_row, def_col = next_definite(markups)
    
    if def_row is not None:
        grid[def_row][def_col] = markups[def_row][def_col][0]
        markups = get_markup(grid)
        
    for row in range(9):
        markup = markups[row]
        preemptives = get_preemptive(markup)
        markup = reduce_markup(markup, preemptives)
        markups[row] = markup
    
    markups = list(map(list, zip(*markups)))
    for col in range(9):
        markup = markups[col]
        preemptives = get_preemptive(markup)
        markup = reduce_markup(markup, preemptives)
        markups[col] = markup
    markups = list(map(list, zip(*markups))) 
    
    for r_s, c_s in itertools.product(range(3), range(3)):
        markup = [r[c_s * 3:c_s * 3 + 3] for r in markups[r_s * 3:r_s * 3 + 3]]
        markup = list(itertools.chain(*markup))
        preemptives = get_preemptive(markup)
        markup = reduce_markup(markup, preemptives)

        for i in range(3):
            markups[r_s * 3 + i][c_s * 3: c_s * 3 + 3] = markup[i * 3:i * 3 + 3]
```

Now we have reached the step where the markup can no longer be reduced and we do not have solution yet. We will make a guess on the first empty cell available, then repeat the above step. To make this easier, we will make the above block of codes function.

![](http://pi.math.cornell.edu/~mec/Summer2009/meerkamp/Site/Solving_any_Sudoku_II_files/mepham_markup.png)


```python
def crook(grid):
    
    markups = get_markup(grid)
    previous_markups = []

    while markups != previous_markups:

        previous_markups = markups

#         def_row, def_col = next_definite(markups)

#         if def_row is not None:
#             grid[def_row][def_col] = markups[def_row][def_col][0]
#             markups = get_markup(grid)

        for row in range(9):
            markup = markups[row]
            preemptives = get_preemptive(markup)
            markup = reduce_markup(markup, preemptives)
            markups[row] = markup

        markups = list(map(list, zip(*markups)))
        for col in range(9):
            markup = markups[col]
            preemptives = get_preemptive(markup)
            markup = reduce_markup(markup, preemptives)
            markups[col] = markup
        markups = list(map(list, zip(*markups))) 

        for r_s, c_s in itertools.product(range(3), range(3)):
            markup = [r[c_s * 3:c_s * 3 + 3] for r in markups[r_s * 3:r_s * 3 + 3]]
            markup = list(itertools.chain(*markup))
            preemptives = get_preemptive(markup)
            markup = reduce_markup(markup, preemptives)

            for i in range(3):
                markups[r_s * 3 + i][c_s * 3: c_s * 3 + 3] = markup[i * 3:i * 3 + 3]
    
    empty_row, empty_col = next_empty(grid)
    
    if empty_row is None:
        return(grid)

    for guess in markups[empty_row][empty_col]:
        #print("Guess in ({r},{c}):{n}".format(r=empty_row, c=empty_col, n=guess))
        
        if check_conditions(grid, empty_row, empty_col, guess):
            grid[empty_row][empty_col] = guess

            if crook(grid):
                return(grid)
        
        grid[empty_row][empty_col] = 0
        
    return False
```


```python
grid = [[2,9,5,7,0,0,8,6,0],
         [0,3,1,8,6,5,0,2,0],
         [8,0,6,0,0,0,0,0,0],
         [0,0,7,0,5,0,0,0,6],
         [0,0,0,3,8,7,0,0,0],
         [5,0,0,0,1,6,7,0,0],
         [0,0,0,5,0,0,1,0,9],
         [0,2,0,6,0,0,3,5,0],
         [0,5,4,0,0,8,6,7,2]]
```


```python
grid_sol = crook(grid)
grid_sol
```




    [[2, 9, 5, 7, 4, 3, 8, 6, 1],
     [4, 3, 1, 8, 6, 5, 9, 2, 7],
     [8, 7, 6, 1, 9, 2, 5, 4, 3],
     [3, 8, 7, 4, 5, 9, 2, 1, 6],
     [6, 1, 2, 3, 8, 7, 4, 9, 5],
     [5, 4, 9, 2, 1, 6, 7, 3, 8],
     [7, 6, 3, 5, 2, 4, 1, 8, 9],
     [9, 2, 8, 6, 7, 1, 3, 5, 4],
     [1, 5, 4, 9, 3, 8, 6, 7, 2]]




```python
validateSolution(grid_sol)
```




    True



Voila! We solved the sudoku puzzle with the Crook's algorithm.

Below is the code put together so that you can try it yourselves!


```python
def check_conditions(grid, row, col, n):   
    ## check_conditions: list of lists, int, int, int -> boolean
    
    if n in grid[row]:
        return False
    
    if any([r[col] == n for r in grid]):
        return False
    
    r_start = (row // 3) * 3
    c_start = (col // 3) * 3
    
    for r, c in itertools.product(range(3),range(3)):
        if grid[r_start + r][c_start + c] == n:
            return False
        
    return True

def get_markup(grid):
    ## get_markup(): listof listof int -> listof listof int
    ## This helper function returns a list of list of integers
    ## where each list of integer is a markup of a corresponding cell 
    markup_list = []

    for row in range(9):
        r = [[]]*9

        for col in range(9):
            markup = []
            if grid[row][col] != 0:
                continue

            for candidate in range(1,10):
                if check_conditions(grid, row, col, candidate):
                    markup.append(candidate)

            r[col] = markup

        markup_list.append(r)
        
    return(markup_list)


def get_preemptive(listofMarkup):
    
    preemptive_list = []
    for m in listofMarkup:
        if len(m) != 0:
            if len(m) == listofMarkup.count(m):
                if m not in preemptive_list:
                    preemptive_list.append(m)
    return(preemptive_list)

def reduce_markup(listofMarkup, preemptive_list):
    # compute row-, col- or subgrid-wise
    if len(preemptive_list) == 0:
        return(listofMarkup)
    
    for p in preemptive_list:
        return([[m for m in l if (m not in p)] if l != p else p for l in listofMarkup])

def next_empty(grid):
    ## next_empty(): listof lists -> int, int
    ## next_empty() is a helper function that searches for the next empty cell in the given sudoku puzzle
    for row in grid:
        if 0 in row:
            return (grid.index(row), row.index(0))
        
    return None, None

def crook(grid):
    
    markups = get_markup(grid)
    previous_markups = []

    while markups != previous_markups:

        previous_markups = markups

        for row in range(9):
            markup = markups[row]
            preemptives = get_preemptive(markup)
            markup = reduce_markup(markup, preemptives)
            markups[row] = markup

        markups = list(map(list, zip(*markups)))
        for col in range(9):
            markup = markups[col]
            preemptives = get_preemptive(markup)
            markup = reduce_markup(markup, preemptives)
            markups[col] = markup
        markups = list(map(list, zip(*markups))) 

        for r_s, c_s in itertools.product(range(3), range(3)):
            markup = [r[c_s * 3:c_s * 3 + 3] for r in markups[r_s * 3:r_s * 3 + 3]]
            markup = list(itertools.chain(*markup))
            preemptives = get_preemptive(markup)
            markup = reduce_markup(markup, preemptives)

            for i in range(3):
                markups[r_s * 3 + i][c_s * 3: c_s * 3 + 3] = markup[i * 3:i * 3 + 3]
    
    empty_row, empty_col = next_empty(grid)
    
    if empty_row is None:
        return(grid)

    for guess in markups[empty_row][empty_col]:
        
        if check_conditions(grid, empty_row, empty_col, guess):
            grid[empty_row][empty_col] = guess

            if crook(grid):
                return(grid)
        
        grid[empty_row][empty_col] = 0
        
    return False


def validateSolution(sudoku):
    ## To check if it is a valid solution:
    
    ## If any cell is empty:
    if any([0 in row for row in sudoku]):
        return(False)
    
    for n in range(1,10):
        for row in sudoku:
            if n not in row:
                return(False)
            
            for col in range(9):
                if n not in [r[col] for r in sudoku]:
                    return(False)
                
    
        ## In fact, if row and column-wise conditions are met, then subgrid condition is automatically met. 
        ## But we want to check it explicitly.
        for r_start, c_start in itertools.product(range(3),range(3)):
            if not any([n not in row[c_start * 3: c_start * 3 + 3] for row in grid[r_start * 3: r_start * 3 + 3]]):
                return(False)
            
    return(True)
```
