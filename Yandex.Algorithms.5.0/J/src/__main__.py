from sys import stdin


def main():
    document_width, line_height, character_height = map(int, input().split())
    text = stdin.read()

    tokenizer = Tokenizer[TokenType]({
        TokenType.NEW_LINE: NewLineParser(),
        TokenType.SPACE: SpaceParser(),
        TokenType.WORD: WordParser(),
        TokenType.IMAGE: ImageParser(),
    })
    tokenizer.tokenize(text)


if __name__ == '__main__':
    main()