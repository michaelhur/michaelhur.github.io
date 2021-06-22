---
title: "Sudoku: A systemic approach to Sudoku - Part 1"
tags:
  - Python
  - Sudoku
  - Bruteforce
  - Backtracking
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

### 1. Backtracking. i.e. Brute-force

- Starting from the top left cell in the puzzle, we go through every unfilled cell from left to right, then top to bottom. 

- Try filling the square with a number between 1 and 9, following the rules stated above. 

- Continue the process until either 

    a) we reach a cell where no possible numeric input exist. go back to the previous supposedly unfilled square, trying with a different number starting there. (i.e. "Backtrack")

    b) we reach the last unfilled cell with only one possible input exist. i.e. Sudoku solved!

##### Aside:

Why list over numpy array in this project?

Numpy arrays are known to be faster than lists. Typically, it is true. But our approach involes assigning new values to entries in the list (or array). In this case, list operation tends to be faster than array operation. 

Checking it out:


```python
import numpy as np
import itertools
import timeit

array_test = np.random.randint(low = 1, high = 9, size=(9,9))
list_test = array_test.tolist()

%timeit for row, col in itertools.product(range(9),range(9)): array_test[row,col] = 10
%timeit for row, col in itertools.product(range(9),range(9)): list_test[row][col] = 10
```

    6.1 µs ± 38.5 ns per loop (mean ± std. dev. of 7 runs, 100000 loops each)
    3.2 µs ± 21.7 ns per loop (mean ± std. dev. of 7 runs, 100000 loops each)


As you can see assignment is almost twice faster with list than with numpy arrays. We can add conditional statement within to further test.


```python
%timeit for row, col in itertools.product(range(9),range(9)): array_test[row,col] = 10 if array_test[row,col] > 5 else 0
%timeit for row, col in itertools.product(range(9),range(9)): list_test[row][col] = 10 if list_test[row][col] > 5 else 0
```

    18.1 µs ± 178 ns per loop (mean ± std. dev. of 7 runs, 100000 loops each)
    5.52 µs ± 159 ns per loop (mean ± std. dev. of 7 runs, 100000 loops each)


With the conditional statement, the assignment is three times faster with list than numpy array.

## Backtracking Algorithm

1. Find an unfilled cell in the grid.

2. Enter 1 into the cell. Check if the insertion violates any rule of sudoku. 

    a) If it violates. Try inserting 2, 3, 4, ... , 9 until the rule is not violated
    
    b) If it does not violate, proceed to the next empty cell and enter 1, 2, ....
    
3. Repeat steps 1 and 2 until you reach the last cell in the grid, or no possible input is available for any empty cell.


#### Helper Functions

We will build helper functions that check rules of sudoku.

We need to check if the guess we make already exists in the row, column and subgrid we are about to enter into

1. Row-wise check

A row-sie check is pretty simple. Each list within the grid represent a row, so we can do

`n in row` to check if n (our guess) already exists in the row.


2. Column-wise check

i-th column of the grid is each represented by the i-th element of each row. That is, we need to loop through each row to extract i-th element of the row, then compute to see if our guess is already in the column.

`for row in grid:
    if grid[row][i] == n:
        return False`
        
or more pythonically:

`any([r[col] == n for r in grid])`

will check if any of the i-th element of each row is equal to our guess, n.



3. Subgrid check

Each subgrid is 3x3, with the (row, column) indices `[0:3] / [3:6] / [6:9]`. Since we only need to check the subgrid the cell belongs to, we will compute where to starting index is:

`row_number // 3`

will tell whether it is the first, second, or third subgrid vertically (or horizontally if we compute column-wise). Then we multiply it by 3 to find out the index in terms of grid row and column.

`row_number // 3 * 3`

This will be the starting index of the subgrid, then we add 3 (since it is 3x3 grid) to get the end index. To sum it up,

`row_start = row_number // 3 * 3`

`row_end = row_start + 3`

WOLG, `col_start = col_number // 3 * 3` and `col_end = col_start + 3`.

We will then loop through each of 9 cells within the subgrid to check if our guess is already in the subgrid.

`for r in range(row_start, row_end):
    for c in range(col_start, col_end):
        if grid[r][c] == n:
            return False`


