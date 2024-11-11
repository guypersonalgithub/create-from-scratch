The expected syntax of the tokenizer is listed here:

# Sections: 
- A section is either the very start of the input, or within parenthesis, absolute or function sections.
- Characters such as "+", "*", "/", "^", ")" are not expected to be at the very start of a section.

# Numeric values:
- A numeric value can have only up to one dot.
- A value starting with a dot would be automatically considered as a numeric value, and a 0 would be added to the left of the dot.
- The character ")" shouldn't appear after a numeric value only if its within parenthesis.

# Parenthesis:
- A parenthesis is alawys expected to have an ending ")" character.
