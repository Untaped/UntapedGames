import pygame
import random

# Initialize pygame
pygame.init()

# Constants
WIDTH, HEIGHT = 300, 600
GRID_SIZE = 30
COLUMNS = WIDTH // GRID_SIZE
ROWS = HEIGHT // GRID_SIZE
FPS = 10

# Colors
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
COLORS = [
    (0, 255, 255),  # Cyan
    (255, 0, 0),    # Red
    (0, 255, 0),    # Green
    (255, 165, 0),  # Orange
    (0, 0, 255),    # Blue
    (128, 0, 128),  # Purple
    (255, 255, 0)   # Yellow
]

# Tetromino shapes
SHAPES = [
    [[1, 1, 1, 1]],
    [[1, 1, 1],
     [0, 1, 0]],
    [[1, 1, 1],
     [1, 0, 0]],
    [[1, 1, 1],
     [0, 0, 1]],
    [[1, 1],
     [1, 1]],
    [[0, 1, 1],
     [1, 1, 0]],
    [[1, 1, 0],
     [0, 1, 1]]
]

# Classes
class Tetromino:
    def __init__(self, shape, color):
        self.shape = shape
        self.color = color
        self.x = COLUMNS // 2 - len(shape[0]) // 2
        self.y = 0
    
    def move(self, dx, dy):
        self.x += dx
        self.y += dy
    
    def rotate(self):
        self.shape = [list(row) for row in zip(*self.shape[::-1])]

def check_collision(tetromino, grid):
    for i, row in enumerate(tetromino.shape):
        for j, cell in enumerate(row):
            if cell:
                x, y = tetromino.x + j, tetromino.y + i
                if x < 0 or x >= COLUMNS or y >= ROWS or grid[y][x]:
                    return True
    return False

def merge_tetromino(tetromino, grid):
    for i, row in enumerate(tetromino.shape):
        for j, cell in enumerate(row):
            if cell:
                grid[tetromino.y + i][tetromino.x + j] = tetromino.color

def clear_lines(grid):
    new_grid = [row for row in grid if any(cell == BLACK for cell in row)]
    while len(new_grid) < ROWS:
        new_grid.insert(0, [BLACK] * COLUMNS)
    return new_grid

def draw_grid(screen, grid):
    for y in range(ROWS):
        for x in range(COLUMNS):
            pygame.draw.rect(screen, grid[y][x], (x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE), 0)
            pygame.draw.rect(screen, WHITE, (x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE), 1)

def main():
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    clock = pygame.time.Clock()
    grid = [[BLACK] * COLUMNS for _ in range(ROWS)]
    current_tetromino = Tetromino(random.choice(SHAPES), random.choice(COLORS))

    running = True
    while running:
        screen.fill(BLACK)
        draw_grid(screen, grid)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_LEFT:
                    current_tetromino.move(-1, 0)
                    if check_collision(current_tetromino, grid):
                        current_tetromino.move(1, 0)
                elif event.key == pygame.K_RIGHT:
                    current_tetromino.move(1, 0)
                    if check_collision(current_tetromino, grid):
                        current_tetromino.move(-1, 0)
                elif event.key == pygame.K_DOWN:
                    current_tetromino.move(0, 1)
                elif event.key == pygame.K_UP:
                    current_tetromino.rotate()
                    if check_collision(current_tetromino, grid):
                        for _ in range(3):
                            current_tetromino.rotate()

        current_tetromino.move(0, 1)
        if check_collision(current_tetromino, grid):
            current_tetromino.move(0, -1)
            merge_tetromino(current_tetromino, grid)
            grid = clear_lines(grid)
            current_tetromino = Tetromino(random.choice(SHAPES), random.choice(COLORS))
            if check_collision(current_tetromino, grid):
                running = False

        for i, row in enumerate(current_tetromino.shape):
            for j, cell in enumerate(row):
                if cell:
                    pygame.draw.rect(screen, current_tetromino.color, 
                                     ((current_tetromino.x + j) * GRID_SIZE, 
                                      (current_tetromino.y + i) * GRID_SIZE, 
                                      GRID_SIZE, GRID_SIZE), 0)

        pygame.display.flip()
        clock.tick(FPS)

    pygame.quit()

if __name__ == "__main__":
    main()
