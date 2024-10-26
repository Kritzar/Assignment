import re

"""
Goals for extra points: 
    AND/OR expressions evaluated for left to right 
    conditions can have variables on both sides 
    >= <=  
    some error handling
    numbers with decimal 
"""

"""
age > 15
(age > 15 OR department = "CSE") AND (salary >= 10000 OR department = "BIO")
(((age > 22)) AND salary < 10000) OR age >   40 AND department="ECE"


"""


class TokenType:
    AND = "AND"
    OR = "OR"
    LPAREN = "("
    RPAREN = ")"
    OPERATOR = "OPERATOR"  # e.g., >, =, >=
    STRING = "STRING"  # e.g., "CSE"
    NUMBER = "NUMBER"  # e.g., 15, 10000
    IDENTIFIER = "IDENTIFIER"  # e.g., age, department, salary


class Token:
    def __init__(self, val):
        self.value = val
        self.type = self.determine_type(val)

        if self.type == TokenType.STRING:
            self.value = val[1:-1]

    def __repr__(self):
        if self.type == TokenType.STRING:
            return f'"{self.value}"'
        return self.value

    def determine_type(self, val: str) -> TokenType:
        if val == "AND":
            return TokenType.AND
        if val == "OR":
            return TokenType.OR
        if val == "(":
            return TokenType.LPAREN
        if val == ")":
            return TokenType.RPAREN
        if val in ("=", "<", ">", "<=", ">="):
            return TokenType.OPERATOR
        if val.startswith('"') or val.startswith("'"):
            return TokenType.STRING
        if val.isnumeric():
            return TokenType.NUMBER

        return TokenType.IDENTIFIER  # hope so.


class ASTNode:
    def __init__(self, left, operator, right):
        self.left: Token | ASTNode = left
        self.operator: Token = operator
        self.right: Token | ASTNode = right

    def test(self, data: dict) -> bool:
        raise NotImplementedError


class Operation(ASTNode):
    def __repr__(self):
        lines = [str(self.operator) + ":"]
        for child in (self.left, self.right):
            for line in str(child).split("\n"):
                lines.append("\t" + line)

        return "\n".join(lines)

    def test(self, data: dict):
        if self.operator.value == "AND":
            return self.left.test(data) and self.right.test(data)
        elif self.operator.value == "OR":
            return self.left.test(data) or self.right.test(data)
        else:
            raise Exception(
                "Error: Operation obj has operator value", self.operator.value
            )


class Comparison(ASTNode):
    def __repr__(self):
        return f"{self.left} {self.operator} {self.right}"

    def test(self, data: dict):
        left = (
            self.left.value
            if self.left.type != TokenType.IDENTIFIER
            else data.get(self.left.value, None)
        )
        right = (
            self.right.value
            if self.right.type != TokenType.IDENTIFIER
             else data.get(self.right.value, None )
        )

        if self.operator.value == '=':
            expr = f"'{left}' == '{right}'" 
        else: 
            expr = f"{left} {self.operator.value} {right}" 
        try:
            return eval(expr)
        except Exception as err:
            print(f'Error in evaluating expression: {expr}:', err)
            return False


class Parser:
    def __init__(self, tokens: list[Token]):
        self.tokens = tokens
        self.current_token_index = 0

    def parse(self):
        return self.expression()

    def expression(self) -> Comparison | Operation:
        # Start with a term and process logical operators (AND, OR).
        left = self.term()

        while self.current_token() and self.current_token().type in (
            TokenType.AND,
            TokenType.OR,
        ):
            operator = self.current_token()
            self.next_token()  # consume operator
            right = self.term()
            left = Operation(left, operator, right)

        return left

    def term(self) -> Comparison | Operation:
        # Handle individual comparisons or groupings
        if self.current_token().type == TokenType.LPAREN:
            self.next_token()  # consume '('
            expr = self.expression()
            if self.current_token().type != TokenType.RPAREN:
                raise SyntaxError("Expected ')'")
            self.next_token()  # consume ')'
            return expr

        elif self.current_token().type == TokenType.IDENTIFIER:
            left = self.current_token()
            self.next_token()  # consume identifier

            if (
                not self.current_token()
                or self.current_token().type != TokenType.OPERATOR
            ):
                raise SyntaxError("Expected operator after identifier")
            operator = self.current_token()
            self.next_token()  # consume operator

            if not self.current_token():
                raise SyntaxError("Expected value after operator")
            right = self.current_token()
            self.next_token()  # consume value (string or number)

            return Comparison(left, operator, right)

        raise Exception("Invalid syntax")

    def current_token(self):
        return (
            self.tokens[self.current_token_index]
            if self.current_token_index < len(self.tokens)
            else None
        )

    def next_token(self):
        self.current_token_index += 1


def split_into_tokens(string: str) -> list[Token]:
    # matches words and symbols.
    pattern = r'"\w+"|[\w.]+|[()]|[^\w\s"\']+'
    raw_tokens = re.findall(pattern, string)
    print(raw_tokens)

    tokens = [Token(token) for token in raw_tokens]
    return tokens


def get_rule(string: str):
    tokens = split_into_tokens(string)
    parser = Parser(tokens)

    return parser.parse()


if __name__ == "__main__":
    test = '(age > 15 OR department="CSE") AND (salary>=10000 OR department = "BIO")'
    # test = '(((age > 15)) OR  age <= 30 )'
    test = "((age>2))"

    result = get_rule(test)
    print(result)
