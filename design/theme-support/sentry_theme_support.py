from pygments.style import Style
from pygments.token import Keyword, Name, Comment, String, Error, \
     Number, Operator, Generic, Whitespace, Punctuation, Other, Literal


class SentryStyle(Style):
    #background_color = "#f8f8f8"
    default_style = ""

    styles = {
        # No corresponding class for the following:
        #Text:                     "", # class:  ''
        Whitespace:                "underline #f8f8f8",      # class: 'w'
        Error:                     "#a40000 border:#ef2929", # class: 'err'
        Other:                     "#000000",                # class 'x'

        Comment:                   "italic #c10000", # class: 'c'
        Comment.Preproc:           "noitalic",       # class: 'cp'

        Keyword:                   "#1791F8",   # class: 'k'
        Keyword.Constant:          "#1791F8",   # class: 'kc'
        Keyword.Declaration:       "#1791F8",   # class: 'kd'
        Keyword.Namespace:         "#1791F8",   # class: 'kn'
        Keyword.Pseudo:            "#1791F8",   # class: 'kp'
        Keyword.Reserved:          "#1791F8",   # class: 'kr'
        Keyword.Type:              "#1791F8",   # class: 'kt'

        Operator:                  "#582800",   # class: 'o'
        Operator.Word:             "#1791F8",   # class: 'ow' - like keywords

        Punctuation:               "#000000",   # class: 'p'

        # because special names such as Name.Class, Name.Function, etc.
        # are not recognized as such later in the parsing, we choose them
        # to look the same as ordinary variables.
        Name:                      "#000000",        # class: 'n'
        Name.Attribute:            "#c4a000",        # class: 'na' - to be revised
        Name.Builtin:              "#1791F8",        # class: 'nb'
        Name.Builtin.Pseudo:       "#3465a4",        # class: 'bp'
        Name.Class:                "#000000",        # class: 'nc' - to be revised
        Name.Constant:             "#000000",        # class: 'no' - to be revised
        Name.Decorator:            "#888",           # class: 'nd' - to be revised
        Name.Entity:               "#ce5c00",        # class: 'ni'
        Name.Exception:            "#cc0000",   # class: 'ne'
        Name.Function:             "#000000",        # class: 'nf'
        Name.Property:             "#000000",        # class: 'py'
        Name.Label:                "#f57900",        # class: 'nl'
        Name.Namespace:            "#000000",        # class: 'nn' - to be revised
        Name.Other:                "#000000",        # class: 'nx'
        Name.Tag:                  "#1791F8",   # class: 'nt' - like a keyword
        Name.Variable:             "#000000",        # class: 'nv' - to be revised
        Name.Variable.Class:       "#000000",        # class: 'vc' - to be revised
        Name.Variable.Global:      "#000000",        # class: 'vg' - to be revised
        Name.Variable.Instance:    "#000000",        # class: 'vi' - to be revised

        Number:                    "#990000",        # class: 'm'

        Literal:                   "#000000",        # class: 'l'
        Literal.Date:              "#000000",        # class: 'ld'

        String:                    "#c17200",        # class: 's'
        String.Backtick:           "#c17200",        # class: 'sb'
        String.Char:               "#c17200",        # class: 'sc'
        String.Doc:                "italic #c10000", # class: 'sd' - like a comment
        String.Double:             "#c17200",        # class: 's2'
        String.Escape:             "#c17200",        # class: 'se'
        String.Heredoc:            "#c17200",        # class: 'sh'
        String.Interpol:           "#c17200",        # class: 'si'
        String.Other:              "#c17200",        # class: 'sx'
        String.Regex:              "#c17200",        # class: 'sr'
        String.Single:             "#c17200",        # class: 's1'
        String.Symbol:             "#c17200",        # class: 'ss'

        Generic:                   "#000000",        # class: 'g'
        Generic.Deleted:           "#a40000",        # class: 'gd'
        Generic.Emph:              "italic #000000", # class: 'ge'
        Generic.Error:             "#ef2929",        # class: 'gr'
        Generic.Heading:           "bold #000080",   # class: 'gh'
        Generic.Inserted:          "#00A000",        # class: 'gi'
        Generic.Output:            "#888",           # class: 'go'
        Generic.Prompt:            "#745334",        # class: 'gp'
        Generic.Strong:            "bold #000000",   # class: 'gs'
        Generic.Subheading:        "bold #800080",   # class: 'gu'
        Generic.Traceback:         "bold #a40000",   # class: 'gt'
    }
