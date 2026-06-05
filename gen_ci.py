import sys

content = open(sys.argv[1], 'r', encoding='utf-8').read()
content_written = False

# Read from write_yml_content.py which will have the YAML
with open(sys.argv[2], 'w', encoding='utf-8') as f:
    f.write(content)
