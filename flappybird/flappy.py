import pygame
from sys import exit
import random


# game variables
GAME_WIDTH = 360
GAME_HEIGHT = 640

# bird class
bird_x = GAME_WIDTH / 8
bird_y = GAME_HEIGHT / 2
bird_width = 34
bird_height = 24


class Bird(pygame.Rect):
    def __init__(self, img):
        super().__init__(bird_x, bird_y, bird_width, bird_height)
        self.image = img


# pipe class
pipe_x = GAME_WIDTH
pipe_y = 0
pipe_width = 64
pipe_height = 512


class Pipe(pygame.Rect):
    def __init__(self, x, y, img):
        super().__init__(x, y, pipe_width, pipe_height)
        self.image = img
        self.passed = False


# initialize pygame and window before loading assets (safer across platforms)
pygame.init()

window = pygame.display.set_mode((GAME_WIDTH, GAME_HEIGHT))
pygame.display.set_caption("Flappy Bird")

clock = pygame.time.Clock()

create_pipes_timer = pygame.USEREVENT + 0
pygame.time.set_timer(create_pipes_timer, 1500)  # every 1.5 seconds


# game images
background_image = pygame.image.load("flappybirdbg.png")

bird_image = pygame.image.load("flappybird.png")
bird_image = pygame.transform.scale(bird_image, (bird_width, bird_height))

top_pipe_image = pygame.image.load("toppipe.png")
top_pipe_image = pygame.transform.scale(
    top_pipe_image, (pipe_width, pipe_height))

bottom_pipe_image = pygame.image.load("bottompipe.png")
bottom_pipe_image = pygame.transform.scale(
    bottom_pipe_image, (pipe_width, pipe_height))


# game logic

bird = Bird(bird_image)
pipes = []
velocity_x = -2
velocity_y = 0
gravity = 0.4
score = 0
game_over = False


def draw():
    window.blit(background_image, (0, 0))
    window.blit(bird.image, bird)

    for pipe in pipes:
        window.blit(pipe.image, pipe)

    text_str = str(int(score))
    text_font = pygame.font.SysFont("Comic Sans MS", 40)
    text_render = text_font.render(text_str, True, (255, 255, 255))
    window.blit(text_render, (5, 0))

    if game_over:
        go_font = pygame.font.SysFont("Comic Sans MS", 50)
        go_text = go_font.render(f"Game Over: {int(score)}", True, (255, 0, 0))
        go_rect = go_text.get_rect(center=(GAME_WIDTH // 2, GAME_HEIGHT // 2))
        window.blit(go_text, go_rect)

        sub_font = pygame.font.SysFont("Comic Sans MS", 22)
        sub_text = sub_font.render(
            "Press Space to restart or Q to close", True, (255, 255, 255))
        sub_rect = sub_text.get_rect(
            center=(GAME_WIDTH // 2, GAME_HEIGHT // 2 + 48))
        window.blit(sub_text, sub_rect)


def move():
    global velocity_y, score, game_over
    velocity_y += gravity
    bird.y += velocity_y
    bird.y = max(bird.y, 0)

    if bird.y > GAME_HEIGHT:
        game_over = True
        return

    for pipe in pipes:
        pipe.x += velocity_x

        if not pipe.passed and bird.x > pipe.x + pipe.width:
            score += 0.5
            pipe.passed = True

        if bird.colliderect(pipe):
            game_over = True
            return

    while len(pipes) > 0 and pipes[0].x < -pipe_width:
        pipes.pop(0)


def create_pipe():
    random_pipe_y = pipe_y - pipe_height/4 - random.random()*(pipe_height/2)
    opening_space = GAME_HEIGHT/4

    top_pipe = Pipe(pipe_x, pipe_y, top_pipe_image)
    top_pipe.y = random_pipe_y
    pipes.append(top_pipe)

    bottom_pipe = Pipe(pipe_x, pipe_y, bottom_pipe_image)
    bottom_pipe.y = top_pipe.y + pipe_height + opening_space
    pipes.append(bottom_pipe)
    print(len(pipes))


def reset_game():
    global pipes, velocity_y, score, game_over
    pipes = []
    velocity_y = 0
    score = 0
    game_over = False
    bird.x = bird_x
    bird.y = bird_y


while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            exit()

        if event.type == create_pipes_timer and not game_over:
            create_pipe()

        if event.type == pygame.KEYDOWN:
            # jump when playing
            if not game_over and event.key in (pygame.K_SPACE, pygame.K_UP, pygame.K_w):
                velocity_y = -6

            # restart or quit when game over
            if game_over:
                if event.key == pygame.K_SPACE:
                    reset_game()
                if event.key == pygame.K_q:
                    pygame.quit()
                    exit()

    # update game state only when not game over
    if not game_over:
        move()

    # always draw/update so the window remains responsive and shows game over
    draw()
    pygame.display.update()
    clock.tick(60)  # fps