```python
import itertools

def check_subgrid(grid, row, col, n):
    ## check_subgrid: listof lists, int, int, int -> boolean
    ## This helper function checks if input "n" is in the 3x3 subgrid.
    
    ## We need to find out which region the cell falls in. 
    r_start = (row // 3) * 3
    c_start = (col // 3) * 3
    
    for r, c in itertools.product(range(3),range(3)):
        if grid[r_start + r][c_start + c] == n:
            return False

    return True
```


```python
def check_row_and_col(grid, row, col, n):
    ## check_row_and_col: list of lists, int, int, int -> boolean
    
    ## check row-wise
    if n in grid[row]:
        return False
    
    ## check row-wise
    if any([r[col] == n for r in grid]):
        return False
    
    return True
```

Instead of checking each condition separately, we will do it in one single function.


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

#### Sudoku Solver


```python
def next_empty(grid):
    ## next_empty(): listof lists -> int, int
    ## next_empty() is a helper function that searches for the next empty cell in the given sudoku puzzle
    for row in grid:
        if 0 in row:
            return (grid.index(row), row.index(0))
        
    return None, None


def solve_sudoku(grid):
    ## solve_sudoku: listof lists -> listof lists
    ## solve_sudoku uses backtracking algorithm to solve the sudoku puzzle
    
    ## 1. Find the next empty cell.    
    row, col = next_empty(grid)
    
    ## If there is no empty cell, it means that all cells are filled. i.e. Sudoku Solved!
    if row is None:  
        return(grid)
    
    for n in range(1, 10): 
        ## 2. Enter 1, 2, 3, .... in the empty cell and check if it violates any rule.
        if check_conditions(grid, row, col, n):
            
            ## 3. If it does not violate the rules, then assign the value to the cell.
            grid[row][col] = n
            
            ## 4. Proceed to the next cell recursively.
            if solve_sudoku(grid):
                return(grid)
        
        ## If it violates any of the rules or does not have solution, empty the cell, 
        ## trying with different input
        grid[row][col] = 0

    ## 6. No possible combination of inputs solve the sudoku. i.e. No solution.
    return False
```


```python
grid = np.array([[5,3,0,0,7,0,0,0,0],
                 [6,0,0,1,9,5,0,0,0],
                 [0,9,8,0,0,0,0,6,0],
                 [8,0,0,0,6,0,0,0,3],
                 [4,0,0,8,0,3,0,0,1],
                 [7,0,0,0,2,0,0,0,6],
                 [0,6,0,0,0,0,2,8,0],
                 [0,0,0,4,1,9,0,0,5],
                 [0,0,0,0,8,0,0,7,9]])

grid = grid.tolist()
```


```python
solve_sudoku(grid)
```




    [[5, 3, 4, 6, 7, 8, 9, 1, 2],
     [6, 7, 2, 1, 9, 5, 3, 4, 8],
     [1, 9, 8, 3, 4, 2, 5, 6, 7],
     [8, 5, 9, 7, 6, 1, 4, 2, 3],
     [4, 2, 6, 8, 5, 3, 7, 9, 1],
     [7, 1, 3, 9, 2, 4, 8, 5, 6],
     [9, 6, 1, 5, 3, 7, 2, 8, 4],
     [2, 8, 7, 4, 1, 9, 6, 3, 5],
     [3, 4, 5, 2, 8, 6, 1, 7, 9]]




```python
grid2 = np.array([[3,2,0,0,0,0,0,0,0],
                 [0,0,0,4,0,0,2,0,9],
                 [0,0,5,0,9,0,0,6,0],
                 [1,0,7,0,0,8,0,0,0],
                 [0,0,0,0,5,0,0,0,4],
                 [0,0,0,0,0,0,8,0,1],
                 [0,6,0,0,0,3,7,0,0],
                 [9,3,0,2,0,0,6,0,8],
                 [5,0,0,0,1,4,0,3,0]])

grid2 = grid2.tolist()
```


```python
solve_sudoku(grid2)
```




    [[3, 2, 9, 5, 6, 1, 4, 8, 7],
     [8, 1, 6, 4, 3, 7, 2, 5, 9],
     [7, 4, 5, 8, 9, 2, 1, 6, 3],
     [1, 9, 7, 3, 4, 8, 5, 2, 6],
     [6, 8, 2, 1, 5, 9, 3, 7, 4],
     [4, 5, 3, 7, 2, 6, 8, 9, 1],
     [2, 6, 1, 9, 8, 3, 7, 4, 5],
     [9, 3, 4, 2, 7, 5, 6, 1, 8],
     [5, 7, 8, 6, 1, 4, 9, 3, 2]]
