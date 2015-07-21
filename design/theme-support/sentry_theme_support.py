from pygments.style import Style
from pygments.token import Keyword, Name, Comment, String, Error, \
     Number, Operator, Generic, Whitespace, Punctuation, Other, Literal


black = "#111111"
trim = "#d0d8de"
gray_dark = "#4b4f5c"
gray = "#696D80"
gray_light = "#B5B9BD"
orange = "#F78300"
sentry_orange = "#fb4226"
blue = "#2eb0f7"
green = "#34c08b"
yellow = "#fece09"
red = "#e8535a"
pink = "#DB3B8A"
purple = "#a47ac6"
teal = "#45c2c9"


class SentryStyle(Style):
    #background_color = "#f8f8f8"
    default_style = ""

    styles = {
        # No corresponding class for the following:
        #Text:                     "", # class:  ''
        Whitespace:                "underline #f8f8f8",      # class: 'w'
        Error:                     "#a40000 border:#ef2929", # class: 'err'
        Other:                     black,                # class 'x'

        Comment:                   "italic " + red,  # class: 'c'
        Comment.Preproc:           "noitalic",       # class: 'cp'

        Keyword:                   blue,   # class: 'k'
        Keyword.Constant:          blue,   # class: 'kc'
        Keyword.Declaration:       blue,   # class: 'kd'
        Keyword.Namespace:         blue,   # class: 'kn'
        Keyword.Pseudo:            blue,   # class: 'kp'
        Keyword.Reserved:          blue,   # class: 'kr'
        Keyword.Type:              blue,   # class: 'kt'

        Operator:                  gray_dark,   # class: 'o'
        Operator.Word:             blue,   # class: 'ow' - like keywords

        Punctuation:               black,   # class: 'p'

        # because special names such as Name.Class, Name.Function, etc.
        # are not recognized as such later in the parsing, we choose them
        # to look the same as ordinary variables.
        Name:                      black,        # class: 'n'
        Name.Attribute:            orange,        # class: 'na' - to be revised
        Name.Builtin:              blue,        # class: 'nb'
        Name.Builtin.Pseudo:       teal,        # class: 'bp'
        Name.Class:                black,        # class: 'nc' - to be revised
        Name.Constant:             black,        # class: 'no' - to be revised
        Name.Decorator:            gray,           # class: 'nd' - to be revised
        Name.Entity:               orange,        # class: 'ni'
        Name.Exception:            red,   # class: 'ne'
        Name.Function:             black,        # class: 'nf'
        Name.Property:             black,        # class: 'py'
        Name.Label:                sentry_orange,        # class: 'nl'
        Name.Namespace:            black,        # class: 'nn' - to be revised
        Name.Other:                black,        # class: 'nx'
        Name.Tag:                  blue,   # class: 'nt' - like a keyword
        Name.Variable:             black,        # class: 'nv' - to be revised
        Name.Variable.Class:       black,        # class: 'vc' - to be revised
        Name.Variable.Global:      black,        # class: 'vg' - to be revised
        Name.Variable.Instance:    black,        # class: 'vi' - to be revised

        Number:                    teal,        # class: 'm'

        Literal:                   black,        # class: 'l'
        Literal.Date:              black,        # class: 'ld'

        String:                    green,        # class: 's'
        String.Backtick:           green,        # class: 'sb'
        String.Char:               green,        # class: 'sc'
        String.Doc:                "italic " + purple, # class: 'sd' - like a comment
        String.Double:             green,        # class: 's2'
        String.Escape:             green,        # class: 'se'
        String.Heredoc:            green,        # class: 'sh'
        String.Interpol:           green,        # class: 'si'
        String.Other:              green,        # class: 'sx'
        String.Regex:              green,        # class: 'sr'
        String.Single:             green,        # class: 's1'
        String.Symbol:             green,        # class: 'ss'

        Generic:                   black,        # class: 'g'
        Generic.Deleted:           red,        # class: 'gd'
        Generic.Emph:              "italic " + black, # class: 'ge'
        Generic.Error:             red,        # class: 'gr'
        Generic.Heading:           "bold " + blue,   # class: 'gh'
        Generic.Inserted:          green,        # class: 'gi'
        Generic.Output:            gray,           # class: 'go'
        Generic.Prompt:            gray_dark,        # class: 'gp'
        Generic.Strong:            "bold " + black,   # class: 'gs'
        Generic.Subheading:        "bold " + gray_dark,   # class: 'gu'
        Generic.Traceback:         "bold " + red,   # class: 'gt'
    }
