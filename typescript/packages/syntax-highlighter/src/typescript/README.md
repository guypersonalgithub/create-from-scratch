# Definition flow:

- const/var/let followed by a [variable-name], then, optionally:
- - type branch - encounter [:], and then expect a type, whether with a space next to the [:] or without.
- followed by [=], and then a value. If the value is of a function type, alter the [variable-name] token to be of type function.

# Type flow:

- Check for union types, take into consideration nested object types, or nested function types. A type ends while not nested, when encountering a [space] without [|] or [&] before it.
- Function types may have generics before them, so take into consideration a tag structure [<>] before [()].
- Generics often have a [,] at their end to differentiate from JSX/HTML tags in tsx files, maybe consider that for easier parsing.
- Only object values that are either existing types, or primitive types are colored as "types".
- Wrapping object values with parenthesis shouldn't affect the coloring or parsing, just treat them as irrelevant tokens, maybe give them a specific token type for the sake of potential customization by users.
