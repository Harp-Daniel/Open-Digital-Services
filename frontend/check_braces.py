
import sys

def check_braces(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    stack = []
    lines = content.split('\n')
    for line_num, line in enumerate(lines, 1):
        for col_num, char in enumerate(line, 1):
            if char == '{':
                stack.append((line_num, col_num))
            elif char == '}':
                if not stack:
                    print(f"Extra closing brace at line {line_num}, col {col_num}")
                    return
                stack.pop()
    
    if stack:
        for line_num, col_num in stack:
            print(f"Unclosed opening brace at line {line_num}, col {col_num}")
    else:
        print("All braces are balanced.")

if __name__ == "__main__":
    check_braces(sys.argv[1])
